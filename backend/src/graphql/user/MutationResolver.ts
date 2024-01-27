import { signIn, updateUser } from "../../services/user.services";

const MutationResolver = {
    SignIn: async (parent: any, { input }: { input: { email: string; password: string } }) => {
        try {
          const user = await signIn(input);
          return user;
        } catch (error: any) {
          throw new Error(error?.message);
        }
      },
      UpdateUser: async (parent: any, { input }: {
        input:
        {
          bio?: string,
          fullName?: string,
          profile_picture?: any
        }
      }, context: any) => {
        try {
          const userId = context.userId
          const updatedUser = await updateUser({
            userId: userId,
            bio: input.bio,
            fullName: input.fullName,
            profile_picture: input.profile_picture
          })
          return updatedUser
        }
        catch (error: any) {
          console.log(error, "Error in the update")
          throw new Error(error?.message);
        }
      },
}

export default MutationResolver