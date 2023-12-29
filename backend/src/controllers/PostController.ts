import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Post from "../models/Post";
import { getSignedUrl, uploadToS3 } from "../utilities/S3Utils";
import { CustomRequest } from "../middlewares/jwtTokenAuth";
import mongoose, { ObjectId, Schema } from "mongoose";
import Like from "../models/Like";
import Reply from "../models/Reply";
import { UserDocument } from "../types/User";
import { generateThumbnail } from "../utilities/Thumbnail";
import { PostDocument } from "../types/Post";
import Follower from "../models/Follower";
import { extractHashtags } from "../utilities/Content";
const createPost = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.userId
        const content = req.body.content
        const is_repost = req.body.is_repost
        const postId = req.body.postId

        if (is_repost && !postId) {
            return res.status(400).json({
                message: "PostId can't be null for repost"
            })
        }
        const media = req.files as Express.Multer.File[]
        if (!is_repost && !content && !media) {
            return res.status(400).json({
                message: "no content provided for post"
            })
        }
        let hashTags:string[] = []
        if(content)
        {
            hashTags = extractHashtags(content)
        }

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
                const thumbnail = await generateThumbnail(file, thumbnailPath)
                media.thumbnail = thumbnail.Key
            }
            files.push(media)
        }
        const newPost = new Post({
            content: content,
            media: files,
            user: userId,
            hashtags: hashTags,
        })
        if (is_repost) {
            newPost.isRepost = is_repost
            newPost.Repost = postId
        }
        await newPost.save()
        res.status(200).json({
            message: "success fully post created"
        })
    }
    catch (err) {
        return res.status(500).json({
            message: "internal server error"
        })
    }
}

const getPosts = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.userId
        const quary: any = {}
        const lastOffset = req.query.lastOffset as string
        const pageSizeParam = req.query.pageSize as string;
        const post_type = req.query.post_type as string
        const pageSize = parseInt(pageSizeParam, 10) || 10;
        if (lastOffset) {
            quary._id = { $gt: new mongoose.Types.ObjectId(lastOffset) }
        }

        if (post_type == "following") {
            const followings = await Follower.find({ follower: userId })
            const followingIds = followings.map((following) => following.following?._id)
            quary.user = { $in: followingIds }
        }
        const posts = await Post.find(quary)
            .sort({ created_at: -1, _id: 1 })
            .populate<{ user: UserDocument }>({
                path: "user",
                model: "User",
                select: "-password -token -otp",
            }).
            populate<{ Repost: PostDocument & { user: UserDocument } }>({
                path: "Repost",
                populate: {
                    path: "user",
                    select: "-password -token -otp",
                },
            }).
            limit(pageSize).lean()
        let userPosts = posts
        const updatedUserPosts = await Promise.all(userPosts.map(async (post, index: number) => {
            const media = post.media;
            const user = post.user;
            if (user.profile_picture) {
                user.profile_picture = await getSignedUrl(user.profile_picture);
            }
            for (const mediaFile of media) {
                mediaFile.media_url = await getSignedUrl(mediaFile.media_url);
                if (mediaFile.thumbnail) {
                    mediaFile.thumbnail = await getSignedUrl(mediaFile.thumbnail);
                }
            }
            const exist_liked = await Like.exists({ user: userId, post: post._id });
            const isLiked = exist_liked != null;
            post.isLiked = isLiked;
            //  return post
        }));

        await Promise.all(userPosts.map(async (post, index: number) => {
            if (post.isRepost && post.Repost) {
                const user = post.Repost.user
                const media = post.Repost.media
                if (user.profile_picture) {
                    const key = user.profile_picture
                    const uri = await getSignedUrl(key)
                    user.profile_picture = uri
                }
                for (const mediaFile of media) {
                    mediaFile.media_url = await getSignedUrl(mediaFile.media_url);
                    if (mediaFile.thumbnail) {
                        mediaFile.thumbnail = await getSignedUrl(mediaFile.thumbnail);
                    }
                }
                post.Repost.media = media
                post.Repost.user = user

            }
        }));


        res.status(200).json({
            data: userPosts,
            meta: {
                pagesize: pageSize,
                lastOffset: (userPosts.length == pageSize) ? userPosts[userPosts.length - 1]._id : null
            }
        })
    }
    catch (err) {
        res.status(500).json({
            message: "internal server Error"
        })
    }
}

