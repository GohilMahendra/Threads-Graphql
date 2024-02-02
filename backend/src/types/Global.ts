export type ExcludeContextType<T> = Omit<T, "userId">

export type PaginatedResponse<T> = {
    data: T[],
    meta: {
        pageSize: number,
        lastOffset: string | null
    }
}
