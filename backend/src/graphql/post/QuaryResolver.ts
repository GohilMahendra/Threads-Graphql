import postServices from "../../services/post.services"
import { ExcludeContextType } from "../../types/Global"
import { GetPostRepostInput } from "../../types/Post"

const QuaryResolver = {
    GetPosts: async (parent: any,
        {
            lastOffset,
            pageSize,
            post_type
        }: ExcludeContextType<GetPostRepostInput>,
        context: any) => {
        const userId = context.userId
        const response = await postServices.getPosts({
            userId,
            lastOffset,
            pageSize,
            post_type
        })
        return response
    }
}
export default QuaryResolver