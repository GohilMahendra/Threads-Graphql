import { gql } from "@apollo/client";

export const GET_USER_FOLLOWINGS = gql`
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