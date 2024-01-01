import { createAsyncThunk } from "@reduxjs/toolkit"
import { commentPost, createRepost, fetchPosts, likePost, unLikePost } from "../../apis/FeedAPI"
import { Thread } from "../../types/Post"
import { RootState } from "../store"

export const FetchPostsAction = createAsyncThunk(
    "Feed/FetchPostsAction",
    async ({ post_type }: { post_type: string }, { rejectWithValue }) => {
        try {
            const response = await fetchPosts({
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

export const FetchMorePostsAction = createAsyncThunk(
    "Feed/FetchMorePostsAction",
    async ({ post_type }: { post_type: string }, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState
            const lastOffset = state.Feed.lastOffset
            if (!lastOffset) {
                return {
                    data: [],
                    lastOffset: null
                }
            }
            const response = await fetchPosts({ pageSize: 3, post_type: post_type, lastOffset: lastOffset })
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

export const LikeAction = createAsyncThunk(
    "Feed/LikeAction",
    async ({ postId }: { postId: string }, { rejectWithValue }) => {
        try {
            const response = await likePost(postId)
            return {
                postId: postId,
            }
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    }
)

export const unLikeAction = createAsyncThunk(
    "Feed/unLikeAction",
    async ({ postId }: { postId: string }, { rejectWithValue }) => {
        try {
            const response = await unLikePost(postId)
            return {
                postId: postId,
            }
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    }
)

export const createCommentAction = createAsyncThunk(
    "Feed/createCommentAction",
    async ({ postId, content }: { postId: string, content: string }, { rejectWithValue }) => {
        try {

            const response = await commentPost(postId, content)
            return response.data
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }

    }
)

export const feedCreateRepostAction = createAsyncThunk(
    "feed/feedCreateRepostAction",
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