const getPostsByUser = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.params.userId
        const quary: any = {}
        const lastOffset = req.query.lastOffset as string
        const pageSizeParam = req.query.pageSize as string;
        const post_type = req.query.post_type as string
        const pageSize = parseInt(pageSizeParam, 10) || 10;
        quary.user = userId
        if (lastOffset) {
            quary._id = { $gt: new mongoose.Types.ObjectId(lastOffset) }
        }
        if (post_type === "Repost") {
            quary.isRepost = true
        }

        const posts = await Post.find(quary)
            .sort({ created_at: -1, _id: 1 })
            .populate<{ user: UserDocument }>({
                path: "user",
                select: "-password -token -otp",
            }).
            populate<{ Repost: PostDocument& {user:UserDocument}}>({
                path: "Repost",
                populate: {
                    path: "user",
                    select: "-password -token -otp",
                },
            }).
            limit(pageSize).lean()
        let userPosts = posts
        const updatedUserPosts = await Promise.all(userPosts.map(async (post, index: number) => {
            const media = post.media;
            const user = post.user;
            if (user.profile_picture) {
                user.profile_picture = await getSignedUrl(user.profile_picture);
            }
            for (const mediaFile of media) {
                mediaFile.media_url = await getSignedUrl(mediaFile.media_url);
                if (mediaFile.thumbnail) {
                    mediaFile.thumbnail = await getSignedUrl(mediaFile.thumbnail);
                }
            }
            const exist_liked = await Like.exists({ user: userId, post: post._id });
            const isLiked = exist_liked != null;
            post.isLiked = isLiked;

        }));

        await Promise.all(userPosts.map(async (post, index: number) => {
            if (post.isRepost && post.Repost) {
                const user = post.Repost.user
                const media = post.Repost.media
                if (user.profile_picture) {
                    const key = user.profile_picture
                    const uri = await getSignedUrl(key)
                    user.profile_picture = uri
                }
                for (const mediaFile of media) {
                    mediaFile.media_url = await getSignedUrl(mediaFile.media_url);
                    if (mediaFile.thumbnail) {
                        mediaFile.thumbnail = await getSignedUrl(mediaFile.thumbnail);
                    }
                }
                post.Repost.media = media
                post.Repost.user = user

            }
        }));


        res.status(200).json({
            data: userPosts,
            meta: {
                pagesize: pageSize,
                lastOffset: (userPosts.length == pageSize) ? userPosts[userPosts.length - 1]._id : null
            }
        })
    }
    catch (err) {
        res.status(500).json({
            message: "internal server Error"
        })
    }
}

const likePost = async (req: CustomRequest, res: Response) => {
    const transacttion = await mongoose.startSession()
    try {
        await transacttion.withTransaction(async () => {
            const userId = req.userId
            const postId = req.params.postId

            if (!userId || !postId) {
                return res.status(401).json({
                    message: "invalid params"
                })
            }
            const post = await Post.findById(postId)
            if (!post) {
                return res.status(404).json({
                    message: "not found the post"
                })
            }
            const existingLike = await Like.findOne({ user: userId, post:postId });
            if (existingLike) {
                return res.status(200).json({
                    message: "post is already liked by current user"
                })
            }

            post.likes++
            const newLike = new Like({
                post: postId,
                user: userId
            })
            await newLike.save()
            await post.save()

            res.status(200).json({
                message: "liked succesfully"
            })
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err
        })
    }
    finally {
        transacttion.endSession()
    }
}

