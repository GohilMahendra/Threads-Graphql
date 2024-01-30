import { FollowingUserResponse, UserResponse } from "../../types/User";
import { PaginatedResponse, SuccessResponse } from "../common";

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
export interface GetCurrentUserFolowingInput {
  lastOffset?: string,
  pageSize?: number
}

export interface FollowUnFollowInput {
  followingId: string
}

export type FollowSuccessResponse = SuccessResponse<"FollowUser">
export type UnFollowSuccessResponse = SuccessResponse<"UnFollowUser">
export interface GetCurrentUserFollowingResponse {
  GetCurrentUserFollowing: PaginatedResponse<FollowingUserResponse>
}





