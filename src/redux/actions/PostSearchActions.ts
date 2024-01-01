import { createAsyncThunk } from "@reduxjs/toolkit"
import { createRepost, likePost, searchPosts, unLikePost } from "../../apis/FeedAPI"
import { Thread } from "../../types/Post"
import { RootState } from "../store"
import { PAGE_SIZE } from "../../globals/constants"

export const fetchPostSearchAction = createAsyncThunk(
    "PostSearch/fetchPostSearchAction",
    async ({ searchTerm }: { searchTerm: string }, { rejectWithValue }) => {
        try {

            const response = await searchPosts({
                pageSize: PAGE_SIZE,
                searchTerm: searchTerm
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

export const fetchMorePostSearchAction = createAsyncThunk(
    "PostSearch/fetchMorePostSearchAction",
    async ({ searchTerm }: { searchTerm: string }, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState
            const lastOffset = state.PostSearch.lastOffset
            if (!lastOffset) {
                return {
                    data: [],
                    lastOffset: null
                }
            }
            const response = await searchPosts({
                pageSize: PAGE_SIZE,
                searchTerm: searchTerm,
                lastOffset: lastOffset
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

export const likePostSearchAction = createAsyncThunk(
    "PostSearch/likePostSearchAction",
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

export const unlikePostSearchAction = createAsyncThunk(
    "SearchPost/unlikePostSearchAction",
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

export const createRepostSearchAction = createAsyncThunk(
    "PostSearch/createPostSearchAction",
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

