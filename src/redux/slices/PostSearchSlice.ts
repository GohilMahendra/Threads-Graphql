import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Thread } from "../../types/Post";
import { FetchPostsPayload } from "../types/global";
import {
    createRepostSearchAction,
    fetchMorePostSearchAction,
    fetchPostSearchAction,
    likePostSearchAction,
    unlikePostSearchAction

} from "../actions/PostSearchActions";
type PostSearchType =
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

const initialState: PostSearchType =
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


export const PostSearchSlice = createSlice({
    name: "PostSearch",
    initialState: initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder.addCase(fetchPostSearchAction.pending, (state) => {
            state.loading = true
            state.Threads = []
            state.error = null
        })
        builder.addCase(fetchPostSearchAction.fulfilled, (state, action: PayloadAction<FetchPostsPayload<Thread>>) => {
            state.loading = false
            state.Threads = action.payload.data
            state.lastOffset = action.payload.lastOffset
        })
        builder.addCase(fetchPostSearchAction.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })

        builder.addCase(fetchMorePostSearchAction.pending, (state) => {
            state.loadMoreLoading = true
            state.loadMoreError = null
        })
        builder.addCase(fetchMorePostSearchAction.fulfilled, (state, action: PayloadAction<FetchPostsPayload<Thread>>) => {
            state.loadMoreLoading = false
            state.Threads.push(...action.payload.data)
            state.lastOffset = action.payload.lastOffset
        })
        builder.addCase(fetchMorePostSearchAction.rejected, (state, action) => {
            state.loadMoreLoading = false
            state.loadMoreError = action.payload as string
        })

        builder.addCase(likePostSearchAction.pending, (state) => {
            state.LikeSuccess = false
        })
        builder.addCase(likePostSearchAction.fulfilled, (state, action: PayloadAction<{ postId: string }>) => {
            state.LikeSuccess = true
            state.Threads.forEach((item, index) => {
                if (item._id === action.payload.postId) {
                    item.isLiked = true
                    item.likes++
                }
            })
        })
        builder.addCase(likePostSearchAction.rejected, (state, payload) => {
            state.LikeSuccess = false
        })
        builder.addCase(unlikePostSearchAction.fulfilled, (state, action: PayloadAction<{ postId: string }>) => {
            state.LikeSuccess = true
            state.Threads.forEach((item, index) => {
                if (item._id === action.payload.postId) {
                    item.isLiked = false
                    item.likes--
                }
            })
        })
        builder.addCase(createRepostSearchAction.pending, (state) => {
            state.screenLoading = true
            state.error = null
        })
        builder.addCase(createRepostSearchAction.fulfilled, (state, action: PayloadAction<string>) => {
            state.screenLoading = false
        })
        builder.addCase(createRepostSearchAction.rejected, (state, action) => {
            state.error = action.payload as string
        })
    }
})
export default PostSearchSlice.reducer