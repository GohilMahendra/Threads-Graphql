export interface FollowActionInput {
    userId: string,
    followingId: string
}

export interface GetFollowingsInput {
    followingId: string,
    pageSize?: number,
    lastOffset?: string
}

export interface CurrentUserFollowings {
    userId: string,
    pageSize?: number,
    lastOffset?: string,
}