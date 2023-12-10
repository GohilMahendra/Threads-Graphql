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
    password:{
        type: String,
        required: true
    },
    profile_picture:{
        type:String
    },
    verified:{
        type:Boolean,
        default: false
    },
    token: String
})

const User = mongoose.model("User",userSchema)
export default User