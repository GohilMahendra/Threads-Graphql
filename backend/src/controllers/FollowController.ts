import { CustomRequest } from "../middlewares/jwtTokenAuth"
import { Response } from "express";
import User from "../models/User";
import Follower from "../models/Follower";
import mongoose from "mongoose";


const FollowUser = async(req:CustomRequest,res:Response) =>
{
    try
    {
        const userId = req.userId
        const followingId = req.params.followingId

        const current_user = await User.findById(userId)
        const following_user = await User.findById(followingId)
        if(!current_user || !following_user)
        {
            return res.status(404).json({
                message:"user not found"
            })
        }
       const followingLookup = await Follower.findById(current_user)
       const followerLookup = await Follower.findById(followingId)
       const isAlreadyFollowing = followingLookup?.followings.findIndex((item)=>item._id.equals(new mongoose.Types.ObjectId(followingId)))
       const isAlreadyFollowed = followerLookup?.followers.findIndex((item)=>item._id.equals(new mongoose.Types.ObjectId(followingId)))

       if(isAlreadyFollowed!= -1 || isAlreadyFollowing!= -1)
       {
        return res.status(200).json({
            message:"useralready followed"
        })
       }
        current_user.following++
        following_user.followers++
    
    }
    catch(err)
    {
        return res
    }
}

export {FollowUser}