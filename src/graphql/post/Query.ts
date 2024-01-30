import { gql } from "@apollo/client";

export const GET_POST_REPOSTS = gql`
query GetPosts($input: GetPostRepostInput!) {
  GetPosts(input: $input) {
    data {
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
      Repost {
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
        hashtags
        likes
        replies
        isRepost
        isLiked
        created_at
        updated_at
      }
      isLiked
      created_at
      updated_at
    }
    meta {
      pagesize
      lastOffset
    }
  }
}
`
