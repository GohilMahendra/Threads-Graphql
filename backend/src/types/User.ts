export interface UserDocument extends Document {
   _id:string,
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