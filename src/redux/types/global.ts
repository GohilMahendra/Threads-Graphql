export type FetchPostsPayload<T> = {
    data: T[],
    lastOffset: string | null
}