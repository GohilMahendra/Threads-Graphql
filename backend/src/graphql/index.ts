import Post from "./post";
import User from "./user";
export const TypeDefs = `
    scalar Upload
    type SuccessResponse {
        message: String
    }
    ${User.TypeDef.UserType}
    ${Post.TypeDef.PostType}
    type Query {
    ${User.TypeDef.UserQuery}
    ${Post.TypeDef.PostQuery}
    }
    type Mutation {
    ${User.TypeDef.UserMutation}
    ${Post.TypeDef.PostMutation}
}
`
export const Resolvers = {
    Query: {
        ...User.QuaryResolver,
        ...Post.QuaryResolver
    },
    Mutation:
    {
        ...User.MutationResolver,
        ...Post.QuaryResolver
    }
}
