import followService from "../../services/follow.service"
import { CurrentUserFollowingsInput, GetFollowingsInput } from "../../types/Follow"
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
  GetCurrentUserFollowing: async (parent: any, { input }: { input?: ExcludeContextType<CurrentUserFollowingsInput> }, context: UserContext) => {
    const userId = context.userId
    const response = await followService.getCurrentUserFollowing({
      userId,
      ...(input &&
      {
        lastOffset: input.lastOffset,
        pageSize: input.pageSize
      }
      ),
    })
    return response
  }
}
export default QueryResolver