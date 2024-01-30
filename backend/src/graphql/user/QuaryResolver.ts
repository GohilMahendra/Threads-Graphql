import userServices from "../../services/user.services"
import { ExcludeContextType } from "../../types/Global"
import { GetUserInput, SearchUsersInput, UserResponseDocument, VerifyEmailInput } from "../../types/User"
import { UserContext } from "../../utilities/Context"

const QueryResolver = {
  GetUserById: async (parent: any, { input }: { input: ExcludeContextType<GetUserInput> }, context: UserContext) => {
    const userId = context.userId
    const { profileId } = input
    const userResponse = await userServices.getUserById({
      profileId,
      userId
    })
    return userResponse
  },
  SearchUsers: async (parent: any, { input }: { input: ExcludeContextType<SearchUsersInput> }, context: UserContext) => {
    const userId = context.userId
    const { query } = input
    const response = await userServices.searchUsers({
      query,
      userId
    })
    return response
  }
}
export default QueryResolver