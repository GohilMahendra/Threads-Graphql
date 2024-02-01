import { gql } from "@apollo/client";

export const GET_COMMENTS = gql`
query GetComments($input: GetCommentsInput!) {
  GetComments(input: $input) {
    data {
      _id
      post
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
      created_at
      updated_at
      content
    }
    meta {
      pagesize
      lastOffset
    }
  }
}
`