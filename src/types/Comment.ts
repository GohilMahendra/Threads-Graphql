import { User } from "./User";
import { Thread } from "./Post";
export interface Comment {
    _id: string;
    user: User;
    post: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface CommentedPost {
    _id: string;
    user: User;
    post: Thread;
    content: string;
    created_at: string;
    updated_at: string;
}

