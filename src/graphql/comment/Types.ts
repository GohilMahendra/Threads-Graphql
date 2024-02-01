import {
    PaginationMeta,
    SuccessResponse
} from "../common";
import {
    Comment
} from "../../types/Comment";
export interface CommentActionInput {
    postId: string,
    content: string
}

export interface GetCommentsInput {
    postId: string
    lastOffset?: string,
    pageSize?: number
}

export interface GetCommentsResponse {
    GetComments: {
        data: Comment[],
        meta: PaginationMeta
    }
}
export type CreateCommentSucceessResponse = SuccessResponse<"CommentPost">