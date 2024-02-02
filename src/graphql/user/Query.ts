import { gql } from "@apollo/client";
import { USER_FRAGMENT } from "../common";
export const GET_CURRENT_USER_FOLLOWINGS = gql`
${USER_FRAGMENT}
query GetCurrentUserFollowing($input: GetCurrentUserFollowingsInput) {
  GetCurrentUserFollowing(input: $input) {
    data {
      _id
      follower
      following {
       ...UserFragment
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
${USER_FRAGMENT}
query SearchUsers($input: SearchUsersInput!) {
  SearchUsers(input: $input) {
    data {
      ...UserFragment
    }
  }
}
`
export const GET_USER_BY_ID = gql`
${USER_FRAGMENT}
query GetUserById($input: GetUserByIdInput!) {
  GetUserById(input: $input) {
    ...UserFragment
  }
}
`