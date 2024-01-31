import { gql } from "@apollo/client";

export const CREATE_POST = gql`
    mutation CreatePost($input: PostInput!) {
        CreatePost(input: $input) {
            message
        }
    }
`

export const LIKE_POST = gql`
    mutation LikePost($input: PostActionInput!) {
        LikePost(input: $input) {
            message
        }
    }
`
export const UNLIKE_POST = gql`
    mutation UnLikePost($input: PostActionInput!) {
        UnLikePost(input: $input) {
            message
        }
    }
`
export const COMMENT_POST = gql`
    mutation CommentPost($commentPostInput: CommentActionInput!) {
        CommentPost(input: $commentPostInput) {
        message
        }
    }
`

export const DELETE_REPLIED_POST = gql`
mutation DeletePostReply($input: DeletePostReplyInput!) {
    DeletePostReply(input: $input) {
      message
    }
  }
`

export const DELETE_USER_POST = gql`
mutation DeletePost($input: PostActionInput!) {
    DeletePost(input: $input) {
      message
    }
  }
`