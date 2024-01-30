import followService from "../../services/follow.service";
import { FollowActionInput } from "../../types/Follow";
import { ExcludeContextType } from "../../types/Global";
import { UserContext } from "../../utilities/Context";
const MutationResolver = {
  FollowUser: async (parent: any, { input }: { input: ExcludeContextType<FollowActionInput> }, context: UserContext) => {
    const userId = context.userId
    const { followingId } = input
    const successResponse = await followService.followUser({
      followingId,
      userId
    })
    return successResponse
  },
  UnFollowUser: async (parent: any, { input }: { input: ExcludeContextType<FollowActionInput> }, context: UserContext) => {
    const userId = context.userId
    const { followingId } = input
    const successResponse = await followService.unFollowUser({
      followingId,
      userId
    })
    return successResponse
  },
}

export default MutationResolver