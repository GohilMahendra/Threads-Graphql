import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Post from "../models/Post";
import ffmpeg from "fluent-ffmpeg";
import { Readable, pipeline } from "stream";
import { s3, uploadToS3 } from "../utilities/S3Utils";
import { CustomRequest } from "../middlewares/jwtTokenAuth";
import ffprobeinstaller from '@ffprobe-installer/ffprobe';
import ffmpeginstaller from "@ffmpeg-installer/ffmpeg"
import { promisify } from "util";
import { createReadStream } from "fs";

ffmpeg.setFfmpegPath(ffmpeginstaller.path)
ffmpeg.setFfprobePath(ffprobeinstaller.path)

const generateThumbnail = async (file:Express.Multer.File,filename:string) => {
    
    try {
        const pipelineAsync = promisify(pipeline);
        const readableStream = Readable.from(file.buffer); 
        const thumbnailStream = ffmpeg()
          .input(readableStream)
          .inputFormat("mp4")
          .outputOptions("-ss", "00:00:02", "-vframes", "1")
          .outputFormat("image2")
          .on("end", () => console.log("Thumbnail generation finished"))
          .on("error", (err) => {
            console.error("Error during thumbnail generation:", err);
            // res.status(500).json({ message: "Failed to generate thumbnail" });
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
  

const createPost = async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId
        const content = req.body.content
        const hashtags = req.body.hashtags
        const is_repost = req.body.is_repost

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
            hashtags: hashtags || []
        })

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
        const posts = await Post.find({}).populate({
            path: "user",
            select: "-password -token",
        })

        let userPosts = posts
        for (let i = 0; i < userPosts.length; i++) {
            let post = userPosts[i];
            let media = post.media

            for (let j = 0; j < media.length; j++) {
                media[j].media_url = await s3.getSignedUrlPromise('getObject', {
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: media[j].media_url,

                });
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

export { createPost, getPosts }