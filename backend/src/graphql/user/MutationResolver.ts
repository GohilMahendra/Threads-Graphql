import { User } from "../../models";
import UserServices from "../../services/user.services";
import { ExcludeContextType } from "../../types/Global";
import { GetUserInput, SignUpInput, UpdateUserInput, VerifyEmailInput } from "../../types/User";

const MutationResolver = {
  SignIn: async (parent: any, { input }: { input: { email: string; password: string } }) => {
    const user = await UserServices.signIn(input);
    return user;
  },
  SignUp: async (parent: any, { email, fullname, password, username }: SignUpInput) => {
    const success = await UserServices.signUp({
      email,
      fullname,
      password,
      username
    })
    return success
  },
  UpdateUser: async (parent: any, { input }: { input: UpdateUserInput }, context: any) => {
    const userId = context.userId
    const updatedUser = await UserServices.updateUser({
      userId: userId,
      bio: input.bio,
      fullName: input.fullName,
      profile_picture: input.profile_picture
    })
    return updatedUser
  },
  VerifyEmail: async (parent: any, { email, otp }: VerifyEmailInput, context: any) => {
    const userId = context.userId
    const successResponse = await UserServices.verifyEmail({
      email,
      otp
    })
    return successResponse
  }
}

export default MutationResolver