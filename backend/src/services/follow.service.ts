import User from "../models/User";
import Follower from "../models/Follower";
import mongoose from "mongoose";
import { UserDocument } from "../types/User";
import { getSignedUrl } from "../utilities/S3Utils";
import {
    CurrentUserFollowings,
    FollowActionInput,
    GetFollowingsInput
} from "../types/Follow";
const followUser = async ({ followingId, userId }: FollowActionInput) => {
    const transaction = await mongoose.startSession()
    try {
        await transaction.withTransaction(async () => {

            const [currentUser, followedUser] = await Promise.all([
                User.findById(userId),
                User.findById(followingId),
            ]);

            if (!currentUser || !followedUser) {
                throw new Error("User not found")
            }

            const isCurrentFollowedAleady = await Follower.findOne({ follower: userId, following: followingId })

            if (isCurrentFollowedAleady) {
                return {
                    message: "user is already follwing the given profile"
                }
            }

            await User.findByIdAndUpdate(userId, { $inc: { following: 1 } });
            await User.findByIdAndUpdate(followingId, { $inc: { followers: 1 } });

            const newFollower = new Follower({
                follower: userId,
                following: followingId
            })
            newFollower.save()
            return {
                message: 'User followed successfully',
            }
        })
    }
    catch (err: any) {
        throw new Error(err)
    }
    finally {
        transaction.endSession()
    }
}
const getUserFollowings = async ({ followingId, pageSize = 10, lastOffset }: GetFollowingsInput) => {
    try {
        if (!followingId) {
            throw new Error("missing the follower Id")
        }

        const quary: any =
        {
            follower: followingId
        }

        if (lastOffset) {
            quary._id = { $gt: new mongoose.Types.ObjectId(lastOffset) }
        }

        const followings = await Follower.find(quary)
            .populate<{ following: UserDocument }>({
                path: "following",
                select: "-token -otp -password"
            }).limit(pageSize)

        await Promise.all(followings.map(async (following) => {
            if (following.following.profile_picture) {
                following.following.profile_picture = await getSignedUrl(following.following.profile_picture)
            }
        }))
        return {
            data: followings,
            lastOffset: followings.length == pageSize ?
                followings[followings.length - 1]._id : null
        }

    }
    catch (err: any) {
        throw new Error(err)
    }
}
const getCurrentUserFollowing = async ({ userId, lastOffset, pageSize = 10 }: CurrentUserFollowings) => {
    try {
        const quary: any =
        {
            follower: userId
        }

        if (lastOffset) {
            quary._id = { $gt: new mongoose.Types.ObjectId(lastOffset) }
        }

        const followings = await Follower.find(quary)
            .populate<{ following: UserDocument }>({
                path: "following",
                select: "-token -otp -password"
            }).limit(pageSize)

        await Promise.all(followings.map(async (following) => {

            if (following.following.profile_picture) {
                following.following.profile_picture = await getSignedUrl(following.following.profile_picture)
            }
            following.following.isFollowed = true
        }))
        console.log(followings)
        return {
            data: followings,
            meta: {
                pageSize: pageSize,
                lastOffset: followings.length == pageSize ?
                    followings[followings.length - 1]._id : null
            }
        }
    }
    catch (err: any) {
        throw new Error(err)
    }
}
const unFollowUser = async ({ followingId, userId }: FollowActionInput) => {
    const transaction = await mongoose.startSession()
    try {
        await transaction.withTransaction(async () => {

            const [currentUser, followedUser] = await Promise.all([
                User.findById(userId),
                User.findById(followingId),
            ]);

            if (!currentUser || !followedUser) {
                throw new Error("User not found")
            }

            const isCurrentFollowedAleady = await Follower.findOne({ follower: userId, following: followingId })

            if (!isCurrentFollowedAleady) {
                return {
                    message: "User is not following Profile"
                }
            }

            await User.findByIdAndUpdate(userId, { $inc: { following: -1 } });
            await User.findByIdAndUpdate(followingId, { $inc: { following: -1 } });

            await Follower.findOneAndDelete({ follower: currentUser, following: followingId })
            return {
                message: 'unfollowed successfully',
            }
        })
    }
    catch (err: any) {
        throw new Error(err)
    }
    finally {
        transaction.endSession()
    }
}

export default { followUser, getUserFollowings, getCurrentUserFollowing, unFollowUser }