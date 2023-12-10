import mongoose from "mongoose"
const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User", 
        required: true
    },
    is_media:{
        type: Boolean,
        default: false
    },
    media_type
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    replies:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        content: {
            type: String,
            required: true
        }
    }]
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

const Post = mongoose.model("Post",PostSchema)
export default Post