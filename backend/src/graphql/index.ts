import Post from "./post";
import User from "./user";
import Follow from "./follow"
export const TypeDefs = `
    scalar Upload
    scalar Date
    type SuccessResponse {
        message: String!
    }
    type Meta {
        pagesize: Int,
        lastOffset: String
    }
    ${User.TypeDef.UserType}
    ${Post.TypeDef.PostType}
    ${Follow.TypeDef.FollowType}
    type Query {
    ${User.TypeDef.UserQuery}
    ${Post.TypeDef.PostQuery}
    ${Follow.TypeDef.FollowQuery}
    }
    type Mutation {
    ${User.TypeDef.UserMutation}
    ${Post.TypeDef.PostMutation}
    ${Follow.TypeDef.FollowMutation}
}
`
export const Resolvers = {
    Query: {
        ...User.QuaryResolver,
        ...Post.QuaryResolver,
        ...Follow.QuaryResolver
    },
    Mutation:
    {
        ...User.MutationResolver,
        ...Post.MutationResolver,
        ...Follow.MutationResolver
    }
}
