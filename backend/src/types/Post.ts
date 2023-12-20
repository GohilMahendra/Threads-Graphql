import mongoose, { PopulatedDoc } from "mongoose";
import { UserDocument } from "./User";

export interface Media {
    media_type: string;
    media_url: string;
    thumbnail?: string | null;
}

export interface PostDocument extends Document {
    user: PopulatedDoc<UserDocument>;
    content: string;
    media: Media[];
    hashtags: string[];
    likes: number;
    replies: number;
    isRepost: boolean;
    Repost?:PopulatedDoc<PostDocument>;
    isLiked: boolean;
    created_at: Date;
    updated_at: Date;
}
