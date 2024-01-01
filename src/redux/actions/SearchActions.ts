import { createAsyncThunk } from "@reduxjs/toolkit"
import { searchUsers } from "../../apis/SearchAPI"
import { SearchUser } from "../../types/User"

export const SearchUserAction = createAsyncThunk(
    "search/SearchUserAction",
    async ({ name }: { name: string }, { rejectWithValue }) => {
        try {
            const response = await searchUsers(name)
            const users: SearchUser[] = response.data
            return users
        }
        catch (err) {
            return rejectWithValue(JSON.stringify(err))
        }
    })