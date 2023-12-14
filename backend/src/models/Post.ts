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
        maxlength:400,
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
    hashtags:[{
        type: String,
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
    }],
    isRepost:{
        type: Boolean,
        default: false
    },
    Repost:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

const Post = mongoose.model("Post",PostSchema)
export default Post