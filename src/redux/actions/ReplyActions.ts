import { createAsyncThunk } from "@reduxjs/toolkit"
import { commentPost, fetchComments } from "../../apis/FeedAPI"
import { PAGE_SIZE } from "../../globals/constants"
import { RootState } from "../store"

export const commentPostAction = createAsyncThunk(
    "Reply/commentPostAction",
    async ({ postId, content }: { postId: string, content: string }, { rejectWithValue }) => {
        try {
            const response = await commentPost(postId, content)
            return response.message
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    })

export const getCommentsAction = createAsyncThunk(
    "Reply/getCommentsAction",
    async ({ postId }: { postId: string }, { rejectWithValue }) => {
        try {
            const response = await fetchComments(postId, PAGE_SIZE)
            return {
                data: response.data,
                lastOffset: response.meta.lastOffset
            }
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    }
)

export const getMoreCommentsAction = createAsyncThunk(
    "Reply/getMoreCommentsAction",
    async ({ postId }: { postId: string }, { rejectWithValue, getState }) => {
        const state = getState() as RootState
        const offset = state.Reply.lastOffset

        try {
            if (!offset) {
                return {
                    data: [],
                    lastOffset: null
                }
            }
            const response = await fetchComments(postId, PAGE_SIZE, offset)
            const lastOffest = response.meta.lastOffset
            const data = response.data
            return {
                data: data,
                lastOffset: lastOffest
            }
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    }
)