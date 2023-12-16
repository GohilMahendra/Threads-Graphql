import { PostType } from "../models/Post";
import { UserResponse } from "./User";

type PostUser = UserResponse
export type PostResponse = PostType & 
{
    isLiked: boolean
}
