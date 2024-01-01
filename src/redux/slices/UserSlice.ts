import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { User } from "../../types/User";
import { Thread } from "../../types/Post";
import { FetchPostsPayload } from "../types/global";
import { DeletePostAction, FetchMoreUserPostsAction, FetchUserPostsAction, SignInAction, SignUpAction, UpdateAction, createPostAction, createRepostAction, verifyOtpUserAction } from "../actions/UserActions";
type UserStateType =
    {
        user: User,
        Posts: Thread[],
        loading: boolean,
        error: null | string,
        morePostsLoading: boolean,
        morePostsError: null | string,
        lastOffset: string | null,
        screenLoading: boolean
    }

const initalUser: User =
{
    email: "",
    followers: 0,
    following: 0,
    _id: "",
    bio: "",
    username: "",
    fullname: "",
    verified: false,
    profile_picture: "",
    isFollowed: false
}
const initialState: UserStateType =
{
    user: initalUser,
    loading: false,
    error: null,
    Posts: [],
    lastOffset: null,
    morePostsError: null,
    morePostsLoading: false,
    screenLoading: false
}


export const UserSlice = createSlice({
    name: "User",
    initialState: initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers(builder) {
        builder.addCase(SignInAction.pending, state => {
            state.loading = true
            state.error = null
        })
        builder.addCase(SignInAction.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false
            state.user = action.payload
        })
        builder.addCase(SignInAction.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
        builder.addCase(SignUpAction.pending, state => {
            state.loading = true
            state.error = null
        })
        builder.addCase(SignUpAction.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false
            state.user = action.payload
        })
        builder.addCase(SignUpAction.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
        builder.addCase(FetchUserPostsAction.pending, (state) => {
            state.loading = true
            state.Posts = []
            state.error = null
        })
        builder.addCase(FetchUserPostsAction.fulfilled, (state, action: PayloadAction<FetchPostsPayload<Thread>>) => {
            state.loading = false
            state.Posts = action.payload.data
            state.lastOffset = action.payload.lastOffset
        })
        builder.addCase(FetchUserPostsAction.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
        builder.addCase(FetchMoreUserPostsAction.pending, (state) => {
            state.morePostsLoading = true
            state.morePostsError = null
        })
        builder.addCase(FetchMoreUserPostsAction.fulfilled, (state, action: PayloadAction<FetchPostsPayload<Thread>>) => {
            state.morePostsLoading = false
            state.Posts = [...state.Posts,...action.payload.data]
            state.lastOffset = action.payload.lastOffset
        })
        builder.addCase(FetchMoreUserPostsAction.rejected, (state, action) => {
            state.morePostsLoading = false
            state.morePostsError = action.payload as string
        })

        builder.addCase(DeletePostAction.pending, state => {
            state.screenLoading = true
            state.error = null
        })
        builder.addCase(DeletePostAction.fulfilled, (state, action: PayloadAction<{ postId: string }>) => {
            console.log("Hi, I am deleting this")
            state.screenLoading = false
            state.Posts = state.Posts.filter(post=>post._id !== action.payload.postId)
        })
        builder.addCase(DeletePostAction.rejected, (state, action) => {
            state.screenLoading = false
            state.error = action.payload as string
        })
        builder.addCase(createPostAction.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(createPostAction.fulfilled, (state, action: PayloadAction<string>) => {
            state.loading = false
        })
        builder.addCase(createPostAction.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
        builder.addCase(createRepostAction.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(createRepostAction.fulfilled, (state, action: PayloadAction<string>) => {
            state.loading = false
        })
        builder.addCase(createRepostAction.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
        builder.addCase(verifyOtpUserAction.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(verifyOtpUserAction.fulfilled, (state, action) => {
            state.loading = false
        })
        builder.addCase(verifyOtpUserAction.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
        builder.addCase(UpdateAction.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(UpdateAction.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload.user
        })
        builder.addCase(UpdateAction.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
    }
})
export const { setUser } = UserSlice.actions
export default UserSlice.reducer