import mongoose, { Schema } from "mongoose";

const LikeSchema =new mongoose.Schema({
    user:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    post:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:"Post"
    }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})


const Like = mongoose.model("Like",LikeSchema)
export default Like
