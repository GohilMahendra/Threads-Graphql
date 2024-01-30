import { User, UserResponse } from "../../types/User";

export interface SignInInput {
  input: {
    email: string,
    password: string
  }
}

export interface SignInResponse {
  SignIn: UserResponse
}

export interface GetUserFollowingInput {
  followingId: string
}

export interface GetUserFollowingResponse {
  GetCurrentUserFollowing: User[]
}





