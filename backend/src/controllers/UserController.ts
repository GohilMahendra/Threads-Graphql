import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl, uploadToS3 } from "../utilities/S3Utils";
import { CustomRequest } from "../middlewares/jwtTokenAuth";
import otpGenerator from "otp-generator";
import mongoose from "mongoose";
import Post from "../models/Post";
import { UserDocument } from "../types/User";
import Like from "../models/Like";
import { PostDocument } from "../types/Post";
import Follower from "../models/Follower";
import Reply from "../models/Reply";
interface UpdateUserRequestBody {
    fullname?: string;
    bio?: string;
    profile_picture?: string
}

const getSalt = async () => {
    const salted = await bcrypt.genSalt(10)
    return salted
}

const getHashPassword = async (password: string) => {
    const newSalt = await getSalt()
    const hashed = await bcrypt.hash(password, newSalt)
    return hashed
}

const signInUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "user not found"
            })
        }

        if (user.verified == false) {
            return res.status(401).json({
                message: "user does not verified"
            })
        }

        const password_matched: boolean = await bcrypt.compare(password, user.password)

        if (!password_matched) {
            return res.status(404).json({
                message: "invalid credentials"
            })
        }
        if (user.profile_picture) {
            user.profile_picture = await getSignedUrl(user.profile_picture)
        }
        const token = jwt.sign({
            userId: user._id,
        }, process.env.TOKEN_SECRET || "")

        await User.findOneAndUpdate({ _id: user._id }, { token: token });
        user.token = token
        return res.status(200).json({ user })
    }
    catch (err) {
        return res.status(500).json({
            message: "Error" + JSON.stringify(err)
        })
    }

}
const signUpUser = async (req: Request, res: Response) => {
    try {
        let { username, fullname, email, password } = req.body

        email = email.toLowerCase()
        const isUserExist = await User.findOne({ email })
        if (isUserExist) {
            return res.status(400).json({
                message: "Email already Exist!"
            })
        }
        const hashedPassword = await getHashPassword(password)

        const newUser = new User({
            username,
            fullname,
            email,
            password: hashedPassword
        })

        const otp = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })
        newUser.otp = otp
        newUser.verified = true
        await newUser.save()

        sendVerificationEmail(newUser.email, otp)
        res.status(200).json({
            message: "success !! please check your email for verification"
        })
    }
    catch (err) {
        res.status(500).json({
            message: JSON.stringify(err)
        })
    }
}
const updateUser = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.userId
        const { fullname, bio }: { fullname?: string; bio?: string } = req.body
        const profile_picture = req.file as Express.Multer.File
        if (!fullname && !bio && (!profile_picture || !profile_picture.buffer || !profile_picture.mimetype)) {
            return res.status(400).json({ error: 'At least one of fullName, bio, or profile_picture should be present' });
        }

        if (fullname !== undefined && (typeof fullname !== 'string' || fullname.trim() === '')) {
            return res.status(400).json({ error: 'Invalid fullName' });
        }

        if (bio !== undefined && (typeof bio !== 'string' || bio.trim() === '')) {
            return res.status(400).json({ error: 'Invalid bio' });
        }

        if (profile_picture && (!profile_picture.buffer || !profile_picture.mimetype)) {
            return res.status(400).json({ error: 'Invalid profile_picture' });
        }


        const updateUser: UpdateUserRequestBody = {}
        if (fullname) {
            updateUser.fullname = fullname.trim()
        }
        if (bio) {
            updateUser.bio = bio
        }

        if (profile_picture) {
            const extention = profile_picture.mimetype.split("/")[1]
            const name = uuidv4() + "." + extention
            const filepath = "user/" + userId + "/" + name
            const result = await uploadToS3(profile_picture, filepath)
            updateUser.profile_picture = result?.Key
        }

        const result = await User.updateOne({ _id: userId }, { $set: updateUser });
        if (result.modifiedCount > 0) {
            const updatedUser = await User.findById(userId).select("-password -top -token")
            if(updatedUser?.profile_picture)
            updatedUser.profile_picture = await getSignedUrl(updatedUser?.profile_picture)
            res.status(200).json({
                success: true,
                user: updatedUser
                , message: "successfully updated user"
            });
        } else {
            // User not found or no fields were modified
            res.status(404).json({ error: 'User not found or no fields were modified' });
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal server Error"
        })
    }
}

const getUserById = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.userId
        const profileId = req.params.userId
        const user = await User.findOne({ _id: profileId }).select("-otp -password -token")

        if (!user) {
            return res.status(404).json({
                message: "user not found!"
            })
        }
        if (user.profile_picture) {
            user.profile_picture = await getSignedUrl(user.profile_picture)
        }
        const isFollowedBy = await Follower.findOne({ follower: userId, following: profileId })
        if (isFollowedBy) {
            user.isFollowed = true
        }
        return res.status(200).json({
            user: user
        })
    }
    catch (err) {
        res.status(500).json({
            message: "Internal server Error"
        })
    }
}

