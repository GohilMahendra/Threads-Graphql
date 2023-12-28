import { User } from "./User"


export type Media =
{
    media_type:string,
    media_url: string,
    _id:string,
    thumbnail?: string
}

export type UploadMedia =
{
    name:string,
    uri:string,
    type:string
}
export type Thread = 
{
    _id: string,
    user: User,
    content: string | undefined
    media: Media[],
    hashtags: string[],
    likes: number,
    replies: number,
    isRepost: boolean,
    isLiked: boolean,
    created_at: string,
    updated_at: string,
    Repost: Thread | undefined
}