import { createAsyncThunk } from "@reduxjs/toolkit"
import { updateUser } from "../../apis/UserAPI"
import {
    SignUpArgsType,
    UpdateArgsType,
    User
} from "../../types/User"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Thread, UploadMedia } from "../../types/Post"
import { RootState } from "../store"
import {
    SignInInput,
    SignInResponse,
    SignUpInput,
    SignUpSuccessResponse,
    VerifyEmailInput,
    VerifyEmailSuccessResponse
} from "../../graphql/user/Types"
import { SIGN_IN_USER, SIGN_UP_USER, VERIFY_EMAIL } from "../../graphql/user/Mutation";
import { client } from "../../graphql"
import { GraphQlInputType } from "../../graphql/common"
import {
    CreateRepostSuccessResponse,
    DeleteUserPostSuccessResponse,
    GetPostRepostInput,
    GetUserPostsRepostResponse,
    PostActionInput,
    PostInput,
    RepostInput
} from "../../graphql/post/Types"
import { CREATE_POST, DELETE_USER_POST } from "../../graphql/post/Mutation"
import { getToken } from "../../globals/utilities"
import { GET_USER_POSTS } from "../../graphql/post/Query"
import { PAGE_SIZE } from "../../globals/constants"

export const SignInAction = createAsyncThunk(
    "user/SignInAction",
    async ({ email, password }: { email: string, password: string }, { rejectWithValue }) => {
        try {
            const mutationResponse = await client.mutate<SignInResponse, GraphQlInputType<SignInInput>>({
                mutation: SIGN_IN_USER,
                variables: {
                    input: {
                        email: email, password: password
                    }
                }
            })

            if (mutationResponse.data) {
                const userResponse = mutationResponse.data.SignIn
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
            else {
                return rejectWithValue(JSON.stringify(mutationResponse.errors))
            }
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    })
export const SignUpAction = createAsyncThunk(
    "user/SignUpAction",
    async (args: SignUpArgsType, { rejectWithValue }) => {
        try {
            const response = await client.mutate<SignUpSuccessResponse, GraphQlInputType<SignUpInput>>({
                mutation: SIGN_UP_USER,
                variables: {
                    input: {
                        email: args.email,
                        fullname: args.fullname,
                        password: args.password,
                        username: args.username
                    }
                }
            })
            if (response.data)
                return response.data.SignUp.message
            else
                return rejectWithValue(JSON.stringify(response.errors))
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
            const response = await client.mutate<VerifyEmailSuccessResponse, GraphQlInputType<VerifyEmailInput>>({
                mutation: VERIFY_EMAIL,
                variables: {
                    input: {
                        email: email,
                        otp: otp
                    }
                }
            })
            if (response.data)
                return response.data.VerifyEmail.message
            else
                return rejectWithValue(JSON.stringify(response.errors))
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    })

export const createRepostAction = createAsyncThunk(
    "user/createRepostAction",
    async ({ postId, content }: { postId: string, content?: string }, { rejectWithValue }) => {
        try {
            const token = await getToken()
            const response = await client.mutate<CreateRepostSuccessResponse, GraphQlInputType<RepostInput>>({
                mutation: CREATE_POST,
                variables: {
                    input: {
                        content,
                        postId
                    }
                },
                context: {
                    headers: { token: token }
                }
            })
            if (response.data)
                return response.data.CreatePost.message
            else
                return rejectWithValue(JSON.stringify(response.errors))
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
            const token = await getToken()
            const response = await client.mutate<CreateRepostSuccessResponse, GraphQlInputType<PostInput>>({
                mutation: CREATE_POST,
                variables: {
                    input: { content: content }
                },
                context: {
                    headers: { token: token }
                }
            })
            if (response.data)
                return response.data.CreatePost.message
            else
                return rejectWithValue(JSON.stringify(response.errors))
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
            const token = await getToken()
            const response = await client.query<GetUserPostsRepostResponse, GraphQlInputType<GetPostRepostInput>>({
                query: GET_USER_POSTS,
                context: {
                    headers: { token: token }
                },
                variables: {
                    input: {
                        post_type: post_type,
                        pageSize: PAGE_SIZE
                    }
                }
            })
            if (response.data) {
                const posts: Thread[] = []
                const theads: Thread[] = response.data.GetUserPosts.data
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
                    lastOffset: response.data.GetUserPosts.meta.lastOffset
                }
            }
            else {
                return rejectWithValue(JSON.stringify(response.errors))
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
            const token = await getToken()
            const response = await client.query<GetUserPostsRepostResponse, GraphQlInputType<GetPostRepostInput>>({
                query: GET_USER_POSTS,
                context: {
                    headers: { token: token }
                },
                variables: {
                    input: {
                        post_type: post_type,
                        lastOffset: lastOffset,
                        pageSize: PAGE_SIZE
                    }
                }
            })
            if (response.data) {
                const posts: Thread[] = []
                const theads: Thread[] = response.data.GetUserPosts.data
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
                    lastOffset: response.data.GetUserPosts.meta.lastOffset
                }
            }
            else
                return rejectWithValue(JSON.stringify(response.errors))
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    })

export const DeletePostAction = createAsyncThunk(
    "user/DeletePostAction",
    async ({ postId }: { postId: string }, { rejectWithValue, getState }) => {
        try {
            const token = await getToken()
            const response = await client.mutate<DeleteUserPostSuccessResponse, GraphQlInputType<PostActionInput>>({
                mutation: DELETE_USER_POST,
                variables: {
                    input: { postId: postId }
                },
                context: {
                    headers: { token: token }
                }
            })
            if (response.data)
                return {
                    postId: postId
                }
            else
                return rejectWithValue(JSON.stringify(response.errors))
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    })
