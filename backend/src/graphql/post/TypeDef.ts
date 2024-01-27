const PostType = `#graphql
    type MediaType {
        media_type: String!
        media_url: String!
        thumbnail: String
    }

    type Post {
        _id: ID!
        user: OtherUser!
        content: String
        media: [MediaType!]
        hashtags: [String]
        likes: Int
        replies: Int
        isRepost: Boolean
        Repost: Post
        isLiked: Boolean
        created_at: String
        updated_at: String
    }

    type Meta {
        pagesize: Int,
        lastOffset: String
    }

    type PostResponse {
        data: [Post!]
        meta: Meta!
    }

    type Media {
        media_type: String!
        media_url: String!
        thumbnail: String
    }

    input PostInput {
        content:String,
        isRepost:Boolean,
        postId:String,
        media: [Upload]
    }

    input GetPostInput
    {
        lastOffset: String,
        pageSize: String,
        post_type: String
    }
`

const PostQuery = `#graphql

`
const PostMutation = `#grapqhl
    CreatePost(input: PostInput!): SuccessResponse
`

export default {PostMutation,PostQuery,PostType}