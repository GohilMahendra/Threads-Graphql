export interface UserDocument extends Document {
  _id: string,
  username: string;
  fullname: string;
  email: string;
  bio?: string;
  password: string;
  followers: number;
  following: number;
  profile_picture?: string;
  verified: boolean;
  token?: string;
  otp?: string;
  isFollowed: boolean
}

export type UserResponseDocument = Omit<UserDocument, "token" | "otp" | "password">

export interface SignInInput {
  email: string,
  password: string
}

export interface SignUpInput {
  username: string,
  fullname: string,
  email: string,
  password: string
}
export interface UpdateUserInput {
  userId: string
  fullName?: string,
  bio?: string,
  profile_picture?: any
}

export interface GetUserInput {
  userId: string,
  profileId: string
}

export interface VerifyEmailInput {
  email: string,
  otp: string
}
export interface SearchUsersInput {
  userId: string,
  query: string
}