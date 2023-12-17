import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Thread } from "../../types/Post";
import { fetchPosts, likePost, unLikePost } from "../../apis/FeedAPI";
type FeedStateType = 
{
    Threads: Thread[],
    loading: boolean,
    error: null | string,
    LikeSuccess: boolean
}

const initialState: FeedStateType = 
{
    Threads:[],
    loading:false,
    error: null,
    LikeSuccess: false
   
}

export const FetchPostsAction = createAsyncThunk(
    "Feed/FetchPostsAction",
    async(fakeArg:string,{rejectWithValue})=>{
        try
        {
           const response =await fetchPosts()

           const posts:Thread[] = []
           const theads: Thread[] = response.data.data
           console.log(theads)
           theads.forEach((item,index)=>{
            const post:Thread = 
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

        return posts

        }
        catch(err)
        {
            return rejectWithValue(JSON.stringify(err))
        }
})

export const LikeAction = createAsyncThunk(
    "Feed/LikeAction",
    async({postId}:{postId:string},{rejectWithValue})=>{
       try
       {
        const response = await likePost(postId)
        return {
            postId: postId,
        }
       }
       catch(err)
       {
        console.log(err)
        return rejectWithValue(JSON.stringify(err))
       }
    }
)

export const unLikeAction = createAsyncThunk(
    "Feed/unLikeAction",
    async({postId}:{postId:string},{rejectWithValue})=>{
       try
       {
        const response = await unLikePost(postId)
        return {
            postId: postId,
        }
       }
       catch(err)
       {
        console.log(err)
        return rejectWithValue(JSON.stringify(err))
       }
    }
)

export const FeedSlice = createSlice({
    name:"Feed",
    initialState: initialState,
    reducers:{
    },
    extraReducers(builder){
       builder.addCase(FetchPostsAction.pending,(state)=>{
        state.loading = true,
        state.Threads = [],
        state.error = null
       })
       builder.addCase(FetchPostsAction.fulfilled,(state,action:PayloadAction<Thread[]>)=>{
        state.loading = false
        state.Threads = action.payload
       })
       builder.addCase(FetchPostsAction.rejected,(state,action)=>
       {
        state.loading = false,
        state.error = action.payload as string
       })
       builder.addCase(LikeAction.pending,(state)=>{
            state.LikeSuccess = false
       })
       builder.addCase(LikeAction.fulfilled,(state,action:PayloadAction<{postId:string}>)=>{
        state.LikeSuccess= true
        const refrence = [...state.Threads]
        const index = refrence.findIndex((item)=>item._id == action.payload.postId)
        refrence[index].isLiked = true
        state.Threads = refrence
       })
       builder.addCase(LikeAction.rejected,(state,payload)=>{
        state.LikeSuccess= false
       })
       builder.addCase(unLikeAction.fulfilled,(state,action:PayloadAction<{postId:string}>)=>{
        state.LikeSuccess= true
        const refrence = [...state.Threads]
        const index = refrence.findIndex((item)=>item._id == action.payload.postId)
        refrence[index].isLiked = false
        state.Threads = refrence
       })
    }
})
export default FeedSlice.reducer