const signOutUser = async (req: CustomRequest, res: Response) => {
    try {
        const token = req.header("token")

        const userId = req.userId

        const user = await User.findById(userId)


    }
    catch (err) {
        res.status(500).json({
            message: "Internal server Error"
        })
    }
}
const sendVerificationEmail = async (email: string, otp: string) => {
    const mailer_email = process.env.MAILER_EMAIL
    const mailer_password = process.env.MAILER_PASS
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: mailer_email,
            pass: mailer_password
        }
    })

    const mailOptions = {
        from: "Threads app",
        to: email,
        subject: "email verificaiton",
        text: `here is the otp for verification ${otp} `
    }
    try {
        await transporter.sendMail(mailOptions)
    }
    catch (err:any) {
      throw new Error(err)
    }
}

const verifyEmail = async (req: CustomRequest, res: Response) => {
    try {
        const email = req.body.email
        const otp = req.body.otp
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                message: "User does not exist!"
            })
        }

        if (otp != user.otp) {
            return res.status(501).json({
                message: "invalid Otp"
            })
        }

        user.verified = true
        user.token = undefined
        user.otp = undefined
        await user.save()

        return res.status(200).json({
            message: "User verified!"
        })

    }
    catch (err) {
        console.log(JSON.stringify(err))
        res.status(500).json({
            message: "Email verification failed"
        })
    }
}

const SearchUsers = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.userId
        const quary = req.query.name

        const users = await User.aggregate([
            {
                $search: {
                    index: "UserSearch",
                    autocomplete: {
                        query: quary,
                        path: "username"
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    otp: 0,
                    token: 0,
                    password: 0
                }
            }
        ]);
        if (users.length == 0) {
            return res.status(200).json({
                data: []
            })
        }
        await Promise.all(users.map(async (user: any) => {

            const isUserFollowed = await Follower.findOne({ follower: userId, following: user._id })
            if (!isUserFollowed) {
                user.isFollowed = true

            }
            if (user.profile_picture)
                user.profile_picture = await getSignedUrl(user.profile_picture)
        }))
        return res.status(200).json({
            data: users
        })
    }
    catch (err) {
        return res.status(500).json({
            message: "Error" + JSON.stringify(err)
        })
    }

}

const getUserPosts = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.userId
        const quary: any = {}
        const lastOffset = req.query.lastOffset as string
        const pageSizeParam = req.query.pageSize as string;
        const pageSize = parseInt(pageSizeParam, 10) || 10;
        const post_type = req.query.post_type
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
            }).populate<{ Repost: PostDocument & {user:UserDocument}}>({
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

        res.status(200).json({
            data: userPosts,
            meta: {
                pagesize: pageSize,
                lastOffset: userPosts.length == pageSize ?
                    userPosts[userPosts.length - 1]._id : null

            }
        })
    }
    catch (err) {
        res.status(500).json({
            message: "internal server Error"
        })
    }
}
const getLikedPosts = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.userId
        const quary: any = {}
        const lastOffset = req.query.lastOffset as string
        const pageSizeParam = req.query.pageSize as string;
        const pageSize = parseInt(pageSizeParam, 10) || 10;

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

        let userPosts = likedPosts.map(likePost=>likePost.post)
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


        res.status(200).json({
            data: userPosts,
            meta: {
                pagesize: pageSize,
                lastOffset: (userPosts.length == pageSize) ? userPosts[userPosts.length - 1]._id : null
            }
        })
    }
    catch (err) {
        console.log("errorr  ===>", JSON.stringify(err))
        res.status(500).json({
            message: "internal server Error"
        })
    }
}

const getRepliedPosts = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.userId
        const quary: any = {}
        const lastOffset = req.query.lastOffset as string
        const pageSizeParam = req.query.pageSize as string;
        const pageSize = parseInt(pageSizeParam, 10) || 10;

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


        res.status(200).json({
            data: commentPosts,
            meta: {
                pagesize: pageSize,
                lastOffset: commentPosts.length == pageSize ?
                    commentPosts[commentPosts.length - 1]._id : null
            }
        })
    }
    catch (err) {
        console.log("errorr  ===>", JSON.stringify(err))
        res.status(500).json({
            message: "internal server Error"
        })
    }
}

const deletePostReply = async (req: CustomRequest, res: Response) => {
    const transacttion = await mongoose.startSession()
    try {
        await transacttion.withTransaction(async () => {
            const userId = req.userId
            const replyId = req.params.replyId

            if (!userId || !replyId) {
                return res.status(401).json({
                    message: "invalid params"
                })
            }

            const reply = await Reply.findById(replyId.toString());
            if (!reply) {
                return res.status(404).json({
                    message: "not found the current reply"
                })
            }
            if (!reply?.user.equals(new mongoose.Types.ObjectId(userId))) {
                return res.status(401).json({
                    message: "you are not allowed to do this action"
                })
            }
            await reply.deleteOne({ _id: reply._id })

            await Post.findByIdAndUpdate(userId, {
                $inc: { replies: -1 }
            });

            res.status(200).json({
                message: "deleted reply succesfully"
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
export default {
    signInUser,
    getUserPosts,
    signUpUser,
    verifyEmail,
    updateUser,
    SearchUsers,
    getUserById,
    getLikedPosts,
    getRepliedPosts,
    deletePostReply
}
