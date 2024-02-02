import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from "uuid";
import { Follower, User } from "../models"
import { getSignedUrl, uploadToS3 } from '../utilities/S3Utils';
import {
    GetUserInput,
    SearchUsersInput,
    SignInInput,
    SignUpInput,
    UpdateUserInput,
    UserDocument,
    UserResponseDocument,
    VerifyEmailInput
} from "../types/User";
const getSalt = async () => {
    const salted = await bcrypt.genSalt(10)
    return salted
}

const getHashPassword = async (password: string) => {
    const newSalt = await getSalt()
    const hashed = await bcrypt.hash(password, newSalt)
    return hashed
}
const signIn = async ({ email, password }: SignInInput) => {
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

    if (user.profile_picture)
        user.profile_picture = await getSignedUrl(user.profile_picture)

    return user;
};

const signUp = async ({ username, fullname, email, password }: SignUpInput) => {
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
        return {
            messsage: "success !! please check your email for verification"
        }
    }
    catch (err) {
        throw Error("Interval Server Error")
    }
}

const updateUser = async ({ userId, fullName, bio, profile_picture }: UpdateUserInput) => {
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
        const updateUser: any = {}
        if (fullName) {
            updateUser.fullname = fullName.trim()
        }
        if (bio) {
            updateUser.bio = bio
        }
        if (profile_picture) {
            const file = await profile_picture.file
            const extention = file.mimetype.split("/")[1]
            const name = uuid() + "." + extention
            const filepath = "user/" + userId + "/" + name
            const result = await uploadToS3(file, filepath)
            updateUser.profile_picture = result?.Key
        }
        const result = await User.updateOne({ _id: userId }, { $set: updateUser });
        if (result.matchedCount > 0) {
            const userUpdated = await User.findById(userId)
            if (userUpdated?.profile_picture)
                userUpdated.profile_picture = await getSignedUrl(userUpdated?.profile_picture)

            return userUpdated;
        } else {
            throw new Error("User not found or no fields were modified")
        }
    }
    catch (err) {
        throw new Error("Internal server Error")
    }
}

const getUserById = async ({ profileId, userId }: GetUserInput): Promise<UserResponseDocument> => {
    try {
        const user = await User.findOne({ _id: profileId }).select("-otp -password -token")

        if (!user) {
            throw new Error("user not found!")
        }
        if (user.profile_picture) {
            user.profile_picture = await getSignedUrl(user.profile_picture)
        }
        const isFollowedBy = await Follower.findOne({ follower: userId, following: profileId })
        if (isFollowedBy) {
            user.isFollowed = true
        }
        return user
    }
    catch (err: any) {
        throw new Error(err)
    }
}
const verifyEmail = async ({ email, otp }: VerifyEmailInput) => {
    try {
        const user = await User.findOne({ email })
        if (!user) {
            throw new Error("User does not exist!")
        }

        if (otp != user.otp) {
            throw new Error("invalid Otp")
        }

        user.verified = true
        user.token = undefined
        user.otp = undefined
        await user.save()
        return {
            message: "User verified!"
        }
    }
    catch (err: any) {
        throw new Error(err)
    }
}

const searchUsers = async ({ query, userId }: SearchUsersInput) => {
    try {
        const users = await User.aggregate([
            {
                $search: {
                    index: "UserSearch",
                    autocomplete: {
                        query: query,
                        path: "username"
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    otp: 0,
                    token: 0,
                    password: 0
                }
            }
        ]);
        if (users.length == 0) {
            return {
                data: []
            }
        }
        await Promise.all(users.map(async (user: any) => {

            const isUserFollowed = await Follower.findOne({ follower: userId, following: user._id })
            if (!isUserFollowed) {
                user.isFollowed = true

            }
            if (user.profile_picture)
                user.profile_picture = await getSignedUrl(user.profile_picture)
        }))
        return {
            data: users
        }
    }
    catch (err: any) {
        throw new Error(err)
    }

}
export default {
    signIn,
    signUp,
    updateUser,
    getUserById,
    verifyEmail,
    searchUsers
}
