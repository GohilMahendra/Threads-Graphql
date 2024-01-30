import { gql } from "@apollo/client";
export const SIGN_IN_USER = gql`
  mutation SignIn($input: LoginInput!) {
    SignIn(input: $input) {
        _id
        username
        fullname
        email
        bio
        password
        followers
        following
        profile_picture
        verified
        token
        otp
        isFollowed
    }
  }
`;

export const FOLLOW_USER = gql`
mutation FollowUser($input: FollowActionInput!) {
  FollowUser(input: $input) {
    message
  }
}
`

export const UNFOLLOW_USER = gql`
mutation UnFollowUser($input: FollowActionInput!) {
  UnFollowUser(input: $input) {
    message
  }
}
`