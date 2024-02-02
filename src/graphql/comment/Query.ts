import { gql } from "@apollo/client";
import {  USER_FRAGMENT } from "../common";
export const GET_COMMENTS = gql`
${USER_FRAGMENT}
query GetComments($input: GetCommentsInput!) {
  GetComments(input: $input) {
    data {
      _id
      post
      user {
        ...UserFragment
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