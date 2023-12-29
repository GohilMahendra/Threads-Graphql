export type User = 
{
    _id: string,
    email: string,
    username: string,
    followers: number,
    following: number,
    fullname:string,
    bio?: string,
    verified: boolean,
    profile_picture?: string,
    isFollowed: boolean
}

export type SearchUser = Omit<User,"email" | "followers" | "following" | "bio">

export type UserResponse = User & 
{
    token: string
}

export type SignUpArgsType = 
{
    email: string,
    password: string,
    username: string,
    fullname: string,
}

type imageType = {
    type:string,
    name:string,
    uri:string
}
export type UpdateArgsType = 
{
    fullname?:string,
    profile_picture?: imageType,
    bio?:string
}

export type FollowingUserResponse = 
{
    _id: string,
    follower: string,
    following: User
}

