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

export const SIGN_UP_USER = gql`
mutation SignUp($input: SignUpInput) {
  SignUp(input: $input) {
    message
  }
}
`

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

export const UPADATE_USER = gql`
mutation UpdateUser($input: UpdateUserInput!) {
  UpdateUser(input: $input) {
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
`
export const VERIFY_EMAIL = gql`
mutation VerifyEmail($input: verifyEmailInput!) {
  VerifyEmail(input: $input) {
    message
  }
}
`