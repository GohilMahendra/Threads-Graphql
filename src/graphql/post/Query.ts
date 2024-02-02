import { gql } from "@apollo/client";
import { REPOST_FRAGMENT, USER_FRAGMENT  } from "../common";
export const GET_POST_REPOSTS = gql`
${USER_FRAGMENT}
${REPOST_FRAGMENT}
query GetPosts($input: GetPostRepostInput!) {
  GetPosts(input: $input) {
    data {
      _id
      user {
       ...UserFragment
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
       ...RepostFragment
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
export const GET_LIKED_POSTS = gql`
${USER_FRAGMENT}
${REPOST_FRAGMENT}
query GetLikedPosts($input: GetPostInput) {
  GetLikedPosts(input: $input) {
    data {
      _id
      user {
       ...UserFragment
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
       ...RepostFragment
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
export const GET_REPLIED_POSTS = gql`
${USER_FRAGMENT}
query GetRepliedPosts($input: GetPostInput) {
  GetRepliedPosts(input: $input) {
    data {
      _id
      content
      user {
       ...UserFragment
      }
      post {
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
        isLiked
        created_at
        updated_at
      }
    }
    meta {
      pagesize
      lastOffset
    }
  }
}
`
export const GET_USER_POSTS = gql`
${USER_FRAGMENT}
${REPOST_FRAGMENT}
query GetUserPosts($input: GetPostRepostInput!) {
  GetUserPosts(input: $input) {
    data {
      _id
      user {
       ...UserFragment
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
        ...RepostFragment
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
export const GET_SEARCH_POSTS = gql`
${USER_FRAGMENT}
${REPOST_FRAGMENT}
query GetPostsFullTextSearch($input: GetPostsFullTextSearchInput) {
  GetPostsFullTextSearch(input: $input) {
    data {
      _id
      user {
       ...UserFragment
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
       ...RepostFragment
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
export const GET_POSTS_BY_USER = gql`
${USER_FRAGMENT}
${REPOST_FRAGMENT}
query GetPostsByUser($input: GetPostByUserInput!) {
  GetPostsByUser(input: $input) {
    data {
      _id
      user {
       ...UserFragment
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
       ...RepostFragment
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