const unLikePost = async (req: CustomRequest, res: Response) => {
    const transaction = await mongoose.startSession()
    try {
        await transaction.withTransaction(async () => {
            const userId = req.userId
            const postId = req.params.postId
            if (!userId || !postId) {
                return res.status(404).json({
                    message: "invalid params"
                })
            }
            const post = await Post.findById(postId)
            if (!post) {
                return res.status(404).json({
                    message: "not found the post"
                })
            }
            const exist_liked = await Like.exists({ user: userId, post: postId })
            const isLiked = exist_liked != null
            if (!isLiked) {
                return res.status(200).json({
                    message: "post is already un-liked"
                })
            }
            if (post.likes > 0)
                post.likes--

            await Like.findOneAndDelete({ user: userId, post: postId })
            await post.save()

            res.status(200).json({
                success: true,
                message: "unLiked succesfully"
            })
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err
        })
    }
    finally {
        transaction.endSession()
    }
}

const commentPost = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.userId
        const postId = req.params.postId
        const content = req.body.content

        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: { replies: 1 } },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({
                message: "post not found!"
            })
        }
        const newReply = new Reply({
            content: content,
            post: postId,
            user: userId
        })
        await newReply.save()

        res.status(200).json({
            message: "successfully replied on post!",
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err
        })
    }
}

const getComments = async (req: CustomRequest, res: Response) => {
    try {
        const postId = req.params.postId
        const lastOffset = req.query.lastOffset as string
        const pageSizeParam = req.query.pageSize as string;
        const pageSize = parseInt(pageSizeParam, 10) || 10;
        const quary: any = { postId: postId }
        if (lastOffset) {
            quary._id = { $gt: new mongoose.Types.ObjectId(lastOffset) }
        }

        if (!postId) {
            return res.status(401).json({
                message: "invalid quary params"
            })
        }
        const comments = await Reply.find(quary)
            .populate<{ user: UserDocument }>({
                path: "user",
                select: "-password -token -otp",
            }).
            sort({
                // created_at: 1,
                _id: 1
            }).limit(pageSize)
        await Promise.all(
            comments.map(async (comment) => {
                if (comment.user.profile_picture)
                    comment.user.profile_picture = await getSignedUrl(comment.user.profile_picture)
            })
        )
        return res.json({
            data: comments,
            meta: {
                pagesize: pageSize,
                lastOffset: (comments.length == pageSize) ? comments[comments.length - 1]._id : null
            }
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err
        })
    }
}

const deletePost = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.userId
        const postId = req.params.postId

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({
                messsage: "post not found"
            })
        }
        const objectUserId = new mongoose.Types.ObjectId(userId) || ""
        if (!objectUserId.equals(post.user)) {
            return res.status(401).json({
                message: "you are not allowed to do this action"
            })
        }
        await Reply.deleteMany({ post: postId });
        await Like.deleteMany({ post: postId })
        await post.deleteOne()
        return res.status(200).json({
            message: "successfully delete the post"
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err
        })
    }
}

const getPostLikeUsers = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.userId
        const postId = req.params.postId
        const lastOffset = req.query.lastOffset as string
        const pageSizeParam = req.query.pageSize as string;
        const pageSize = parseInt(pageSizeParam, 10) || 10;
        const quary: any = { postId: postId }
        if (lastOffset) {
            quary._id = { $gt: new mongoose.Types.ObjectId(lastOffset) }
        }

        if(!postId)
        {
            return res.status(400).json({
                messgae:"missing post Id"
            })
        }

        const likes = await Like.find({ postId: postId }).populate<{userId:UserDocument}>({
            path: "userId",
            select: "-password -token -otp"
        }).limit(pageSize)

        const users = likes.map(like=>like.userId)

        await Promise.all(users.map(async(user)=>{
            const isFollowing = Follower.exists({follower:userId,following: user._id})
            if(isFollowing!=null)
            user.isFollowed = true
        }))

        return res.status(200).json({
            data: users
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err
        })
    }
}

export default { createPost, getPosts, getPostsByUser, likePost, commentPost, deletePost, unLikePost, getComments }