import { SuccessResponse } from "..";
import { Thread } from "../../types/Post"
import {   } from "graphql";

export interface PaginationMeta 
{
    pageSize:number,
    lastOffset: string | null
}
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

export type LikePostSuccessResponse = SuccessResponse<"LikePost">
export type UnLikePostSuccessResponse = SuccessResponse<"UnLikePost">
export type CreateCommentSucceessResponse = SuccessResponse<"CommentPost">
export type CreateRepostSuccessResponse = SuccessResponse<"CreatePost">
