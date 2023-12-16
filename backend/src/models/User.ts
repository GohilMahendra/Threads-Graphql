import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    fullname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
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
    }
})

const User = mongoose.model("User",userSchema)
export type UserType = typeof User
export default User