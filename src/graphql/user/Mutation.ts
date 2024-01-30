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