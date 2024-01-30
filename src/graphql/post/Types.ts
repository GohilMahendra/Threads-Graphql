import { PaginationMeta, SuccessResponse } from "../common";
import { Thread } from "../../types/Post"
import { CommentedPost } from "../../types/Comment";

export interface GetPostRepostResponse
{
    GetPosts:{
        data:Thread[],
        meta:PaginationMeta
    }
}

export interface PaginationInput 
{
    pageSize?:number,
    lastOffset?: string
}

export interface GetPostRepostInput extends PaginationInput
{
    post_type: string,
} 

export interface PostActionInput
{
    postId: string
}

export interface CommentActionInput
{
    postId: string,
    content: string
}

export interface PostInput
{
    content?: string,
    isRepost?: string,
    postId?: string,
    media?: string
}

export interface RepostInpt 
{
    content?: string,
    postId: string
}

export interface GetLikedPostsInput
{
    pageSize?:number,
    lastOffset?: string
}

export interface GetLikedPostsResponse
{
    GetLikedPosts:
    {
        data: Thread[],
        meta: PaginationMeta
    }
}

export interface GetRepliedPostsResponse
{
    GetRepliedPosts:
    {
        data: CommentedPost[],
        meta: PaginationMeta
    }
}

export interface DeleteRepliedPostInput
{
    replyId: string
}

export type LikePostSuccessResponse = SuccessResponse<"LikePost">
export type UnLikePostSuccessResponse = SuccessResponse<"UnLikePost">
export type CreateCommentSucceessResponse = SuccessResponse<"CommentPost">
export type CreateRepostSuccessResponse = SuccessResponse<"CreatePost">
export type DeleteRepliedPostSuccessResponse = SuccessResponse<"DeletePostReply">
