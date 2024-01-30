import PostServices from "../../services/post.services";
import { ExcludeContextType } from "../../types/Global";
import { CommentActionInput, DeleteReplyInput, PostActionInput } from "../../types/Post";
import { UserContext } from "../../utilities/Context";
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
    const response = await PostServices.createPost({
      isRepost: isRepost,
      userId: userId,
      content: content,
      postId: postId,
      media: media
    })

    return response
  },
  LikePost: async (parent: any, { input }: { input: ExcludeContextType<PostActionInput> }, context: UserContext) => {
    const userId = context.userId
    const { postId } = input
    const response = await PostServices.likePost({
      postId,
      userId
    })
    console.log(response)
    return response
  },
  UnLikePost: async (parent: any, { input }: { input: ExcludeContextType<PostActionInput> }, context: UserContext) => {
    const userId = context.userId
    const { postId } = input
    const response = await PostServices.unLikePost({
      postId,
      userId
    })
    return response
  },
  CommentPost: async (parent: any, { input }: { input: ExcludeContextType<CommentActionInput> }, context: UserContext) => {
    const userId = context.userId
    const { content, postId } = input
    const response = await PostServices.commentPost({
      content,
      postId,
      userId
    })
    return response
  },
  DeletePost: async (parent: any, { input }: { input: ExcludeContextType<PostActionInput> }, context: UserContext) => {
    const userId = context.userId
    const { postId } = input
    const response = await PostServices.deletePost({
      postId,
      userId
    })
    return response
  },
  DeletePostReply: async (parent: any, { input }: { input: ExcludeContextType<DeleteReplyInput> }, context: UserContext) => {
    const userId = context.userId
    const { replyId } = input
    const response = await PostServices.deletePostReply({
      replyId,
      userId
    })
    return response
  }
}
export default MutationResolver