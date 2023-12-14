export type User = 
{
    _id: string,
    email: string,
    username: string,
    followers: number,
    following: number,
    profile_picture?: string,
}

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

