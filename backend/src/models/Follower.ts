import mongoose,{ Schema } from "mongoose";

const followerSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        ref: "User", 
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