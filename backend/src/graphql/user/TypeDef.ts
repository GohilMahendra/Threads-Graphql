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
`
export const UserQuery = `#graphql
      GetUser:String
`
export const UserMutation = `#graphql
    SignIn(input: LoginInput!): User
    UpdateUser(input:UpdateUserInput!): User
`

export default {UserQuery,UserMutation,UserType}