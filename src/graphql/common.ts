export interface GraphQlInputType<T>
{
    input: T
}

export type SuccessResponse<T extends string> = {
    [key in T]: {
      message: string;
    };
};

export interface PaginationMeta 
{
    pageSize:number,
    lastOffset: string | null
}

export interface PaginatedResponse<T>
{
    data:T[],
    meta:PaginationMeta
}