import { createAsyncThunk } from "@reduxjs/toolkit"
import { deleteReply, fetchUserLikedPosts, fetchUserRepliedPosts, followUser, getCurrentFollowings, unFollowUser } from "../../apis/UserAPI"
import { FollowingUserResponse, User } from "../../types/User"
import { RootState } from "../store"
import { PAGE_SIZE } from "../../globals/constants"
import { Thread } from "../../types/Post"
import { createRepost, likePost, unLikePost } from "../../apis/FeedAPI"
import { CommentedPost } from "../../types/Comment"

export const getUserFollowingAction = createAsyncThunk(
    "Favorites/getUserFollowingAction",
    async (fakeArg: string, { rejectWithValue }) => {
        try {
            const response = await getCurrentFollowings(PAGE_SIZE)
            const data: FollowingUserResponse[] = response.data

            const users: User[] = data.map((child) => child.following)
            return {
                data: users,
                lastOffset: response.lastOffset
            }
        }
        catch (err) {
            console.log(err)
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
            const response = await getCurrentFollowings(PAGE_SIZE)
            const data: FollowingUserResponse[] = response.data

            const users: User[] = data.map((child) => child.following)
            return {
                data: users,
                lastOffset: response.meta.lastOffset
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
            const response = await fetchUserLikedPosts({
                pageSize: PAGE_SIZE
            })

            const posts = response.data as Thread[]
            const lastOffset = response.meta.lastOffset

            return {
                data: posts,
                lastOffset: lastOffset
            }
        }
        catch (err) {
            console.log(JSON.stringify(err))
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
            const response = await fetchUserLikedPosts({
                pageSize: PAGE_SIZE,
                lastOffset: offset
            })

            const posts = response.data as Thread[]
            const lastOffset = response.meta.lastOffset

            return {
                data: posts,
                lastOffset: lastOffset
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
            const response = await likePost(postId)
            return {
                postId: postId,
                postType: post_type
            }
        }
        catch (err) {
            console.log(err)
            return rejectWithValue(JSON.stringify(err))
        }
    }
)
export const favoritesUnlikeAction = createAsyncThunk(
    "Favorite/favoritesUnlikeAction",
    async ({ postId, post_type }: { postId: string, post_type: "post" | "reply" }, { rejectWithValue }) => {
        try {
            const response = await unLikePost(postId)
            return {
                postId: postId,
                postType: post_type
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
            const response = await followUser(userId)
            return {
                message: response.message,
                userId: userId
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
            const response = await unFollowUser(userId)
            return {
                message: response.message,
                userId: userId
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
            const response = await fetchUserRepliedPosts({
                pageSize: 10
            })

            const posts = response.data as CommentedPost[]
            const lastOffset = response.meta.lastOffset
            return {
                data: posts,
                lastOffset: lastOffset
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
            const response = await fetchUserRepliedPosts({
                pageSize: PAGE_SIZE,
                lastOffset: offset
            })

            const posts = response.data as CommentedPost[]
            const lastOffset = response.meta.lastOffset
            return {
                data: posts,
                lastOffset: lastOffset
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
            console.log(err)
            return rejectWithValue(JSON.stringify(err))
        }
    }
)
export const deleteFavoritesReplyAction = createAsyncThunk(
    "Favorite/deleteFavoritesReplyAction",
    async ({ replyId }: { replyId: string }, { rejectWithValue }) => {
        try {
            const response = await deleteReply(replyId)
            return {
                message: response.message,
                replyId
            }
        }
        catch (err) {
            console.log(err)
            return rejectWithValue(JSON.stringify(err))
        }
    }
)