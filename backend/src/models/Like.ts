import mongoose, { Schema } from "mongoose";

const LikeSchema =new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    postId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:"Post"
    }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})


const Like = mongoose.model("Like",LikeSchema)
export default Like
