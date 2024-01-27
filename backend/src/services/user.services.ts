// user.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from "uuid";
import { User } from "../models"
import { getSignedUrl, uploadToS3 } from '../utilities/S3Utils';

const getSalt = async () => {
    const salted = await bcrypt.genSalt(10)
    return salted
}

const getHashPassword = async (password: string) => {
    const newSalt = await getSalt()
    const hashed = await bcrypt.hash(password, newSalt)
    return hashed
}
export const signIn = async ({ email, password }: { email: string; password: string }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.verified) {
    throw new Error('User not verified');
  }

  const passwordMatched = await bcrypt.compare(password, user.password);

  if (!passwordMatched) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET || '');

  await User.findOneAndUpdate({ _id: user._id }, { token });

  user.token = token;

  return user;
};

export const signUp = async ({ username, fullname, email, password }:{
    username:string, 
    fullname:string, 
    email:string,
    password:string
}) => {
    try {
        email = email.toLowerCase()
        const isUserExist = await User.findOne({ email })
        if (isUserExist) {
           throw Error("User does Not exist")
        }
        const hashedPassword = await getHashPassword(password)

        const newUser = new User({
            username,
            fullname,
            email,
            password: hashedPassword
        })

        newUser.otp = "123456"
        newUser.verified = true
        await newUser.save()
        throw Error("success !! please check your email for verification")
    }
    catch (err) {
        throw Error("Interval Server Error")
    }
}

export const updateUser = async({userId,fullName,bio,profile_picture}:{
  userId: string
  fullName?: string,
  bio?: string,
  profile_picture?: any
}) =>
{
  try {
    if (!fullName && !bio && (!profile_picture)) {
        throw new Error("At least one of fullName, bio, or profile_picture should be present")
    }

    if (fullName !== undefined && (typeof fullName !== 'string' || fullName.trim() === '')) {
       throw new Error("Invalid fullName")
    }

    if (bio !== undefined && (typeof bio !== 'string' || bio.trim() === '')) {
       throw new Error("Invalid bio")
    }

    if (profile_picture && (!profile_picture?.encoding || !profile_picture?.mimetype)) {
        throw new Error("Invalid profile_picture")
    }
    const updateUser: any = {}
    if (fullName) {
        updateUser.fullname = fullName.trim()
    }
    if (bio) {
        updateUser.bio = bio
    }
    if (profile_picture) {
        const file = profile_picture.file
        const extention = file.mimetype.split("/")[1]
        const name = uuid() + "." + extention
        const filepath = "user/" + userId + "/" + name
        const result = await uploadToS3(file, filepath)
        updateUser.profile_picture = result?.Key
    }
    const result = await User.updateOne({ _id: userId }, { $set: updateUser });
    console.log(result)
    if (result.matchedCount > 0) {
        const updatedUser = await User.findById(userId)
        if (updatedUser?.profile_picture)
            updatedUser.profile_picture = await getSignedUrl(updatedUser?.profile_picture)
        return updatedUser;
    } else {
       throw new Error("User not found or no fields were modified")
    }
}
catch (err) {
    throw new Error("Internal server Error")
}
}
