import { gql } from "@apollo/client";

export interface GraphQlInputType<T>
{
    input: T
}

export type SuccessResponse<T extends string> = {
    [key in T]: {
      message: string;
    };
};

export interface PaginationMeta 
{
    pageSize:number,
    lastOffset: string | null
}

export interface PaginatedResponse<T>
{
    data:T[],
    meta:PaginationMeta
}

export const USER_FRAGMENT = gql`
    fragment UserFragment on OtherUser {
        _id
        username
        fullname
        email
        bio
        followers
        following
        profile_picture
        verified
        isFollowed
      }
`
export const REPOST_FRAGMENT = gql`
    fragment RepostFragment on Post
    {
        _id
        user {
          _id
          username
          fullname
          email
          bio
          followers
          following
          profile_picture
          verified
          isFollowed
        }
        content
        media {
          media_type
          media_url
          thumbnail
        }
        hashtags
        likes
        replies
        isRepost
        isLiked
        created_at
        updated_at
    }
`
