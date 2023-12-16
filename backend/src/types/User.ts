import { UserType } from "../models/User";
export type AuthUserResponse = UserType
export type UserResponse = Omit<UserType,"otp"|"token"|"password">