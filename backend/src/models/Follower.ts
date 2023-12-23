import mongoose,{ Schema } from "mongoose";

const followerSchema = new Schema({
    follower:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    following:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

const Follower = mongoose.model("Follower",followerSchema)
export default Follower