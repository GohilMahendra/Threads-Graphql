import { createAsyncThunk } from "@reduxjs/toolkit"
import { FollowingUserResponse, User } from "../../types/User"
import { RootState } from "../store"
import { PAGE_SIZE } from "../../globals/constants"
import { createRepost } from "../../apis/FeedAPI"
import { getToken } from "../../globals/utilities"
import { client } from "../../graphql"
import { GET_CURRENT_USER_FOLLOWINGS } from "../../graphql/user/Query"
import {
    FollowSuccessResponse,
    FollowUnFollowInput,
    GetCurrentUserFollowingResponse,
    GetCurrentUserFolowingInput
} from "../../graphql/user/Types"
import { GraphQlInputType } from "../../graphql/common"
import {
    GET_LIKED_POSTS,
    GET_REPLIED_POSTS
} from "../../graphql/post/Query"
import {
    DeleteRepliedPostInput,
    DeleteRepliedPostSuccessResponse,
    GetLikedPostsInput,
    GetLikedPostsResponse,
    GetRepliedPostsResponse,
    LikePostSuccessResponse,
    PaginationInput,
    PostActionInput,
    UnLikePostSuccessResponse
} from "../../graphql/post/Types"
import {
    DELETE_REPLIED_POST,
    LIKE_POST,
    UNLIKE_POST
} from "../../graphql/post/Mutation"
import {
    FOLLOW_USER,
    UNFOLLOW_USER
} from "../../graphql/user/Mutation"

