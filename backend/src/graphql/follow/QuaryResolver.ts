import followService from "../../services/follow.service"
import { CurrentUserFollowings, GetFollowingsInput } from "../../types/Follow"
import { ExcludeContextType } from "../../types/Global"
import { UserContext } from "../../utilities/Context"

const QueryResolver = {
  GetUserFollowings: async (parent: any, { input }: { input: ExcludeContextType<GetFollowingsInput> }, context: UserContext) => {
    const userId = context.userId
    const { followingId, lastOffset, pageSize } = input
    const response = await followService.getUserFollowings({
      followingId,
      lastOffset,
      pageSize
    })
    return response
  },
  GetCurrentUserFollowing: async (parent: any, { input }: { input: ExcludeContextType<CurrentUserFollowings> }, context: UserContext) => {
    const userId = context.userId
    const { lastOffset, pageSize } = input
    const response = await followService.getCurrentUserFollowing({
      userId,
      lastOffset,
      pageSize
    })
    return response
  }
}
export default QueryResolver