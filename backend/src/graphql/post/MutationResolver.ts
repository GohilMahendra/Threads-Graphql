import { createPost } from "../../services/post.services";
const MutationResolver = {
    CreatePost: async (parent: any, { input }: {
        input: {
          content: string,
          isRepost: boolean,
          postId: string,
          media: any[]
        }
      }, context: any) => {
        const userId = context.userId;
        const { content, isRepost, media, postId } = input
        const response = await createPost({
          isRepost: isRepost,
          userId: userId,
          content: content,
          postId: postId,
          media: media
        })
  
        return response
      }
}
export default MutationResolver