export const getUserFollowingAction = createAsyncThunk(
    "Favorites/getUserFollowingAction",
    async (fakeArg: string, { rejectWithValue }) => {
        try {
            const token = await getToken()
            const response = await client.query<GetCurrentUserFollowingResponse, GraphQlInputType<GetCurrentUserFolowingInput>>({
                query: GET_CURRENT_USER_FOLLOWINGS,
                context: {
                    headers: { token: token }
                },
                variables:{
                    input: {pageSize: PAGE_SIZE}
                }
            })
            if (response.data) {
                const data: FollowingUserResponse[] = response.data.GetCurrentUserFollowing.data
                const users: User[] = data.map((child) => child.following)
                return {
                    data: users,
                    lastOffset: response.data.GetCurrentUserFollowing.meta.lastOffset
                }
            }
            else {
                return rejectWithValue(JSON.stringify(response.errors))
            }
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }

    }
)
export const getMoreUserFollowingAction = createAsyncThunk(
    "Favorites/getMoreUserFollowingAction",
    async (fakeArg: string, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState
            const lastOffset = state.Favorite.lastOffset
            if (!lastOffset) {
                return {
                    data: [],
                    lastOffset: null
                }
            }
            const token = await getToken()
            const response = await client.query<GetCurrentUserFollowingResponse, GraphQlInputType<GetCurrentUserFolowingInput>>({
                query: GET_CURRENT_USER_FOLLOWINGS,
                context: {
                    headers: { token: token }
                },
                variables:{input:{
                    lastOffset: lastOffset,
                    pageSize: PAGE_SIZE
                }}
            })
            if (response.data) {
                const data: FollowingUserResponse[] = response.data.GetCurrentUserFollowing.data

                const users: User[] = data.map((child) => child.following)
                return {
                    data: users,
                    lastOffset: response.data.GetCurrentUserFollowing.meta.lastOffset
                }
            }
            else {
                return rejectWithValue(JSON.stringify(response.errors))
            }
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }

    }
)
export const getLikedPostsActions = createAsyncThunk(
    "Favorites/getLikedPostsActions",
    async (fakeArg: string, { rejectWithValue }) => {
        try {
            const token = await getToken()
            const response = await client.query<GetLikedPostsResponse, GraphQlInputType<GetLikedPostsInput>>({
                query: GET_LIKED_POSTS,
                context: {
                    headers: {
                        token: token
                    }
                },
                variables:{
                    input:{
                        pageSize: PAGE_SIZE 
                    }
                }
            })
            if (response.data) {
                const posts = response.data.GetLikedPosts.data
                const lastOffset = response.data.GetLikedPosts.meta.lastOffset
                return {
                    data: posts,
                    lastOffset: lastOffset
                }
            }
            else {
                return rejectWithValue(JSON.stringify(response.errors))
            }
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }

    }
)
export const getMoreLikedPostsActions = createAsyncThunk(
    "Favorites/getMoreLikedPostsActions",
    async (fakeArg: string, { rejectWithValue, getState }) => {
        try {

            const state = getState() as RootState
            const offset = state.Favorite.lastOffset
            if (!offset) {
                return {
                    data: [],
                    lastOffset: null
                }
            }
            const token = await getToken()
            const response = await client.query<GetLikedPostsResponse, GraphQlInputType<GetLikedPostsInput>>({
                query: GET_LIKED_POSTS,
                context: {
                    headers: {
                        token: token
                    }
                },
                variables: {
                    input: {
                        lastOffset: offset,
                        pageSize: PAGE_SIZE
                    }
                }
            })
            if (response.data) {
                const posts = response.data.GetLikedPosts.data
                const lastOffset = response.data.GetLikedPosts.meta.lastOffset
                return {
                    data: posts,
                    lastOffset: lastOffset
                }
            }
            else {
                return rejectWithValue(JSON.stringify(response.errors))
            }
        }
        catch (err) {
            console.log(JSON.stringify(err))
            return rejectWithValue(JSON.stringify(err))
        }

    }
)
export const favoritesLikeAction = createAsyncThunk(
    "Favorite/favoritesLikeAction",
    async ({ postId, post_type }: { postId: string, post_type: "post" | "reply" }, { rejectWithValue }) => {
        try {
            const token = await getToken()
            const response = await client.mutate<LikePostSuccessResponse, GraphQlInputType<PostActionInput>>({
                mutation: LIKE_POST,
                variables: {
                    input: {
                        postId: postId
                    }
                },
                context: {
                    headers: {
                        token: token
                    }
                }
            })
            if (response.data && !response.errors) {
                return {
                    postId: postId,
                    postType: post_type
                }
            }
            else {
                return rejectWithValue(JSON.stringify(response.errors))
            }
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    }
)
export const favoritesUnlikeAction = createAsyncThunk(
    "Favorite/favoritesUnlikeAction",
    async ({ postId, post_type }: { postId: string, post_type: "post" | "reply" }, { rejectWithValue }) => {
        try {
            const token = await getToken()
            const response = await client.mutate<UnLikePostSuccessResponse, GraphQlInputType<PostActionInput>>({
                mutation: UNLIKE_POST,
                variables: {
                    input: {
                        postId: postId
                    }
                },
                context: {
                    headers: { token: token }
                }
            })
            if (response.data) {
                return {
                    postId: postId,
                    postType: post_type
                }
            }
            else {
                return rejectWithValue(JSON.stringify(response.errors))
            }
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    }
)
export const favoritesFollowAction = createAsyncThunk(
    "Favorites/favoritesFollowAction",
    async ({ userId }: { userId: string }, { rejectWithValue, getState }) => {
        try {
            const token = await getToken()
            const response = await client.mutate<FollowSuccessResponse, GraphQlInputType<FollowUnFollowInput>>({
                mutation: FOLLOW_USER,
                variables: {
                    input: {
                        followingId: userId
                    }
                },
                context: {
                    headers: { token: token }
                }
            })
            if (response.data) {
                return {
                    message: response.data.FollowUser.message,
                    userId: userId
                }
            }
            else {
                return rejectWithValue(JSON.stringify(response.errors))
            }
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }

    }
)
export const favoritesUnFollowAction = createAsyncThunk(
    "Favorites/favoritesUnFollowAction",
    async ({ userId }: { userId: string }, { rejectWithValue, getState }) => {
        try {
            const token = await getToken()
            const response = await client.mutate<FollowSuccessResponse, GraphQlInputType<FollowUnFollowInput>>({
                mutation: UNFOLLOW_USER,
                variables: {
                    input: {
                        followingId: userId
                    }
                },
                context: {
                    headers: { token: token }
                }
            })
            if (response.data) {
                return {
                    message: response.data.FollowUser.message,
                    userId: userId
                }
            }
            else {
                return rejectWithValue(JSON.stringify(response.errors))
            }
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }

    }
)
export const getFavoritesRepliedPostsAction = createAsyncThunk(
    "Favorites/getFavoritesRepliedPostsAction",
    async (fakeArg: string, { rejectWithValue }) => {
        try {
            const token = await getToken()
            const response = await client.query<GetRepliedPostsResponse, GraphQlInputType<PaginationInput>>({
                query: GET_REPLIED_POSTS,
                context: {
                    headers: { token: token }
                },
                variables:{
                    input: {pageSize: PAGE_SIZE}
                }
            })
            if (response.data) {
                const posts = response.data.GetRepliedPosts.data
                const lastOffset = response.data.GetRepliedPosts.meta.lastOffset
                return {
                    data: posts,
                    lastOffset: lastOffset
                }
            }
            else {
                return rejectWithValue(JSON.stringify(response.errors))
            }
        }
        catch (err) {
            console.log(JSON.stringify(err))
            return rejectWithValue(JSON.stringify(err))
        }

    }
)
export const getMoreFavoritesRepliedPostsAction = createAsyncThunk(
    "Favorites/getMoreFavoritesRepliedPostsAction",
    async (fakeArg: string, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState
            const offset = state.Favorite.lastOffset
            if (!offset) {
                return {
                    data: [],
                    lastOffset: null
                }
            }
            const token = await getToken()
            const response = await client.query<GetRepliedPostsResponse, GraphQlInputType<PaginationInput>>({
                query: GET_REPLIED_POSTS,
                context: {
                    headers: { token: token }
                },
                variables: {
                    input: {
                        lastOffset: offset,
                        pageSize: PAGE_SIZE
                    },
                }
            })
            if (response.data) {
                const posts = response.data.GetRepliedPosts.data
                const lastOffset = response.data.GetRepliedPosts.meta.lastOffset
                return {
                    data: posts,
                    lastOffset: lastOffset
                }
            }
            else {
                return rejectWithValue(JSON.stringify(response.errors))
            }
        }
        catch (err) {
            console.log(JSON.stringify(err))
            return rejectWithValue(JSON.stringify(err))
        }

    }
)

export const favoriteCreateRepostAction = createAsyncThunk(
    "Favorite/favoriteCreateRepostAction",
    async ({ postId }: { postId: string }, { rejectWithValue }) => {
        try {
            const response = await createRepost(postId)
            return {
                message: response.message
            }
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    }
)
export const deleteFavoritesReplyAction = createAsyncThunk(
    "Favorite/deleteFavoritesReplyAction",
    async ({ replyId }: { replyId: string }, { rejectWithValue }) => {
        try {
            const token = await getToken()
            const response = await client.mutate<DeleteRepliedPostSuccessResponse, GraphQlInputType<DeleteRepliedPostInput>>({
                mutation: DELETE_REPLIED_POST,
                variables: {
                    input: { replyId: replyId }
                },
                context: {
                    headers: { token: token }
                }
            })
            if (response.data)
                return {
                    message: response.data.DeletePostReply.message,
                    replyId
                }
            else
                return rejectWithValue(JSON.stringify(response.errors))
        }
        catch (err) {
            console.log(err)
            return rejectWithValue(JSON.stringify(err))
        }
    }
)