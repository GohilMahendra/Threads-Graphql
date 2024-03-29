import UserServices from "../../services/user.services";
import { SignUpInput, UpdateUserInput, VerifyEmailInput } from "../../types/User";
import { UserContext } from "../../utilities/Context";

const MutationResolver = {
  SignIn: async (parent: any, { input }: { input: { email: string; password: string } }) => {
    const user = await UserServices.signIn(input);
    return user;
  },
  SignUp: async (parent: any, { input }: { input: SignUpInput }) => {
    const { email, fullname, password, username } = input
    const success = await UserServices.signUp({
      email,
      fullname,
      password,
      username
    })
    return success
  },
  UpdateUser: async (parent: any, { input }: { input: UpdateUserInput }, context: UserContext) => {
    const userId = context.userId
    const updatedUser = await UserServices.updateUser({
      userId: userId,
      bio: input.bio,
      fullName: input.fullName,
      profile_picture: input.profile_picture
    })
    return updatedUser
  },
  VerifyEmail: async (parent: any, { input }: { input: VerifyEmailInput }, context: UserContext) => {
    const userId = context.userId
    const { email, otp } = input
    const successResponse = await UserServices.verifyEmail({
      email,
      otp
    })
    return successResponse
  }
}

export default MutationResolver