import followService from "../../services/follow.service"
import userServices from "../../services/user.services"
import { CurrentUserFollowings, GetFollowingsInput } from "../../types/Follow"
import { ExcludeContextType } from "../../types/Global"
import { UserContext } from "../../utilities/Context"

const QueryResolver = {
  GetUserFollowings: async (parent: any, {
    followingId,
    lastOffset,
    pageSize
  }: ExcludeContextType<GetFollowingsInput>, context: UserContext) => {
    const userId = context.userId
    const response = await followService.getUserFollowings({
      followingId,
      lastOffset,
      pageSize
    })
    return response
  },
  GetCurrentUserFollowing: async (parent: any, {
    lastOffset,
    pageSize
  }: ExcludeContextType<CurrentUserFollowings>, context: UserContext) => {
    const userId = context.userId
    const response = await followService.getCurrentUserFollowing({
      userId,
      lastOffset,
      pageSize
    })
    return response
  }
}
export default QueryResolver