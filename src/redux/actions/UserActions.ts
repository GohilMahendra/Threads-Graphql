import { createAsyncThunk } from "@reduxjs/toolkit"
import { deleteUserPost, fetchUserPosts, loginUser, signUpUser, updateUser, verifyOtp } from "../../apis/UserAPI"
import { SignUpArgsType, UpdateArgsType, User, UserResponse } from "../../types/User"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Thread, UploadMedia } from "../../types/Post"
import { PAGE_SIZE } from "../../globals/constants"
import { RootState } from "../store"
import { createPost, createRepost } from "../../apis/FeedAPI"

export const SignInAction = createAsyncThunk(
    "user/SignInAction",
    async ({ email, password }: { email: string, password: string }, { rejectWithValue }) => {
        try {
            const response = await loginUser(email, password)
            const userResponse = response.user as UserResponse
            await AsyncStorage.setItem("token", userResponse.token)
            await AsyncStorage.setItem("email", email)
            await AsyncStorage.setItem("password", password)
            const user: User =
            {
                email: userResponse.email,
                followers: userResponse.followers,
                following: userResponse.following,
                _id: userResponse._id,
                username: userResponse.username,
                profile_picture: userResponse.profile_picture,
                fullname: userResponse.fullname,
                bio: userResponse.bio,
                verified: userResponse.verified,
                isFollowed: false
            }
            return user
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    })
export const SignUpAction = createAsyncThunk(
    "user/SignUpAction",
    async (args: SignUpArgsType, { rejectWithValue }) => {
        try {
            const response = await signUpUser(args)
            return response.message
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    })
export const UpdateAction = createAsyncThunk(
    "user/UpdateAction",
    async (args: UpdateArgsType, { rejectWithValue }) => {
        try {
            const response = await updateUser(args)
            const user = response.user as User
            return {
                user: user
            }
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    })
export const verifyOtpUserAction = createAsyncThunk(
    "user/verifyOtpUserAction",
    async ({ otp, email }: { otp: string, email: string }, { rejectWithValue }) => {
        try {
            const response = await verifyOtp(email, otp)
            return response.message as string
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    })

export const createRepostAction = createAsyncThunk(
    "user/createRepostAction",
    async ({ postId, content }: { postId: string, content?: string }, { rejectWithValue }) => {
        try {
            const response = await createRepost(postId, content)
            return response.data
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }

    }
)
export const createPostAction = createAsyncThunk(
    "user/createPostAction",
    async ({ content, media }: { content?: string, media: UploadMedia[] }, { rejectWithValue }) => {
        try {
            const response = await createPost({
                args: {
                    content: content,
                    media: media
                }
            })
            return response.data
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }

    }
)

export const FetchUserPostsAction = createAsyncThunk(
    "user/FetchPostsAction",
    async ({ post_type }: { post_type: string }, { rejectWithValue }) => {
        try {
            const response = await fetchUserPosts({
                pageSize: 3,
                post_type: post_type
            })
            const posts: Thread[] = []
            const theads: Thread[] = response.data
            theads.forEach((item, index) => {
                const post: Thread =
                {
                    _id: item._id,
                    content: item.content,
                    created_at: item.created_at,
                    hashtags: item.hashtags,
                    isLiked: item.isLiked,
                    isRepost: item.isRepost,
                    likes: item.likes,
                    media: item.media,
                    replies: item.replies,
                    Repost: item.Repost,
                    updated_at: item.updated_at,
                    user: item.user
                }
                posts.push(post)
            })
            return {
                data: posts,
                lastOffset: response.meta.lastOffset
            }

        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    })

export const FetchMoreUserPostsAction = createAsyncThunk(
    "user/FetchMorePostsAction",
    async ({ post_type }: { post_type: string }, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState
            const lastOffset = state.User.lastOffset
            if (!lastOffset) {
                return {
                    data: [],
                    lastOffset: null
                }
            }
            const response = await fetchUserPosts({
                pageSize: PAGE_SIZE,
                lastOffset: lastOffset,
                post_type: post_type
            })
            const posts: Thread[] = []
            const theads: Thread[] = response.data
            theads.forEach((item, index) => {
                const post: Thread =
                {
                    _id: item._id,
                    content: item.content,
                    created_at: item.created_at,
                    hashtags: item.hashtags,
                    isLiked: item.isLiked,
                    isRepost: item.isRepost,
                    likes: item.likes,
                    media: item.media,
                    replies: item.replies,
                    Repost: item.Repost,
                    updated_at: item.updated_at,
                    user: item.user
                }
                posts.push(post)
            })
            return {
                data: posts,
                lastOffset: response.meta.lastOffset
            }

        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    })

export const DeletePostAction = createAsyncThunk(
    "user/DeletePostAction",
    async ({ postId }: { postId: string }, { rejectWithValue, getState }) => {
        try {
            const response = await deleteUserPost(postId)

            return {
                postId: postId
            }
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    })
