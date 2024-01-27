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
    type Comment
    {
        _id: ID!
        post: ID!
        user: OtherUser!
    }
    type CommentResponse
    {
        data: [Comment!]!,
        meta: Meta!
    }
    type CommentedPost
    {
        _id: ID!
        content: String!
        user: OtherUser!
        post: Post!
    }
    type CommentedPostResponse
    {
        data: [CommentedPost!]!
        meta: Meta!
    }
    input PostInput {
        content:String,
        isRepost:Boolean,
        postId:String,
        media: [Upload!]
    }
    input GetPostInput
    {
        lastOffset: String
        pageSize: Int
    }
    input GetPostRepostInput
    {
        post_type: String!
        lastOffset: String
        pageSize: Int
    }
    input GetPostByUserInput
    {
        post_type: String!
        lastOffset: String
        pageSize: Int
        postUserId: ID!
    }

    input PostActionInput
    {
        postId: ID!
    }
    input CommentActionInput
    {
        postId: ID!
        content: String!
    }
    input GetCommentsInput
    {
        content: String!
        postId: ID!
    }
    input GetPostsFullTextSearchInput
    {
        searchTerm: String!
        lastOffset: String
        pageSize: String
    }
    input DeletePostReplyInput
    {
        replyId: ID!
    }
`

const PostQuery = `#graphql
    GetPosts(input: GetPostRepostInput!):PostsResponse
    GetPostsByUser(input: GetPostByUserInput!):PostsResponse
    GetComments(input: GetCommentsInput): CommentResponse
    GetPostsFullTextSearch(input:GetPostsFullTextSearchInput):PostsResponse
    GetUserPosts(input:GetPostRepostInput!):PostsResponse
    GetLikedPosts(input: GetPostInput!): PostsResponse
    GetRepliedPosts(input: GetPostInput!): CommentedPostResponse
`
const PostMutation = `#grapqhl
    CreatePost(input: PostInput!): SuccessResponse
    LikePost(input: PostActionInput!): SuccessResponse
    UnLikePost(input: PostActionInput!): SuccessResponse
    CommentPost(input: CommentActionInput!): SuccessResponse
    DeletePost(input: PostActionInput!): SuccessResponse
    DeletePostReply(input: DeletePostReplyInput!): SuccessResponse
`

export default {PostMutation,PostQuery,PostType}