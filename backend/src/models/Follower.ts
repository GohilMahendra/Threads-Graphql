import mongoose,{ Schema } from "mongoose";

const followerSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    followers:[{
        type: Schema.Types.ObjectId,
        ref:"User"
    }],
    followings:[{
        type: Schema.Types.ObjectId,
        ref:"User"
    }]
})

const Follower = mongoose.model("Follower",followerSchema)
export default Follower