import { extractHashtags } from "../../utilities/Content"
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl, uploadToS3 } from "../../utilities/S3Utils";
import { generateThumbnail } from "../../utilities/Thumbnail";
import { Follower, Like, Post } from "../../models";
import { Readable } from "stream";
import mongoose from "mongoose";
import { UserDocument } from "../../types/User";
import { PostDocument } from "../../types/Post";

interface ProfilePictureUpload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => Readable;
  }
export const createPost = async ({userId,content,isRepost = false,postId,media=[]}:{
    userId:string,
    content?:string,
    isRepost: boolean,
    postId?:string,
    media?: ProfilePictureUpload[]
}) => {
    try {
        if (isRepost && !postId) {
           throw new Error("PostId can't be null for repost")
        }
        if (!isRepost && !content && !media) {
           throw new Error("no content provided for post")
        }
        let hashTags: string[] = []
        if (content) {
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
        if (isRepost) {
            newPost.isRepost = isRepost
            newPost.Repost =new mongoose.Types.ObjectId(postId)
        }
        await newPost.save()
        return {
            message: "post created SuccessFully"
        }
    }
    catch (err) {
       throw new Error("internal server error")
    }
}
export const getPosts = async ({userId,lastOffset,pageSize=10,post_type}:{
    userId:string,
    lastOffset?: string,
    pageSize?: number,
    post_type?: string
}) => {
    try {
        const quary: any = {}
    
        if (lastOffset) {
            quary._id = { $lt: new mongoose.Types.ObjectId(lastOffset) }
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
        return {
            data: userPosts,
            meta: {
                pagesize: pageSize,
                lastOffset: (userPosts.length == pageSize) ? userPosts[userPosts.length - 1]._id : null
            }
        }
    }
    catch (err) {
        throw new Error("internal server Erro")
    }
}
