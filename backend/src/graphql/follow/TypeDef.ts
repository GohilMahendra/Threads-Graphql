{/*

# global Types (Don't Repeat In schema Already There)

scalar Upload
type SuccessResponse {
    message: String
}

*/}

export const FollowType = `#graphql
  input GetFollowingsInput {
    followingId: ID!,
    pageSize: Int,
    lastOffset: String
  }

  input GetCurrentUserFollowingsInput
  {
    pageSize: Int,
    lastOffset: String,
  }

  input FollowActionInput{
    followingId: String
  }

`
export const FollowQuery = `#graphql
    GetUserFollowings(input:GetFollowingsInput!): [OtherUser!]!
    GetCurrentUserFollowing(input: GetCurrentUserFollowingsInput!):[OtherUser!]!
`
export const FollowMutation = `#graphql
    FollowUser(input:FollowActionInput!):SuccessResponse
    UnFollowUser(input:FollowActionInput!):SuccessResponse
`

export default { FollowType, FollowQuery, FollowMutation }