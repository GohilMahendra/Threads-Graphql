import { gql } from "@apollo/client";

export const GET_CURRENT_USER_FOLLOWINGS = gql`
query GetCurrentUserFollowing($input: GetCurrentUserFollowingsInput) {
  GetCurrentUserFollowing(input: $input) {
    data {
      _id
      follower
      following {
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
    }
    meta {
      pagesize
      lastOffset
    }
  }
}
`

export const SEARCH_USERS = gql`
query SearchUsers($input: SearchUsersInput!) {
  SearchUsers(input: $input) {
    data {
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
  }
}
`
export const GET_USER_BY_ID = gql`
query GetUserById($input: GetUserByIdInput!) {
  GetUserById(input: $input) {
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
}
`