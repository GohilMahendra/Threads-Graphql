import { createAsyncThunk } from "@reduxjs/toolkit"
import { Thread } from "../../types/Post"
import { RootState } from "../store"
import { PAGE_SIZE } from "../../globals/constants"
import { client } from "../../graphql"
import { GET_SEARCH_POSTS } from "../../graphql/post/Query"
import { 
    CreateRepostSuccessResponse, 
    GetPostsFullTextSearchInput, 
    GetPostsFullTextSearchResponse, 
    LikePostSuccessResponse, 
    PostActionInput, 
    RepostInput, 
    UnLikePostSuccessResponse 
} from "../../graphql/post/Types"
import { GraphQlInputType } from "../../graphql/common"
import { getToken } from "../../globals/utilities"
import { 
    CREATE_POST, 
    LIKE_POST, 
    UNLIKE_POST 
} from "../../graphql/post/Mutation"

export const fetchPostSearchAction = createAsyncThunk(
    "PostSearch/fetchPostSearchAction",
    async ({ searchTerm }: { searchTerm: string }, { rejectWithValue }) => {
        try {
            const token = await getToken()
            const response = await client.query<GetPostsFullTextSearchResponse, GraphQlInputType<GetPostsFullTextSearchInput>>({
                query: GET_SEARCH_POSTS,
                context: {
                    headers: {
                        token: token
                    },
                },
                fetchPolicy:"no-cache",
                variables: {
                    input: {
                        searchTerm: searchTerm,
                        pageSize: PAGE_SIZE
                    }
                }
            })
            if (response.data) {
                const posts: Thread[] = []
                const theads: Thread[] = response.data.GetPostsFullTextSearch.data
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
                    lastOffset: response.data.GetPostsFullTextSearch.meta.lastOffset
                }
            }
            else {
                return rejectWithValue(JSON.stringify(response.errors))
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
            const token = await getToken()
            const response = await client.query<GetPostsFullTextSearchResponse, GraphQlInputType<GetPostsFullTextSearchInput>>({
                query: GET_SEARCH_POSTS,
                context: {
                    headers: { token: token },
                },
                fetchPolicy:"no-cache",
                variables: {
                    input: {
                        searchTerm: searchTerm,
                        lastOffset: lastOffset,
                        pageSize: PAGE_SIZE
                    }
                }
            })
            if (response.data) {
                const posts: Thread[] = []
                const theads: Thread[] = response.data.GetPostsFullTextSearch.data
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
                    lastOffset: response.data.GetPostsFullTextSearch.meta.lastOffset
                }
            }
            else {
                return rejectWithValue(JSON.stringify(response.errors))
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
            const token = await getToken()
            const response = await client.mutate<LikePostSuccessResponse, GraphQlInputType<PostActionInput>>({
                mutation: LIKE_POST,
                variables: {
                    input: { postId: postId }
                },
                context: {
                    headers: { token: token }
                }
            })
            if (response.data)
                return {
                    postId: postId,
                }
            else
                return rejectWithValue(JSON.stringify(response.errors))
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
            const token = await getToken()
            const response = await client.mutate<UnLikePostSuccessResponse, GraphQlInputType<PostActionInput>>({
                mutation: UNLIKE_POST,
                variables: {
                    input: { postId: postId }
                },
                context: {
                    headers: { token: token }
                }
            })
            if (response.data)
                return {
                    postId: postId,
                }
            else
                return rejectWithValue(JSON.stringify(response.errors))
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
            const token = await getToken()
            const response = await client.mutate<CreateRepostSuccessResponse, GraphQlInputType<RepostInput>>({
                mutation: CREATE_POST,
                variables: {
                    input: {
                        content,
                        postId,
                        isRepost: true
                    }
                },
                context: {
                    headers: { token: token }
                }
            })
            if (response.data)
                return response.data.CreatePost.message
            else
                return rejectWithValue(JSON.stringify(response.errors))
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }

    }
)

