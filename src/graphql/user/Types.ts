import { FollowingUserResponse, User, UserResponse } from "../../types/User";
import { PaginatedResponse, SuccessResponse } from "../common";

export interface SignInInput {
    email: string,
    password: string
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

export interface UpdateUserInput {
  bio?: string,
  fullName?: string,
  profile_picture?: string
}

export interface UpdateUserSuccessResponse {
  UpdateUser: UserResponse
}

export interface VerifyEmailInput {
  otp: string,
  email: string
}

export interface SignUpInput {
  email: string,
  password: string,
  fullname: string,
  username: string
}

export interface SearchUserInput {
  query: string
}

export interface GetUserByIdInput {
  profileId: string
}

export interface GetCurrentUserFollowingResponse {
  GetCurrentUserFollowing: PaginatedResponse<FollowingUserResponse>
}
export interface SearchUserResponse {
  SearchUsers: User[]
}

export interface GetUserByIdResponse {
  GetUserById: User
}

export type FollowSuccessResponse = SuccessResponse<"FollowUser">
export type UnFollowSuccessResponse = SuccessResponse<"UnFollowUser">
export type VerifyEmailSuccessResponse = SuccessResponse<"VerifyEmail">
export type SignUpSuccessResponse = SuccessResponse<"SignUp">






