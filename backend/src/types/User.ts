export interface UserDocument extends Document {
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