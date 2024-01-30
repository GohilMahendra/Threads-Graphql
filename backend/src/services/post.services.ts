import { extractHashtags } from "../utilities/Content"
import { v4 as uuidv4 } from "uuid";
import {
    ProfilePictureUpload,
    getSignedUrl,
    uploadToS3
} from "../utilities/S3Utils";
import { generateThumbnail } from "../utilities/Thumbnail";
import { Follower, Like, Post, Reply, User } from "../models";
import mongoose from "mongoose";
import { UserDocument } from "../types/User";
import {
    CommentActionInput,
    DeleteReplyInput,
    GetCommentsInput,
    GetPostRepostInput,
    PostActionInput,
    PostDocument,
    TextSearchInput,
    GetPostsInput,
    GetPostByUserInput
} from "../types/Post";

const createPost = async ({ userId, content, isRepost = false, postId, media = [] }: {
    userId: string,
    content?: string,
    isRepost: boolean,
    postId?: string,
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
            newPost.Repost = new mongoose.Types.ObjectId(postId)
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
const getPosts = async ({ userId, lastOffset, pageSize = 10, post_type }: GetPostRepostInput) => {
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
        throw new Error("internal server Error")
    }
}
const getPostsByUser = async ({ postUserId, userId, lastOffset, pageSize = 10, post_type }: GetPostByUserInput) => {
    try {
        const quary: any = {}
        quary.user = postUserId
        if (lastOffset) {
            quary._id = { $lt: new mongoose.Types.ObjectId(lastOffset) }
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
        throw new Error("internal server Error")
    }
}
const likePost = async ({ postId, userId }: PostActionInput) => {
    const transaction = await mongoose.startSession()
    let result = {}
    try {
        await transaction.withTransaction(async () => {
            if (!userId || !postId) {
                throw new Error("invalid params Provided")
            }
            const post = await Post.findById(postId)
            if (!post) {
                throw new Error("post not found")
            }
            const existingLike = await Like.findOne({ user: userId, post: postId });
            if (existingLike) {
                result = {
                    message: "post is already liked by current user"
                }
                return
            }
            post.likes++
            const newLike = new Like({
                post: postId,
                user: userId
            })
            await newLike.save()
            await post.save()
            result = {
                message: "post is already liked by current user"
            }
        })
    }
    catch (err: any) {
        throw new Error(err)
    }
    finally {
        transaction.endSession()
    }
    return result
}
const unLikePost = async ({ postId, userId }: PostActionInput) => {
    const transaction = await mongoose.startSession()
    let result = {}
    try {
        await transaction.withTransaction(async () => {
            if (!userId || !postId) {
                throw new Error("invalid params")
            }
            const post = await Post.findById(postId)
            if (!post) {
                throw new Error("not found the post")
            }
            const exist_liked = await Like.exists({ user: userId, post: postId })
            const isLiked = exist_liked != null
            if (!isLiked) {
                result = {
                    message: "post is already un-liked"
                }
                return
            }
            if (post.likes > 0)
                post.likes--

            await Like.findOneAndDelete({ user: userId, post: postId })
            await post.save()

            result = {
                message: "unLiked succesfully"
            }
        })
    }
    catch (err: any) {
        throw new Error(err)
    }
    finally {
        transaction.endSession()
    }
    return result
}
const commentPost = async ({ content, postId, userId }: CommentActionInput) => {
    try {

        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: { replies: 1 } },
            { new: true }
        );

        if (!post) {
            throw new Error("post not found!")
        }
        const newReply = new Reply({
            content: content,
            post: postId,
            user: userId
        })
        await newReply.save()
        return {
            message: "successfully replied on post!"
        }
    }
    catch (err: any) {
        throw new Error(err)
    }
}
const getComments = async ({ userId, lastOffset, pageSize = 10, postId }: GetCommentsInput) => {
    try {
        const quary: any = { post: postId }
        if (lastOffset) {
            quary._id = { $lt: new mongoose.Types.ObjectId(lastOffset) }
        }

        if (!postId) {
            throw new Error("invalid quary params")
        }
        const comments = await Reply.find(quary)
            .populate<{ user: UserDocument }>({
                path: "user",
                select: "-password -token -otp",
            }).
            sort({
                created_at: -1,
                _id: 1
            }).limit(pageSize)
        await Promise.all(
            comments.map(async (comment) => {
                if (comment.user.profile_picture)
                    comment.user.profile_picture = await getSignedUrl(comment.user.profile_picture)
            })
        )
        return {
            data: comments,
            meta: {
                pagesize: pageSize,
                lastOffset: (comments.length == pageSize) ? comments[comments.length - 1]._id : null
            }
        }
    }
    catch (err: any) {
        throw new Error(err)
    }
}
const deletePost = async ({ postId, userId }: PostActionInput) => {
    try {
        const post = await Post.findById(postId)
        if (!post) {
            throw new Error("post not found")
        }
        const objectUserId = new mongoose.Types.ObjectId(userId)
        if (!objectUserId.equals(post.user)) {
            throw new Error("you are not allowed to do this action")
        }
        await Reply.deleteMany({ post: postId });
        await Like.deleteMany({ post: postId })
        await post.deleteOne()
        return {
            message: "successfully delete the post"
        }
    }
    catch (err: any) {
        throw new Error(err)
    }
}
const getPostsFullTextSearch = async ({
    searchTerm,
    userId,
    lastOffset,
    pageSize
}: TextSearchInput) => {
    try {
        const pipeline: any[] = [];
        pipeline.push({
            $search: {
                index: "ContentSearch",
                text: {
                    query: searchTerm,
                    path: "content",
                },
            }
        })
        if (lastOffset) {
            pipeline.push({
                $match: {
                    _id: { $lt: new mongoose.Types.ObjectId(lastOffset) }
                },
            });
        }
        pipeline.push(
            {
                $sort: { created_at: -1, _id: 1 },
            },
            {
                $limit: pageSize,
            },
            {
                $lookup: {
                    from: User.collection.name,
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $project: {
                    "user.otp": 0,
                    "user.token": 0,
                    "user.password": 0
                }
            },
            {
                $lookup: {
                    from: Like.collection.name,
                    localField: "_id",
                    foreignField: "post",
                    as: "LikesLookup",
                },
            },
            {
                $addFields: {
                    isLiked: { $in: [userId, "$LikesLookup.user"] },
                },
            },
            {
                $project: {
                    "LikesLookup": 0
                }
            }

        );
        const posts = await Post.aggregate(pipeline);
        let userPosts = posts
        const updatedUserPosts = await Promise.all(userPosts.map(async (post, index: number) => {
            const media = post.media;
            const user = post.user as UserDocument;
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
                const user = post.Repost.user as UserDocument
                const media = (post.Repost as PostDocument).media
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
                lastOffset: (posts.length == pageSize) ? posts[posts.length - 1]._id : null
            }
        }
    } catch (err: any) {
        throw new Error("Internal Server Error")
    }
}
const getUserPosts = async ({
    userId,
    lastOffset,
    pageSize = 10,
    post_type
}: GetPostRepostInput) => {
    try {
        const quary: any = {}
        quary.user = userId
        if (lastOffset) {
            quary._id = { $lt: new mongoose.Types.ObjectId(lastOffset) }

        }
        if (post_type == "Repost") {
            quary.isRepost = true
        }
        const posts = await Post.find(quary)
            .sort({ created_at: -1, _id: 1 })
            .populate<{ user: UserDocument }>({
                path: "user",
                select: "-password -token -otp",
            }).populate<{ Repost: PostDocument & { user: UserDocument } }>({
                path: "Repost",
                populate: {
                    path: "user",
                    select: "-password -token -otp",
                },
            }).
            limit(pageSize)

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
                lastOffset: userPosts.length == pageSize ?
                    userPosts[userPosts.length - 1]._id : null

            }
        }
    }
    catch (err: any) {
        throw new Error("internal server Error")
    }
}
const getLikedPosts = async ({ userId, lastOffset, pageSize = 10 }: GetPostsInput) => {
    try {
        const quary: any = {}
        quary.user = userId

        if (lastOffset) {
            quary._id = { $lt: new mongoose.Types.ObjectId(lastOffset) }
        }
        const likedPosts = await Like.find(quary).
            sort({ created_at: -1, _id: 1 })
            .populate<{ user: UserDocument }>({
                path: 'user',
                select: '-password -token -otp'
            })
            .populate<{ post: PostDocument & { user: UserDocument, Repost: PostDocument & { user: UserDocument } } }>({
                path: 'post',
                populate: [
                    {
                        path: 'user',
                        select: '-password -token -otp',
                    },
                    {
                        path: 'Repost',
                        populate: {
                            path: 'user',
                            select: '-password -token -otp',
                        },
                    },
                ],
            })
            .limit(pageSize)
        let userPosts = likedPosts.map(likePost => likePost.post)
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
            post.isLiked = true;
        }));

        await Promise.all(userPosts.map(async (post, index: number) => {
            if (post.isRepost && post.Repost) {
                const user = post.Repost.user as UserDocument
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
                lastOffset: (userPosts.length == pageSize) ? likedPosts[likedPosts.length - 1]._id : null
            }
        }
    }
    catch (err: any) {
        throw new Error(err)
    }
}

