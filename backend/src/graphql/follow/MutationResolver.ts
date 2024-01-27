import followService from "../../services/follow.service";
import UserServices from "../../services/user.services";
import { FollowActionInput } from "../../types/Follow";
import { ExcludeContextType } from "../../types/Global";
import { UserContext } from "../../utilities/Context";
const MutationResolver = {
  FollowUser: async (parent: any, { followingId }: ExcludeContextType<FollowActionInput>, context: UserContext) => {
    const userId = context.userId
    const successResponse = await followService.followUser({
      followingId,
      userId
    })
    return successResponse
  },
  UnFollowUser: async (parent: any, { followingId }: ExcludeContextType<FollowActionInput>, context: UserContext) => {
    const userId = context.userId
    const successResponse = await followService.unFollowUser({
      followingId,
      userId
    })
    return successResponse
  },
}

export default MutationResolver