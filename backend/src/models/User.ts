import mongoose ,{InferSchemaType}from "mongoose"
import { UserDocument } from "../types/User"

const userSchema = new mongoose.Schema<UserDocument>({
    username:{
        type: String,
        required: true,
        unique: true,
        immutable: true
    },
    fullname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        immutable: true
    },
    bio:{
        type:String
    },
    password:{
        type: String,
        required: true
    },
    followers:{
        type:Number,
        default: 0
    },
    following:{
        type:Number,
        default: 0
    },
    profile_picture:{
        type:String
    },
    verified:{
        type:Boolean,
        default: false
    },
    token: {
        type: String 
    },
    otp:{
        type:String,
    },
    isFollowed:{
        type: mongoose.Schema.Types.Boolean,
        default: false
    }
})

type UserType = InferSchemaType<typeof userSchema>
const User = mongoose.model<UserType>("User",userSchema)
export default User