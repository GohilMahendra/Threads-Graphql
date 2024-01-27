import postServices from "../../services/post.services"
import { ExcludeContextType } from "../../types/Global"
import { GetCommentsInput, GetPostByUserInput, GetPostRepostInput, GetPostsInput, TextSearchInput } from "../../types/Post"
import { UserContext } from "../../utilities/Context"

const QuaryResolver = {
    GetPosts: async (parent: any,
        {
            lastOffset,
            pageSize,
            post_type
        }: ExcludeContextType<GetPostRepostInput>,
        context: UserContext) => {
        const userId = context.userId
        const response = await postServices.getPosts({
            userId,
            lastOffset,
            pageSize,
            post_type
        })
        return response
    },
    GetPostsByUser: async (parent: any,
        {
            lastOffset,
            pageSize,
            post_type,
            postUserId
        }: ExcludeContextType<GetPostByUserInput>,
        context: UserContext) => {
        const userId = context.userId
        const response = await postServices.getPostsByUser({
            postUserId,
            userId,
            lastOffset,
            pageSize,
            post_type
        })
        return response
    },
    GetComments: async (parent: any,
        {
            lastOffset,
            pageSize,
            postId
        }: ExcludeContextType<GetCommentsInput>,
        context: UserContext) => {
        const userId = context.userId
        const response = await postServices.getComments({
           postId,
           userId,
           lastOffset,
           pageSize
        })
        return response
    },
    GetPostsFullTextSearch: async (parent: any,
        {
            searchTerm,
            lastOffset,
            pageSize
        }: ExcludeContextType<TextSearchInput>,
        context: UserContext) => {
        const userId = context.userId
        const response = await postServices.getPostsFullTextSearch({
           searchTerm,
           userId,
           lastOffset,
           pageSize
        })
        return response
    },
    GetUserPosts: async (parent: any,
        {
           lastOffset,
           pageSize,
           post_type
        }: ExcludeContextType<GetPostRepostInput>,
        context: UserContext) => {
        const userId = context.userId
        const response = await postServices.getUserPosts({
           userId,
           lastOffset,
           pageSize,
           post_type
        })
        return response
    },
    GetLikedPosts: async (parent: any,
        {
           lastOffset,
           pageSize
        }: ExcludeContextType<GetPostsInput>,
        context: UserContext) => {
        const userId = context.userId
        const response = await postServices.getLikedPosts({
           userId,
           lastOffset,
           pageSize
        })
        return response
    },
    GetRepliedPosts: async (parent: any,
        {
           lastOffset,
           pageSize
        }: ExcludeContextType<GetPostsInput>,
        context: UserContext) => {
        const userId = context.userId
        const response = await postServices.getRepliedPosts({
           userId,
           lastOffset,
           pageSize
        })
        return response
    }
}
export default QuaryResolver