const getRepliedPosts = async ({ userId, lastOffset, pageSize = 10 }: GetPostsInput) => {
    try {
        const quary: any = {}
        quary.user = userId

        if (lastOffset) {
            quary._id = { $lt: new mongoose.Types.ObjectId(lastOffset) }
        }

        const commentPosts = await Reply.find(quary).
            sort({ created_at: -1, _id: 1 })
            .populate<{ user: UserDocument }>({
                path: 'user',
                select: '-password -token -otp', // Optionally exclude certain fields
            })
            .populate<{ post: PostDocument & { user: UserDocument, Repost: PostDocument & { user: UserDocument } } }>({
                path: 'post',
                populate: [
                    {
                        path: 'user',
                        select: '-password -token -otp',
                    },
                    {
                        path: 'Repost',
                        populate: {
                            path: 'user',
                            select: '-password -token -otp',
                        },
                    },
                ],
            })
            .limit(pageSize)
        let userPosts = commentPosts
        const updatedUserPosts = await Promise.all(userPosts.map(async (commentPost, index: number) => {

            const commentUser = commentPost.user
            if (commentUser.profile_picture) {
                commentUser.profile_picture = await getSignedUrl(commentUser.profile_picture);
            }
            const media = commentPost.post.media
            const user = commentPost.post.user;
            if (user.profile_picture) {
                user.profile_picture = await getSignedUrl(user.profile_picture);
            }
            for (const mediaFile of media) {
                mediaFile.media_url = await getSignedUrl(mediaFile.media_url);
                if (mediaFile.thumbnail) {
                    mediaFile.thumbnail = await getSignedUrl(mediaFile.thumbnail);
                }
            }
            commentPost.user = commentUser
            commentPost.post.media = media
            commentPost.post.user = user
        }));

        await Promise.all(userPosts.map(async (commentPost, index: number) => {
            if (commentPost.post.isRepost && commentPost.post.Repost) {
                const user = commentPost.post.Repost.user
                const media = commentPost.post.Repost.media
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
                commentPost.post.Repost.media = media
                commentPost.post.Repost.user = user

            }
        }));
        return {
            data: commentPosts,
            meta: {
                pagesize: pageSize,
                lastOffset: commentPosts.length == pageSize ?
                    commentPosts[commentPosts.length - 1]._id : null
            }
        }
    }
    catch (err: any) {
        throw new Error(err)
    }
}
const deletePostReply = async ({ replyId, userId }: DeleteReplyInput) => {
    const transacttion = await mongoose.startSession()
    let result = {}
    try {
        await transacttion.withTransaction(async () => {
            if (!userId || !replyId) {
                throw new Error("invalid params")
            }

            const reply = await Reply.findById(replyId.toString());
            if (!reply) {
                throw new Error("not found the current reply")
            }
            if (!reply?.user.equals(new mongoose.Types.ObjectId(userId))) {
                throw new Error("you are not allowed to do this action")
            }
            await reply.deleteOne({ _id: reply._id })

            await Post.findByIdAndUpdate(userId, {
                $inc: { replies: -1 }
            });
            result = {
                message: "deleted reply succesfully"
            }
        })
    }
    catch (err: any) {
        throw new Error(err)
    }
    finally {
        transacttion.endSession()
    }
    return result
}
export default {
    createPost,
    getPosts,
    getPostsByUser,
    likePost,
    unLikePost,
    commentPost,
    getComments,
    deletePost,
    getPostsFullTextSearch,
    getUserPosts,
    getLikedPosts,
    getRepliedPosts,
    deletePostReply
}
