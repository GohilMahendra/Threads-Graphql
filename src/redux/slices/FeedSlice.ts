import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Thread, UploadMedia } from "../../types/Post";
import { FetchPostsPayload } from "../types/global";
import { FetchMorePostsAction, FetchPostsAction, LikeAction, feedCreateRepostAction, unLikeAction } from "../actions/FeedActions";
type FeedStateType =
    {
        Threads: Thread[],
        loading: boolean,
        error: null | string,
        LikeSuccess: boolean,
        loadMoreLoading: boolean,
        loadMoreError: string | null,
        lastOffset: string | null,
        screenLoading: boolean
    }

const initialState: FeedStateType =
{
    Threads: [],
    loading: false,
    error: null,
    LikeSuccess: false,
    loadMoreError: null,
    loadMoreLoading: false,
    lastOffset: null,
    screenLoading: false
}


export const FeedSlice = createSlice({
    name: "Feed",
    initialState: initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder.addCase(FetchPostsAction.pending, (state) => {
            state.loading = true,
                state.Threads = [],
                state.error = null
        })
        builder.addCase(FetchPostsAction.fulfilled, (state, action: PayloadAction<FetchPostsPayload<Thread>>) => {
            state.loading = false
            state.Threads = action.payload.data,
                state.lastOffset = action.payload.lastOffset
        })
        builder.addCase(FetchPostsAction.rejected, (state, action) => {
            state.loading = false,
                state.error = action.payload as string
        })

        builder.addCase(FetchMorePostsAction.pending, (state) => {
            state.loadMoreLoading = true,
                state.loadMoreError = null
        })
        builder.addCase(FetchMorePostsAction.fulfilled, (state, action: PayloadAction<FetchPostsPayload<Thread>>) => {
            state.loadMoreLoading = false
            state.Threads.push(...action.payload.data)
            state.lastOffset = action.payload.lastOffset
        })
        builder.addCase(FetchMorePostsAction.rejected, (state, action) => {
            state.loadMoreLoading = false,
                state.loadMoreError = action.payload as string
        })

        builder.addCase(LikeAction.pending, (state) => {
            state.LikeSuccess = false
        })
        builder.addCase(LikeAction.fulfilled, (state, action: PayloadAction<{ postId: string }>) => {
            state.LikeSuccess = true
            state.Threads.forEach((item, index) => {
                if (item._id === action.payload.postId) {
                    item.isLiked = true
                    item.likes++
                }
            })
        })
        builder.addCase(LikeAction.rejected, (state, payload) => {
            state.LikeSuccess = false
        })
        builder.addCase(unLikeAction.fulfilled, (state, action: PayloadAction<{ postId: string }>) => {
            state.LikeSuccess = true
            state.Threads.forEach((item, index) => {
                if (item._id === action.payload.postId) {
                    item.isLiked = false
                    item.likes--
                }
            })
        })
        builder.addCase(feedCreateRepostAction.pending, (state) => {
            state.screenLoading = true
            state.error = null
        })
        builder.addCase(feedCreateRepostAction.fulfilled, (state, action: PayloadAction<string>) => {
            state.screenLoading = false
        })
        builder.addCase(feedCreateRepostAction.rejected, (state, action) => {
            state.error = action.payload as string
        })
    }
})
export default FeedSlice.reducer