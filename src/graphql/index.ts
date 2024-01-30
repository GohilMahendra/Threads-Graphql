import { ApolloClient,InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
    uri:'http://localhost:3000/graphql',
    cache: new InMemoryCache()
})

export interface GraphQlInputType<T>
{
    input: T
}

export type SuccessResponse<T extends string> = {
    [key in T]: {
      message: string;
    };
};
