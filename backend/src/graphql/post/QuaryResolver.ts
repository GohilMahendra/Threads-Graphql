import postServices from "../../services/post.services"
import { ExcludeContextType } from "../../types/Global"
import { GetCommentsInput, GetPostByUserInput, GetPostRepostInput, GetPostsInput, TextSearchInput } from "../../types/Post"
import { UserContext } from "../../utilities/Context"

const QuaryResolver = {
    GetPosts: async (parent: any,
        { input }: { input: ExcludeContextType<GetPostRepostInput> },
        context: UserContext) => {
        const userId = context.userId
        const { post_type, lastOffset, pageSize } = input
        const response = await postServices.getPosts({
            userId,
            lastOffset,
            pageSize,
            post_type
        })
        return response
    },
    GetPostsByUser: async (parent: any,
        { input }: { input: ExcludeContextType<GetPostByUserInput> },
        context: UserContext) => {
        const userId = context.userId
        const { postUserId, post_type, lastOffset, pageSize } = input
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
        { input }: { input: ExcludeContextType<GetCommentsInput> },
        context: UserContext) => {
        const userId = context.userId
        const { postId, lastOffset, pageSize } = input
        const response = await postServices.getComments({
            postId,
            userId,
            lastOffset,
            pageSize
        })
        return response
    },
    GetPostsFullTextSearch: async (parent: any,
        { input }: { input: ExcludeContextType<TextSearchInput> },
        context: UserContext) => {
        const userId = context.userId
        const { searchTerm, lastOffset, pageSize } = input
        const response = await postServices.getPostsFullTextSearch({
            searchTerm,
            userId,
            lastOffset,
            pageSize
        })
        return response
    },
    GetUserPosts: async (parent: any,
        { input }: { input: ExcludeContextType<GetPostRepostInput> },
        context: UserContext) => {
        const userId = context.userId
        const { post_type, lastOffset, pageSize } = input
        const response = await postServices.getUserPosts({
            userId,
            lastOffset,
            pageSize,
            post_type
        })
        return response
    },
    GetLikedPosts: async (parent: any,
        { input }: { input: ExcludeContextType<GetPostsInput> },
        context: UserContext) => {
        const userId = context.userId
        const { lastOffset, pageSize } = input
        const response = await postServices.getLikedPosts({
            userId,
            lastOffset,
            pageSize
        })
        return response
    },
    GetRepliedPosts: async (parent: any,
        { input }: { input: ExcludeContextType<GetPostsInput> },
        context: UserContext) => {
        const userId = context.userId
        const { lastOffset, pageSize } = input
        const response = await postServices.getRepliedPosts({
            userId,
            lastOffset,
            pageSize
        })
        return response
    }
}
export default QuaryResolver