import { createAsyncThunk } from "@reduxjs/toolkit"
import { PAGE_SIZE } from "../../globals/constants"
import { RootState } from "../store"
import { client } from "../../graphql"
import {
    CommentActionInput,
    CreateCommentSucceessResponse,
    GetCommentsInput,
    GetCommentsResponse
} from "../../graphql/comment/Types"
import { GraphQlInputType } from "../../graphql/common"
import { COMMENT_POST } from "../../graphql/comment/Mutation"
import { getToken } from "../../globals/utilities"
import { GET_COMMENTS } from "../../graphql/comment/Query"

export const commentPostAction = createAsyncThunk(
    "Reply/commentPostAction",
    async ({ postId, content }: { postId: string, content: string }, { rejectWithValue }) => {
        try {
            const token = await getToken()
            const response = await client.mutate<CreateCommentSucceessResponse, GraphQlInputType<CommentActionInput>>({
                mutation: COMMENT_POST,
                variables: {
                    input: {
                        content: content,
                        postId: postId
                    }
                },
                context: {
                    headers: { token: token }
                }
            })
            if (response.data)
                return response.data.CommentPost.message
            else
                return rejectWithValue(JSON.stringify(response.errors))
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    })

export const getCommentsAction = createAsyncThunk(
    "Reply/getCommentsAction",
    async ({ postId }: { postId: string }, { rejectWithValue }) => {
        try {
            const token = await getToken()
            const response = await client.query<GetCommentsResponse, GraphQlInputType<GetCommentsInput>>({
                query: GET_COMMENTS,
                variables: {
                    input: {
                        postId: postId,
                        pageSize: PAGE_SIZE
                    }
                },
                context: {
                    headers: { token: token }
                }
            })
            if (response.data) {
                return {
                    data: response.data.GetComments.data,
                    lastOffset: response.data.GetComments.meta.lastOffset
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
            const token = await getToken()
            const response = await client.query<GetCommentsResponse, GraphQlInputType<GetCommentsInput>>({
                query: GET_COMMENTS,
                variables: {
                    input: {
                        postId: postId,
                        pageSize: PAGE_SIZE,
                        lastOffset: offset
                    }
                },
                context: {
                    headers: { token: token }
                }
            })
            if (response.data) {
                const lastOffest = response.data.GetComments.meta.lastOffset
                const data = response.data.GetComments.data
                return {
                    data: data,
                    lastOffset: lastOffest
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