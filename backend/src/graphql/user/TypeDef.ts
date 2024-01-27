{/*

# global Types (Don't Repeat In schema Already There)

scalar Upload
type SuccessResponse {
    message: String
}

*/}

export const UserType = `#graphql
    type User {
    _id: ID!
    username: String!
    fullname: String!
    email: String!
    bio: String
    password: String!
    followers: Int!
    following: Int!
    profile_picture: String
    verified: Boolean!
    token: String
    otp: String
    isFollowed: Boolean!
    }

    type OtherUser {
    _id: ID!
    username: String!
    fullname: String!
    email: String!
    bio: String
    followers: Int!
    following: Int!
    profile_picture: String
    verified: Boolean!
    isFollowed: Boolean!
    }

    input UpdateUserInput 
    {
      bio: String
      fullName: String
      profile_picture: Upload
    }

    input LoginInput
    {
      email: String!
      password: String!
    }
    input GetUserByIdInput
    {
      profileId:String!
    }

    input SignUpInput
    {
      email: String!
      password: String!
      fullname: String!
      username: String!
    }

    input verifyEmailInput
    {
      email: String!
      otp: String
    }

    input SearchUsersInput
    {
      query: String!
    }

    type SearchUserResponse
    {
      data: [OtherUser]
    }
`
export const UserQuery = `#graphql
    GetUserById(input:GetUserByIdInput!): OtherUser
    SearchUsers(input: SearchUsersInput!):SearchUserResponse
`
export const UserMutation = `#graphql
    SignIn(input: LoginInput!): User
    SignUp(input: SignUpInput): SuccessResponse
    UpdateUser(input:UpdateUserInput!): User
    VerifyEmail(input:verifyEmailInput!):SuccessResponse
`

export default {UserQuery,UserMutation,UserType}