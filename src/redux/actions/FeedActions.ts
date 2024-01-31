import { createAsyncThunk } from "@reduxjs/toolkit"
import { Thread } from "../../types/Post"
import { RootState } from "../store"
import { client } from "../../graphql"
import { GET_POST_REPOSTS } from "../../graphql/post/Query"
import {
    CommentActionInput,
    CreateCommentSucceessResponse,
    CreateRepostSuccessResponse,
    GetPostRepostInput,
    GetPostRepostResponse,
    LikePostSuccessResponse,
    PostActionInput,
    RepostInput,
    UnLikePostSuccessResponse,
} from "../../graphql/post/Types"
import { GraphQlInputType } from "../../graphql/common";
import { getToken } from "../../globals/utilities"
import { PAGE_SIZE } from "../../globals/constants"
import { COMMENT_POST, CREATE_POST, LIKE_POST, UNLIKE_POST } from "../../graphql/post/Mutation"

export const FetchPostsAction = createAsyncThunk(
    "Feed/FetchPostsAction",
    async ({ post_type }: { post_type: string }, { rejectWithValue }) => {
        try {
            const token = await getToken()
            const getPostsResponse = await client.query<GetPostRepostResponse, GraphQlInputType<GetPostRepostInput>>({
                query: GET_POST_REPOSTS,
                context: {
                    headers: {
                        token: token
                    },
                },
                variables: {
                    input: {
                        post_type: post_type,
                        pageSize: PAGE_SIZE
                    }
                },
                fetchPolicy:"cache-first"
            })
            if (getPostsResponse.data && !getPostsResponse.errors) {
                const response = getPostsResponse.data.GetPosts
                const posts: Thread[] = []
                const theads: Thread[] = response.data
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
                    lastOffset: response.meta.lastOffset
                }
            }
            else {
                return rejectWithValue(JSON.stringify(getPostsResponse.errors))
            }
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    })

export const FetchMorePostsAction = createAsyncThunk(
    "Feed/FetchMorePostsAction",
    async ({ post_type }: { post_type: string }, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState
            const lastOffset = state.Feed.lastOffset
            if (!lastOffset) {
                return {
                    data: [],
                    lastOffset: null
                }
            }
            const token = await getToken()
            console.log(lastOffset)
            const getPostsResponse = await client.query<GetPostRepostResponse, GraphQlInputType<GetPostRepostInput>>({
                query: GET_POST_REPOSTS,
                context: {
                    headers: {
                        token: token
                    },
                },
                variables: {
                    input: {
                        post_type: post_type,
                        lastOffset: lastOffset,
                        pageSize: PAGE_SIZE
                    }
                },
                fetchPolicy:"cache-first"
            })
            if (getPostsResponse.data && !getPostsResponse.errors) {
                const response = getPostsResponse.data.GetPosts
                const posts: Thread[] = []
                const theads: Thread[] = response.data
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
                console.log(lastOffset, "offset i am getting from earch ")
                return {
                    data: posts,
                    lastOffset: response.meta.lastOffset
                }
            }
            else {
                return rejectWithValue(JSON.stringify(getPostsResponse.errors))
            }

        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    })

export const LikeAction = createAsyncThunk(
    "Feed/LikeAction",
    async ({ postId }: { postId: string }, { rejectWithValue }) => {
        try {
            const token = await getToken()
            const likePostAction = await client.mutate<LikePostSuccessResponse, GraphQlInputType<PostActionInput>>({
                mutation: LIKE_POST,
                variables: {
                    input: {
                        postId: postId
                    }
                },
                context: {
                    headers: {
                        token: token
                    }
                }
            })
            if(likePostAction.data)
            return {
                postId: postId,
            }
            else
            return rejectWithValue(JSON.stringify(likePostAction.errors))
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    }
)

export const unLikeAction = createAsyncThunk(
    "Feed/unLikeAction",
    async ({ postId }: { postId: string }, { rejectWithValue }) => {
        try {
            const token = await getToken()
            const unLikeResponse = await client.mutate<UnLikePostSuccessResponse, GraphQlInputType<PostActionInput>>({
                mutation: UNLIKE_POST,
                variables: {
                    input: {
                        postId: postId
                    }
                },
                context: {
                    headers: {
                        token: token
                    }
                }
            })
            if(unLikeResponse.data)
            return {
                postId: postId,
            }
            else
            return rejectWithValue(JSON.stringify(unLikeResponse.errors))
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    }
)

export const createCommentAction = createAsyncThunk(
    "Feed/createCommentAction",
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
                    headers: {
                        token: token
                    }
                }
            })
            if(response.data)
            return response.data.CommentPost.message
            else
            return rejectWithValue(JSON.stringify(response.errors))
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    }
)

export const feedCreateRepostAction = createAsyncThunk(
    "feed/feedCreateRepostAction",
    async ({ postId, content }: { postId: string, content?: string }, { rejectWithValue }) => {
        try {
            const token = await getToken()
            const response = await client.mutate<CreateRepostSuccessResponse,GraphQlInputType<RepostInput>>({
                mutation: CREATE_POST,
                variables: {
                    input:{
                        content,
                        postId
                    }
                },
                context:{
                    headers:{
                        token: token
                    }
                }
            })
            if(response.data)
            return response.data.CreatePost.message
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }

    }
)

