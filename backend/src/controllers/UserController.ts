import crypto from "crypto";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl, uploadToS3 } from "../utilities/S3Utils";
import { CustomRequest } from "../middlewares/jwtTokenAuth";
import otpGenerator from "otp-generator";
interface UpdateUserRequestBody {
    fullname?: string;
    bio?: string;
    profile_picture?: string
}

const getSalt = async () => {
    const salted = await bcrypt.genSalt(10)
    return salted
}

const getHashPassword = async (password: string) => {
    const newSalt = await getSalt()
    const hashed = await bcrypt.hash(password, newSalt)
    return hashed
}

const signInUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "user not found"
            })
        }

        if(user.verified == false)
        {
            return res.status(401).json({
                message:"user does not verified"
            })
        }

        const password_matched: boolean = await bcrypt.compare(password, user.password)

        if (!password_matched) {
            return res.status(404).json({
                message: "invalid credentials"
            })
        }

        const token = jwt.sign({
            userId: user._id,
        }, process.env.TOKEN_SECRET || "")

        user.token = token

        if(user.profile_picture)
        {
            user.profile_picture =await getSignedUrl(user.profile_picture)
        }
        console.log(user,"sign in Responsw")
        await user.save()
        return res.status(200).json({ user })
    }
    catch (err) {
        return res.status(500).json({
            message: "Error" + JSON.stringify(err)
        })
    }

}
const signUpUser = async (req: Request, res: Response) => {
    try {
        let { username, fullname, email, password } = req.body

        email = email.toLowerCase()
        const isUserExist = await User.findOne({ email })
        if (isUserExist) {
            return res.status(400).json({
                message: "Email already Exist!"
            })
        }
        const hashedPassword = await getHashPassword(password)

        const newUser = new User({
            username,
            fullname,
            email,
            password: hashedPassword
        })

        const otp =  otpGenerator.generate(6,{digits:true,upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false})
        newUser.otp = otp
        await newUser.save()

        sendVerificationEmail(newUser.email,otp)
        res.status(200).json({
            message: "success !! please check your email for verification"
        })
    }
    catch (err) {
        res.status(500).json({
            message: JSON.stringify(err)
        })
    }
}
const updateUser = async (req: CustomRequest, res: Response) => {
    try {
        
        const userId =req.userId
        console.log(req.userId,"id getting ferom middleare..")
        const { fullname, bio }: { fullname?: string; bio?: string } = req.body
        const profile_picture = req.file as Express.Multer.File
        if (!fullname && !bio && (!profile_picture || !profile_picture.buffer || !profile_picture.mimetype)) {
            return res.status(400).json({ error: 'At least one of fullName, bio, or profile_picture should be present' });
        }

        if (fullname !== undefined && (typeof fullname !== 'string' || fullname.trim() === '')) {
            return res.status(400).json({ error: 'Invalid fullName' });
        }

        if (bio !== undefined && (typeof bio !== 'string' || bio.trim() === '')) {
            return res.status(400).json({ error: 'Invalid bio' });
        }

        if (profile_picture && (!profile_picture.buffer || !profile_picture.mimetype)) {
            return res.status(400).json({ error: 'Invalid profile_picture' });
        }

        const user = await User.findById(userId)
        const updateUser: UpdateUserRequestBody = {}
        if (fullname) {
            updateUser.fullname = fullname.trim()
        }
        if (bio) {
            updateUser.bio = bio
        }

        if (profile_picture) {
            const extention = profile_picture.mimetype.split("/")[1]
            const name = uuidv4() + "." + extention
            const filepath = "user/" + userId + "/" + name
            const result = await uploadToS3(profile_picture, filepath)
            updateUser.profile_picture = result?.Key
        }

        const result = await User.updateOne({ _id: userId }, { $set: updateUser });
        if (result.modifiedCount > 0) {
            res.status(200).json({ success: true, message: "successfully updated user" });
        } else {
            // User not found or no fields were modified
            res.status(404).json({ error: 'User not found or no fields were modified' });
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal server Error"
        })
    }
}
const signOutUser = async (req: CustomRequest, res: Response) => {
    try {
        const token = req.header("token")

        const userId = req.userId

        const user = await User.findById(userId)


    }
    catch (err) {
        res.status(500).json({
            message: "Internal server Error"
        })
    }
}
const sendVerificationEmail = async (email: string,otp:string) => {
    const mailer_email = process.env.MAILER_EMAIL
    const mailer_password = process.env.MAILER_PASS
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: mailer_email,
            pass: mailer_password
        }
    })

    const mailOptions = {
        from: "Threds app",
        to: email,
        subject: "email verificaiton",
        text: `here is the otp for varification ${otp} `
    }
    try {
        await transporter.sendMail(mailOptions)
    }
    catch (err) {
        console.log(JSON.stringify(err))
    }
}

const verifyEmail = async (req: CustomRequest, res: Response) => {
    try {
        const email = req.body.email
        const otp = req.body.otp
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({
                message: "User does not exist!"
            })
        }

        if(otp != user.otp)
        {
            return res.status(501).json({
                message:"invalid Otp"
            })
        }

        user.verified = true
        user.token = undefined

        await user.save()

        return res.status(200).json({
            message: "User verified!"
        })

    }
    catch (err) {
        console.log(JSON.stringify(err))
        res.status(500).json({
            message: "Email verification failed"
        })
    }
}

export { signInUser, signUpUser, verifyEmail, updateUser }
