import { gql } from "@apollo/client";

export const COMMENT_POST = gql`
mutation CommentPost($input: CommentActionInput!) {
    CommentPost(input: $input) {
      message
    }
  }
`