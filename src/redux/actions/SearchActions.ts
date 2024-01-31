import { createAsyncThunk } from "@reduxjs/toolkit"
import { SearchUser } from "../../types/User"
import { client } from "../../graphql"
import { SEARCH_USERS } from "../../graphql/user/Query"
import { SearchUserInput, SearchUserResponse } from "../../graphql/user/Types"
import { GraphQlInputType } from "../../graphql/common"

export const SearchUserAction = createAsyncThunk(
    "search/SearchUserAction",
    async ({ name }: { name: string }, { rejectWithValue }) => {
        try {
            const response = await client.query<SearchUserResponse, GraphQlInputType<SearchUserInput>>({
                query: SEARCH_USERS,
                variables: {
                    input: { query: name }
                }
            })
            if (response.data) {
                const users: SearchUser[] = response.data.SearchUsers
                return users
            }
            else
                return rejectWithValue(JSON.stringify(response.errors))
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    })