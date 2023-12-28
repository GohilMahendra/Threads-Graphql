import { CustomRequest } from "../middlewares/jwtTokenAuth"
import { Response } from "express";
import User from "../models/User";
import Follower from "../models/Follower";
import mongoose from "mongoose";
import { UserDocument } from "../types/User";
import { getSignedUrl } from "../utilities/S3Utils";

const followUser = async(req:CustomRequest,res:Response) =>
{
    const transaction = await mongoose.startSession()
    try
    {
       await transaction.withTransaction(async()=>{
        const currentUserId = req.userId; 
        const followedUserId = req.params.userId; 
    
        // Check if the users exist
        const [currentUser, followedUser] = await Promise.all([
          User.findById(currentUserId),
          User.findById(followedUserId),
        ]);
    
        if (!currentUser || !followedUser) {
          return res.status(404).json({
            message: 'User not found',
          });
        }
     
        const isCurrentFollowedAleady =await Follower.findOne({follower:currentUserId},{following:followedUserId})

        if(isCurrentFollowedAleady)
        {
            return res.status(200).json({
                message: "user is already follwing the given profile"
            })
        }

        await User.findByIdAndUpdate(currentUserId, { $inc: { following: 1 } });
        await User.findByIdAndUpdate(followedUserId, { $inc: { following: 1 } });
    
        const newFollower = new Follower({
            follower: currentUserId,
            following:followedUserId
        })
        newFollower.save()
        return res.status(200).json({
          message: 'User followed successfully',
        });
       })
    }
    catch(err)
    {
        return res
    }
    finally{
        transaction.endSession()
    }
}
const getUserFollowings = async(req:CustomRequest,res:Response) =>
{
    try
    {
        const followingId = req.params.userId
        console.log(followingId)
        if(!followingId)
        {
            return res.status(401).json({
                message:"missing the follower Id"
            })
        }

        const lastOffsetParam = req.query.lastOffset as string
        const pagaSizeParam = req.query.pageSize as string
        const pageSize = parseInt(pagaSizeParam,10) | 10

        const quary:any= 
        {
            follower : followingId
        }

        if(lastOffsetParam)
        {
            quary._id = { $gt: new mongoose.Types.ObjectId(lastOffsetParam) }
        }

        const followings = await Follower.find(quary)
        .populate<{following:UserDocument}>({
            path:"following",
            select:"-token -otp -password"
        }).limit(pageSize)

        await Promise.all(followings.map(async(following)=>{
            if(following.following.profile_picture)
            {
                following.following.profile_picture = await getSignedUrl(following.following.profile_picture)
            }
        }))
        return res.status(200).json({
            data:followings,
            lastOffset: followings.length == pageSize ?
             followings[followings.length-1]._id:null
        })
    
    }
    catch(err)
    {
        return res.status(500).json({
            err:err
        })
    }
}
const getCurrentUserFollowing = async(req:CustomRequest,res:Response) =>
{
    try
    {
        const userId = req.userId
       
        const lastOffsetParam = req.query.lastOffset as string
        const pagaSizeParam = req.query.pageSize as string
        const pageSize = parseInt(pagaSizeParam,10) | 10

        const quary:any= 
        {
            follower : userId
        }

        if(lastOffsetParam)
        {
            quary._id = { $gt: new mongoose.Types.ObjectId(lastOffsetParam) }
        }

        const followings = await Follower.find(quary)
        .populate<{following:UserDocument}>({
            path:"following",
            select:"-token -otp -password"
        }).limit(pageSize)

        await Promise.all(followings.map(async(following)=>{
           
            if(following.following.profile_picture)
            {
                following.following.profile_picture = await getSignedUrl(following.following.profile_picture)
            }
            following.following.isFollowed = true
        }))
        return res.status(200).json({
            data:followings,
            lastOffset: followings.length == pageSize ?
             followings[followings.length-1]._id:null
        })
    
    }
    catch(err)
    {
        return res.status(500).json({
            err:err
        })
    }
}
const unFollowUser = async(req:CustomRequest,res:Response) =>
{
    const transaction = await mongoose.startSession()
    try
    {
       await transaction.withTransaction(async()=>{
        const currentUserId = req.userId; 
        const followedUserId = req.params.userId; 
    
        // Check if the users exist
        const [currentUser, followedUser] = await Promise.all([
          User.findById(currentUserId),
          User.findById(followedUserId),
        ]);
    
        if (!currentUser || !followedUser) {
          return res.status(404).json({
            message: 'User not found',
          });
        }
     
        const isCurrentFollowedAleady =await Follower.findOne({follower:currentUserId},{following:followedUserId})

        if(!isCurrentFollowedAleady)
        {
            return res.status(200).json({
                message: "User is not following Profile"
            })
        }

        await User.findByIdAndUpdate(currentUserId, { $inc: { following: -1 } });
        await User.findByIdAndUpdate(followedUserId, { $inc: { following: -1 } });
    
        await Follower.findOneAndDelete({follower:currentUser,following:followedUserId})
        return res.status(200).json({
          message: 'unfollowed successfully',
        });
       })
    }
    catch(err)
    {
        return res
    }
    finally{
        transaction.endSession()
    }
}

export default {followUser,getUserFollowings,getCurrentUserFollowing,unFollowUser}