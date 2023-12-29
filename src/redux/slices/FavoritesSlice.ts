import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Thread } from "../../types/Post";
import { User } from "../../types/User";
import { FetchPostsPayload } from "../types/global";
import { String } from "aws-sdk/clients/batch";
import { CommentedPost } from "../../types/Comment";
import { deleteReplyAction, favoriteCreateRepostAction, favoritesLikeAction, favoritesUnlikeAction, followUserAction, getLikedPostsActions, getMoreLikedPostsActions, getMoreRepliedPostsAction, getMoreUserFollowingAction, getRepliedPostsAction, getUserFollowingAction, unFollowUserAction } from "../actions/FavoriteActions";

type FavoriteSliceType =
    {
        loading: boolean,
        error: string | null,
        posts: Thread[],
        repliedPosts: CommentedPost[],
        users: User[],
        suggestedUsers:User[]
        loadMoreLoading: boolean,
        loadMoreError: null | string,
        lastOffset: string | null,
        successMessage: string | null,
        screeenLoading: boolean
    }

const initialState: FavoriteSliceType =
{
    loading: false,
    error: null,
    posts: [],
    users: [],
    repliedPosts: [],
    loadMoreLoading: false,
    loadMoreError: null,
    lastOffset: null,
    successMessage: null,
    screeenLoading: false,
    suggestedUsers:[]
}

export const FavoriteSlice = createSlice({
    name: "Favorite",
    initialState: initialState,
    reducers: {

    },
    extraReducers(builder) {
        builder.addCase(getUserFollowingAction.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(getUserFollowingAction.fulfilled, (state, action: PayloadAction<FetchPostsPayload<User>>) => {
            state.loading = false
            state.users = action.payload.data
            state.lastOffset = action.payload.lastOffset
            state.error = null
        })
        builder.addCase(getUserFollowingAction.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
        builder.addCase(getMoreUserFollowingAction.pending, (state) => {
            state.loadMoreLoading = true
            state.loadMoreError = null
        })
        builder.addCase(getMoreUserFollowingAction.fulfilled, (state, action: PayloadAction<FetchPostsPayload<User>>) => {
            state.loadMoreLoading = false
            state.users.push(...action.payload.data)
            state.lastOffset = action.payload.lastOffset
            state.loadMoreError = null
        })
        builder.addCase(getMoreUserFollowingAction.rejected, (state, action) => {
            state.loadMoreLoading = false
            state.loadMoreError = action.payload as string
        })
        builder.addCase(followUserAction.pending, (state) => {
            state.successMessage = null
            state.error = null
        })
        builder.addCase(followUserAction.fulfilled, (state, action: PayloadAction<{ message: string, userId: string }>) => {
            state.successMessage = action.payload.message
            const index = state.users.findIndex(user => user._id)
            state.users[index].isFollowed = true
        })
        builder.addCase(followUserAction.rejected, (state, action) => {
            state.error = action.payload as string
        })
        builder.addCase(unFollowUserAction.pending, (state) => {
            state.successMessage = null
            state.error = null
        })
        builder.addCase(unFollowUserAction.fulfilled, (state, action: PayloadAction<{ message: string, userId: string }>) => {
            state.successMessage = action.payload.message
            const index = state.users.findIndex(user => user._id)
            state.users[index].isFollowed = false
        })
        builder.addCase(unFollowUserAction.rejected, (state, action) => {
            state.error = action.payload as string
        })
        builder.addCase(getLikedPostsActions.pending, (state) => {
            state.loading = true
            state.posts = []
            state.error = null
        })
        builder.addCase(getLikedPostsActions.fulfilled, (state, action: PayloadAction<FetchPostsPayload<Thread>>) => {
            state.loading = false
            state.posts = action.payload.data
            state.lastOffset = action.payload.lastOffset
        })
        builder.addCase(getLikedPostsActions.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as String
        })
        builder.addCase(getMoreLikedPostsActions.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(getMoreLikedPostsActions.fulfilled, (state, action: PayloadAction<FetchPostsPayload<Thread>>) => {
            state.loading = false
            state.posts.push(...action.payload.data)
            state.lastOffset = action.payload.lastOffset
        })
        builder.addCase(getMoreLikedPostsActions.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as String
        })
        builder.addCase(favoritesLikeAction.pending, (state) => {
            state.screeenLoading = true
            state.error = null
        })
        builder.addCase(favoritesLikeAction.fulfilled, (state, action) => {
            state.screeenLoading = false
            if (action.payload.postType == "post") {
                const index = state.posts.findIndex(post => post._id == action.payload.postId)
                if (index != -1)
                    state.posts[index].isLiked = true
            }
            else {
                const index = state.repliedPosts.findIndex(commentPost => commentPost.post._id == action.payload.postId)
                if (index != -1)
                    state.repliedPosts[index].post.isLiked = true
            }
        })
        builder.addCase(favoritesLikeAction.rejected, (state, action) => {
            state.screeenLoading = false
            state.error = action.payload as string
        })
        builder.addCase(favoritesUnlikeAction.pending, (state) => {
            state.screeenLoading = true
            state.error = null
        })
        builder.addCase(favoritesUnlikeAction.fulfilled, (state, action) => {
            state.screeenLoading = false
            if (action.payload.postType == "post") {
                const index = state.posts.findIndex(post => post._id == action.payload.postId)
                console.log(index)
                if (index != -1)
                    state.posts[index].isLiked = false
            }
            else {
                const index = state.repliedPosts.findIndex(commentPost => commentPost.post._id == action.payload.postId)
                if (index != -1)
                    state.repliedPosts[index].post.isLiked = false
            }
        })
        builder.addCase(favoritesUnlikeAction.rejected, (state, action) => {
            state.screeenLoading = false
            state.error = action.payload as string
        })
        builder.addCase(getRepliedPostsAction.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(getRepliedPostsAction.fulfilled, (state, action: PayloadAction<FetchPostsPayload<CommentedPost>>) => {
            state.loading = false
            state.repliedPosts = action.payload.data
            state.lastOffset = action.payload.lastOffset
        })
        builder.addCase(getRepliedPostsAction.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
        builder.addCase(getMoreRepliedPostsAction.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(getMoreRepliedPostsAction.fulfilled, (state, action: PayloadAction<FetchPostsPayload<CommentedPost>>) => {
            state.loading = false
            state.repliedPosts.push(...action.payload.data)
            state.lastOffset = action.payload.lastOffset
        })
        builder.addCase(getMoreRepliedPostsAction.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
        builder.addCase(favoriteCreateRepostAction.pending, (state) => {
            state.screeenLoading = true
            state.error = null
        })
        builder.addCase(favoriteCreateRepostAction.fulfilled, (state, action) => {
            state.screeenLoading = false
            state.successMessage = action.payload.message
        })
        builder.addCase(favoriteCreateRepostAction.rejected, (state, action) => {
            state.screeenLoading = false
            state.error = action.payload as string
        })
        builder.addCase(deleteReplyAction.pending, (state) => {
            state.screeenLoading = true
            state.error = null
        })
        builder.addCase(deleteReplyAction.fulfilled, (state, action) => {
            state.screeenLoading = false
            state.repliedPosts = state.repliedPosts.filter(post => post._id != action.payload.replyId)

        })
        builder.addCase(deleteReplyAction.rejected, (state, action) => {
            state.screeenLoading = false
            state.error = action.payload as string
        })
    }
})
export default FavoriteSlice.reducer