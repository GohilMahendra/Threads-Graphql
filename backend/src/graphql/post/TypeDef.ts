const PostType = `#graphql

    type Post {
        _id: ID!
        user: OtherUser!
        content: String
        media: [Media!]
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

    type PostsResponse {
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
        post_type: String
        lastOffset: String
        pageSize: Int
    }
`

const PostQuery = `#graphql
    GetPosts(input: GetPostInput!):PostsResponse
`
const PostMutation = `#grapqhl
    CreatePost(input: PostInput!): SuccessResponse
`

export default {PostMutation,PostQuery,PostType}