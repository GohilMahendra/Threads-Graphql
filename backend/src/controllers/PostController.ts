import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Post from "../models/Post";
import ffmpeg from "fluent-ffmpeg";
import { Readable, pipeline } from "stream";
import { s3, uploadToS3 } from "../utilities/S3Utils";
import { CustomRequest } from "../middlewares/jwtTokenAuth";
import ffprobeinstaller from '@ffprobe-installer/ffprobe';
import ffmpeginstaller from "@ffmpeg-installer/ffmpeg"
import mongoose from "mongoose";
import Like from "../models/Like";
import Reply from "../models/Reply";

ffmpeg.setFfmpegPath(ffmpeginstaller.path)
ffmpeg.setFfprobePath(ffprobeinstaller.path)

const generateThumbnail = async (file:Express.Multer.File,filename:string) => {
    
    try {
        const readableStream = Readable.from(file.buffer); 
        const thumbnailStream = ffmpeg()
          .input(readableStream)
          .inputFormat("mp4")
          .outputOptions("-ss", "00:00:02", "-vframes", "1")
          .outputFormat("image2")
          .on("end", () => console.log("Thumbnail generation finished"))
          .on("error", (err) => {
            console.error("Error during thumbnail generation:", err);
            throw Error("Failed to generate thumbnail" );
          })
          .pipe();
        
        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME || "",
          Key: filename,
          Body: thumbnailStream,
          ContentType: "image/png", // Adjust this to the correct content type based on your thumbnail format
        };
        
        return s3.upload(params).promise();
    } catch (error) {
      console.error(error);
      throw new Error("Failed to generate thumbnail");
    }
  };
  

const createPost = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.userId
        const content = req.body.content
        const hashtags = req.body.hashtags
        const is_repost = req.body.is_repost
        const postId = req.body.postId

        if(is_repost && !postId)
        {
            return res.status(400).json({
                message:"PostId can't be null for repost"
            })
        }

        const media = req.files as Express.Multer.File[]
        type mediaType = {
            media_type: string,
            media_url: string,
            thumbnail?: string
        }
        const files: mediaType[] = []
        for (const file of media) {
            const { mimetype } = file;
            const extention = mimetype.split("/")[1]
            const filename = uuidv4() + "." + extention
            const filePath = "posts" + "/" + userId + "/" + filename
            const result = await uploadToS3(file, filePath)
            const media: mediaType = {
                media_type: mimetype,
                media_url: result?.Key || "",
            }
            if (mimetype.includes("video")) {
                const thumbnailName = uuidv4() + ".jpeg"
                const thumbnailPath = "thumbnails/" + userId + "/" + thumbnailName
                const thumbnail =await generateThumbnail(file,thumbnailPath)
                 media.thumbnail = thumbnail.Key
            }
            files.push(media)
        }
        const newPost = new Post({
            content: content,
            media: files,
            user: userId,
            hashtags: hashtags,
        })
        if(is_repost)
        {
            newPost.isRepost = is_repost,
            newPost.Repost = postId    
        }
        await newPost.save()
        res.status(200).json({
            message: "success fully post created"
        })
    }
    catch (err) {
        console.log(JSON.stringify(err))
        return res.status(500).json({
            message: "internal server error"
        })
    }
}

const getPosts = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.userId
        const posts = await Post.find({}).populate({
            path: "user",
            select: "-password -token -otp",
        })

        let userPosts = posts
        for (let i = 0; i < userPosts.length; i++) {
            let post = userPosts[i];
            let media = post.media

            for (let j = 0; j < media.length; j++) {
                media[j].media_url = await s3.getSignedUrlPromise('getObject', {
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: media[j].media_url,
                    Expires: 2*60*60
                });

                if(media[j].thumbnail)
                {
                    media[j].thumbnail = await s3.getSignedUrlPromise('getObject', {
                        Bucket: process.env.AWS_S3_BUCKET_NAME,
                        Key: media[j].thumbnail,
                        Expires: 2*60*60
                    });
                }
            }

            const exist_liked = await Like.exists({userId:userId,postId: post._id})
            const isLiked = exist_liked!=null
            post.isLiked = isLiked
            if(post.isRepost)
            {
                 await post.populate({
                    path:"Repost",
                    populate: {
                        path: 'user',
                        select: '-password -token -otp',
                    }
                })
            }

            userPosts[i] = post
        }
    
        res.status(200).json({
            data: userPosts,
            length: posts.length
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: "internal server Error"
        })
    }
}

const likePost = async(req:CustomRequest,res:Response)=>
{
    try
    {
        const userId = req.userId
        const postId = req.params.postId
        if(!userId || !postId)
        {
            return res.status(404).json({
                message:"invalid params"
            })
        }
        
        const post = await Post.findById(postId)
        console.log(post)
        if(!post)
        {
            return res.status(404).json({
                message:"not found the post"
            })
        }
        post.likes++ 

        const newLike = new Like({
            postId: postId,
            userId: userId
        })
        await newLike.save()
        await post.save()

        res.status(200).json({
            message:"liked succesfully"
        })
    }
    catch(err)
    {
        return res.status(500).json({
            message: err
        })
    }
}

const unLikePost = async(req:CustomRequest,res:Response)=>
{
    try
    {
        const userId = req.userId
        const postId = req.params.postId
        if(!userId || !postId)
        {
            return res.status(404).json({
                message:"invalid params"
            })
        }
        
        const post = await Post.findById(postId)
        if(!post)
        {
            return res.status(404).json({
                message:"not found the post"
            })
        }
        const exist_liked = await Like.exists({userId:userId,postId: post._id})
        const isLiked = exist_liked!=null
        if(!isLiked)
        {
            return res.status(200).json({
                message:"post is already un-liked"
            })
        }

        if(post.likes > 0)
        post.likes--

        Like.deleteOne(exist_liked)
        await post.save()

        res.status(200).json({
            success: true,
            message:"unLiked succesfully"
        })
    }
    catch(err)
    {
        return res.status(500).json({
            message: err
        })
    }
}

const commentPost = async(req:CustomRequest,res:Response)=>
{
    try
    {
        const userId = req.userId
        const postId = req.params.postId
        const content = req.body.content

        const post = await Post.findById(postId)
        
        if(!post)
        {
            return res.status(404).json({
                message:"post not found!"
            })
        }

        post.replies++

        const newReply = new Reply({
            content:content,
            postId: postId,
            userId: userId
        })

        await newReply.save()
        await post.save()

        res.status(200).json({
            message:"successfully replied on post!"
        })
    
    }
    catch(err)
    {
        return res.status(500).json({
            message:err
        })
    }
}

const deletePost = async(req:CustomRequest,res:Response)=>
{
    try
    {
        const userId = req.userId
        const postId = req.params.postId

        const post = await Post.findById(postId)
        if(!post)
        {
            return res.status(404).json({
                messsage:"post not found"
            })
        }

        const objectUserId = new mongoose.Types.ObjectId(userId)
        if(!objectUserId.equals(post.user._id))
        {
            return res.status(401).json({
                message:"you are not allowed to do this action"
            })
        }

        await post.deleteOne()
        return res.status(200).json({
            message:"successfully delete the post"
        })
    }
    catch(err)
    {
        return res.status(500).json({
            message:err
        })
    }
}

export { createPost, getPosts,likePost,commentPost,deletePost,unLikePost }