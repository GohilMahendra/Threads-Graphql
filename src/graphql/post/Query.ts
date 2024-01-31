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
export const GET_LIKED_POSTS = gql`
query GetLikedPosts($input: GetPostInput) {
  GetLikedPosts(input: $input) {
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
    meta {
      pagesize
      lastOffset
    }
  }
}
`
export const GET_REPLIED_POSTS = gql`
query GetRepliedPosts($input: GetPostInput) {
  GetRepliedPosts(input: $input) {
    data {
      _id
      content
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
query GetUserPosts($getUserPostsInput: GetPostRepostInput!) {
  GetUserPosts(input: $getUserPostsInput) {
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
    meta {
      pagesize
      lastOffset
    }
  }
}

`
export const GET_SEARCH_POSTS = gql`
query GetPostsFullTextSearch($input: GetPostsFullTextSearchInput) {
  GetPostsFullTextSearch(input: $input) {
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
    meta {
      pagesize
      lastOffset
    }
  }
}
`

