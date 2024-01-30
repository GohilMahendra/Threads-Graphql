
import mongoose,{InferSchemaType} from "mongoose"
const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        default: "",
        maxlength: 500,
    },
    media: [{
        media_type: {
            type: String,
            required: true
        },
        media_url: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
            default: null
        }
    }],
    hashtags: [{
        type: String,
    }],
    likes: {
        type: Number,
        default: 0
    },
    replies: {
        type: Number,
        default: 0
    },
    isRepost: {
        type: Boolean,
        default: false
    },
    Repost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    isLiked: {
        type: Boolean,
        default: false
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
const Post = mongoose.model("Post", PostSchema)
export default Post