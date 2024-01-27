import userServices from "../../services/user.services"
import { ExcludeContextType } from "../../types/Global"
import { GetUserInput, SearchUsersInput, VerifyEmailInput } from "../../types/User"

const QueryResolver = {
  GetUserById: async (parent: any, { profileId }: ExcludeContextType<GetUserInput>, context: any) => {
    const userId = context.userId
    const userResponse = await userServices.getUserById({
      profileId,
      userId
    })
    return userResponse
  },
  SearchUsers: async (parent: any, { query }: SearchUsersInput, context: any) => {
    const userId = context.userId
    const response = await userServices.searchUsers({
      query,
      userId
    })
    return response
  }
}
export default QueryResolver