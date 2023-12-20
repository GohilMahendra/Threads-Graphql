import { User } from "./User";

export interface Comment {
    _id: string;
    user: User;
    postId: string;
    content: string;
    created_at: string;
    updated_at: string;
}

