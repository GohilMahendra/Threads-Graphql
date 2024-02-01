import { PaginationMeta, SuccessResponse } from "../common";
import { Thread, UploadMedia } from "../../types/Post"
import { CommentedPost } from "../../types/Comment";

export interface GetPostRepostResponse {
    GetPosts: {
        data: Thread[],
        meta: PaginationMeta
    }
}

export interface PaginationInput {
    pageSize?: number,
    lastOffset?: string
}

export interface GetPostRepostInput extends PaginationInput {
    post_type: string,
}

export interface PostActionInput {
    postId: string
}

export interface PostInput {
    content?: string,
    isRepost?: Boolean,
    postId?: string,
    media?: UploadMedia[]
}

export interface RepostInput {
    content?: string,
    postId: string
}

export interface GetLikedPostsInput {
    pageSize?: number,
    lastOffset?: string
}

export interface GetLikedPostsResponse {
    GetLikedPosts:
    {
        data: Thread[],
        meta: PaginationMeta
    }
}

export interface GetRepliedPostsResponse {
    GetRepliedPosts:
    {
        data: CommentedPost[],
        meta: PaginationMeta
    }
}

export interface GetUserPostsRepostResponse {
    GetUserPosts:
    {
        data: Thread[],
        meta: PaginationMeta
    }
}

export interface GetPostsFullTextSearchInput {
    searchTerm: string,
    lastOffset?: string,
    pageSize?: number
}

export interface GetPostsFullTextSearchResponse {
    GetPostsFullTextSearch:
    {
        data: Thread[],
        meta: PaginationMeta
    }
}

export interface GetPostsFullTextSearch {
    GetPostsFullTextSearch:
    {
        data: Thread[],
        meta: PaginationMeta
    }
}

export interface GetPostsByUserInput {
    post_type: string,
    lastOffset?: string,
    pageSize?: number,
    postUserId: string
}

export interface GetPostsByUserResponse {
    GetPostsByUser: {
        data: Thread[],
        meta: PaginationMeta
    }
}

export interface DeleteRepliedPostInput {
    replyId: string
}

export type LikePostSuccessResponse = SuccessResponse<"LikePost">
export type UnLikePostSuccessResponse = SuccessResponse<"UnLikePost">
export type CreateRepostSuccessResponse = SuccessResponse<"CreatePost">
export type DeleteRepliedPostSuccessResponse = SuccessResponse<"DeletePostReply">
export type DeleteUserPostSuccessResponse = SuccessResponse<"DeletePost">