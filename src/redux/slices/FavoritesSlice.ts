import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Thread } from "../../types/Post";
import { User } from "../../types/User";
import { FetchPostsPayload } from "../types/global";
import { String } from "aws-sdk/clients/batch";
import { CommentedPost } from "../../types/Comment";
import {  favoriteCreateRepostAction,
     favoritesLikeAction, favoritesUnlikeAction, 
     getLikedPostsActions, getMoreLikedPostsActions, getMoreUserFollowingAction, 
     getUserFollowingAction,deleteFavoritesReplyAction,favoritesFollowAction,
     favoritesUnFollowAction,getFavoritesRepliedPostsAction,getMoreFavoritesRepliedPostsAction } from "../actions/FavoriteActions";

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
        builder.addCase(favoritesFollowAction.pending, (state) => {
            state.successMessage = null
            state.error = null
            state.screeenLoading = true
        })
        builder.addCase(favoritesFollowAction.fulfilled, (state, action: PayloadAction<{ message: string, userId: string }>) => {
            state.successMessage = action.payload.message
            const index = state.users.findIndex(user => user._id == action.payload.userId)
            state.users[index].isFollowed = true
            state.screeenLoading = false
        })
        builder.addCase(favoritesFollowAction.rejected, (state, action) => {
            state.screeenLoading = false
            state.error = action.payload as string
        })
        builder.addCase(favoritesUnFollowAction.pending, (state) => {
            state.successMessage = null
            state.error = null
            state.screeenLoading = true
        })
        builder.addCase(favoritesUnFollowAction.fulfilled, (state, action: PayloadAction<{ message: string, userId: string }>) => {
            state.successMessage = action.payload.message
            const index = state.users.findIndex(user => user._id === action.payload.userId)
            state.users[index].isFollowed = false
            state.screeenLoading = false
        })
        builder.addCase(favoritesUnFollowAction.rejected, (state, action) => {
            state.screeenLoading = false
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
                state.repliedPosts.forEach(commentPost => {
                    if (commentPost.post._id === action.payload.postId) {
                        commentPost.post.isLiked = true;
                    }
                });
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
                if (index != -1)
                    state.posts[index].isLiked = false
            }
            else {
                state.repliedPosts.forEach(commentPost => {
                    if (commentPost.post._id === action.payload.postId) {
                        commentPost.post.isLiked = false;
                    }
                });
            }
        })
        builder.addCase(favoritesUnlikeAction.rejected, (state, action) => {
            state.screeenLoading = false
            state.error = action.payload as string
        })
        builder.addCase(getFavoritesRepliedPostsAction.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(getFavoritesRepliedPostsAction.fulfilled, (state, action: PayloadAction<FetchPostsPayload<CommentedPost>>) => {
            state.loading = false
            state.repliedPosts = action.payload.data
            state.lastOffset = action.payload.lastOffset
        })
        builder.addCase(getFavoritesRepliedPostsAction.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
        builder.addCase(getMoreFavoritesRepliedPostsAction.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(getMoreFavoritesRepliedPostsAction.fulfilled, (state, action: PayloadAction<FetchPostsPayload<CommentedPost>>) => {
            state.loading = false
            state.repliedPosts.push(...action.payload.data)
            state.lastOffset = action.payload.lastOffset
        })
        builder.addCase(getMoreFavoritesRepliedPostsAction.rejected, (state, action) => {
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
        builder.addCase(deleteFavoritesReplyAction.pending, (state) => {
            state.screeenLoading = true
            state.error = null
        })
        builder.addCase(deleteFavoritesReplyAction.fulfilled, (state, action) => {
            state.screeenLoading = false
            state.repliedPosts = state.repliedPosts.filter(post => post._id != action.payload.replyId)

        })
        builder.addCase(deleteFavoritesReplyAction.rejected, (state, action) => {
            state.screeenLoading = false
            state.error = action.payload as string
        })
    }
})
export default FavoriteSlice.reducer