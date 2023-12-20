import mongoose, { Schema } from "mongoose";

const ReplySchema =new mongoose.Schema({
    user:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    postId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:"Post"
    },
    content:{
        type:String,
        required:true
    }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})


const Reply = mongoose.model("Reply",ReplySchema)
export default Reply
