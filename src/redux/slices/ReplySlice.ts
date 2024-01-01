import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Comment } from "../../types/Comment";
import { commentPostAction, getCommentsAction, getMoreCommentsAction } from "../actions/ReplyActions";
type Replytype =
    {
        comments: Comment[],
        loading: boolean,
        screeenLoading:boolean,
        error: null | string,
        success_message: string | null,
        loadMoreLoading: boolean,
        loadMoreError: string | null,
        lastOffset: string | null
    }

const initialState: Replytype =
{
    comments: [],
    loading: false,
    error: null,
    screeenLoading: false,
    lastOffset: null,
    loadMoreError: null,
    loadMoreLoading: false,
    success_message: null
}

export const ReplySlice = createSlice({
    name: "Reply",
    initialState: initialState,
    reducers: {

    },
    extraReducers(builder) {
        builder.addCase(commentPostAction.pending, state => {
            state.screeenLoading = true
            state.error = null
            state.success_message = null
        })
        builder.addCase(commentPostAction.fulfilled, (state, action: PayloadAction<string>) => {
            state.screeenLoading = false
            state.success_message = action.payload
        })
        builder.addCase(commentPostAction.rejected, (state, action) => {
            state.screeenLoading = false
            state.error = action.payload as string
        })

        builder.addCase(getCommentsAction.pending, state => {
            state.loading = true
            state.error = null
            state.comments = []
        })
        builder.addCase(getCommentsAction.fulfilled, (state, action: PayloadAction<{ data: Comment[], lastOffset: string }>) => {
            state.loading = false
            state.comments = action.payload.data
            state.lastOffset = action.payload.lastOffset
        })
        builder.addCase(getCommentsAction.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })

        builder.addCase(getMoreCommentsAction.pending, state => {
            state.loadMoreLoading = true
            state.loadMoreError = null
        })
        builder.addCase(getMoreCommentsAction.fulfilled, (state, action: PayloadAction<{ data: Comment[], lastOffset: string | null }>) => {
            state.loadMoreLoading = false
            state.comments = [...state.comments, ...action.payload.data]
            state.lastOffset = action.payload.lastOffset
        })
        builder.addCase(getMoreCommentsAction.rejected, (state, action) => {
            state.loadMoreLoading = false
            state.loadMoreError = action.payload as string
        })

    }
})
export default ReplySlice.reducer