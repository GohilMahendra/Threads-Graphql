import mongoose from "mongoose"
const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User", 
        required: true
    },
    content:{
        type: String,
        default:"",
        required: true
    },
    media:[{
       media_type: {
        type: String,
        required: true
       },
       media_url:{
        type: String,
        required: true
       }
    }],
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