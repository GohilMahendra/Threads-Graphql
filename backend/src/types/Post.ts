import { PopulatedDoc } from "mongoose";
import { UserDocument } from "./User";

export interface Media {
    media_type: string;
    media_url: string;
    thumbnail?: string;
}

export interface PostDocument extends Document {
    _id: string,
    user: PopulatedDoc<UserDocument>;
    content: string;
    media: Media[];
    hashtags: string[];
    likes: number;
    replies: number;
    isRepost: boolean;
    Repost?: PopulatedDoc<PostDocument>;
    isLiked: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface GetPostsInput {
    userId: string,
    lastOffset?: string,
    pageSize?: number,
}

export interface GetPostRepostInput extends GetPostsInput {
    post_type?: string
}
export interface GetCommentsInput {
    userId: string,
    lastOffset?: string,
    pageSize?: number,
    postId?: string
}
export interface PostActionInput {
    userId: string,
    postId: string
}
export interface DeleteReplyInput {
    userId: string,
    replyId: string
}
export interface TextSearchInput {
    userId: string,
    lastOffset?: string,
    pageSize?: number,
    searchTerm: string
}
export type PaginatedResponse<T> =
    {
        data: T,
        meta: {
            pageSize: number,
            lastOffset: string | null
        }
    }
export interface CommentActionInput extends PostActionInput {
    content: string
}

interface SuccessMessage {
    message: string
}


