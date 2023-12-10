import crypto from "crypto";
import bcrypt from "bcrypt";
import { Request,Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
const generateSecrateKey=()=>
{
    const secretKey = crypto.randomBytes(32).toString("hex")
    return secretKey
}

const secretKey = generateSecrateKey()

const getSalt = async() =>
{
    const salted = await bcrypt.genSalt(10)
    return salted
}

const getHashPassword = async(password:string) =>
{
    const newSalt = await getSalt()
    const hashed = await bcrypt.hash(password,newSalt)
    return hashed
}

const signInUser = async(req:Request,res:Response) =>
{
    try{
        const {email,password} = req.body
        
        const user = await User.findOne({email})
        if(!user)
        {
            return res.status(400).json({
                message:"user not found"
            })
        }

        const password_matched:boolean =await bcrypt.compare(password,user.password)

        if(!password_matched)
        {
            return res.status(404).json({
                message:"invalid credentials"
            })
        }

        const token = jwt.sign({
            userId: user._id,
        }, secretKey)
        
        user.token = token
        await user.save()
        return res.status(200).json({user})
    }
    catch(err)
    {
        return res.status(500).json({
            message:"Error" + JSON.stringify(err)
        })
    }

}
const signUpUser = async(req:Request,res:Response) =>
{
    try{
        let {username,fullname,email,password} = req.body
        
        email  = email.toLowerCase()
        const isUserExist = await User.findOne({email})
        if(isUserExist)
        {
            return res.status(400).json({
                message: "Email already Exist!"
            })
        }
        const hashedPassword = await getHashPassword(password)
        
        const newUser = new User({
             username,
             fullname,
             email,
             password:hashedPassword
        })
        
        newUser.token = crypto.randomBytes(20).toString("hex")
        await newUser.save()
    
        sendVerificationEmail(newUser.email,newUser.token)
        res.status(200).json({
           message: "success !! please check your email for verification"
        })
       }
       catch(err)
       {
         res.status(500).json({
            message: JSON.stringify(err)
         })
       }
}


const sendVerificationEmail = async(email: string, token: string) =>
{
    const mailer_email = process.env.MAILER_EMAIL
    const mailer_password = process.env.MAILER_PASS
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user: mailer_email,
            pass: mailer_password
        }
    })

    const mailOptions = {
        from:"Threds app",
        to: email,
        subject: "email verificaiton",
        text:`here is the link please verify the email  http://localhost:3000/verify/${token}`
    }
    try{
        await transporter.sendMail(mailOptions)
    }
    catch(err)
    {
        console.log(JSON.stringify(err))
    }
}

const verifyEmail = async(req:Request,res:Response) =>
{
    try
    {
        const token = req.params.token
        const user = await User.findOne({token})
        if(!user)
        {
            return res.status(400).json({
                message:"User does not exist!"
            })
        }

        user.verified = true
        user.token = undefined

        await user.save()

        return res.status(200).json({
            message:"User verified!"
        })

    }
    catch(err)
    {
        console.log(JSON.stringify(err))
        res.status(500).json({
            message:"Email verification failed"
        })
    }
}


export  {signInUser,signUpUser,verifyEmail}
