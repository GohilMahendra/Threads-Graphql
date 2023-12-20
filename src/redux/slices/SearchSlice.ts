import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { SearchUser, SignUpArgsType, UpdateArgsType, User, UserResponse } from "../../types/User";
import { loginUser, signUpUser, updateUser } from "../../apis/UserAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { searchUsers } from "../../apis/SearchAPI";
type SearchType = 
{
    users: SearchUser[],
    loading: boolean,
    error: null | string,
}


const initialState: SearchType = 
{
    users:[],
    loading:false,
    error: null,

}

export const SearchUserAction = createAsyncThunk(
    "search/SearchUserAction",
    async({name}:{name:string},{rejectWithValue})=>{
        try
        {
            const response = await searchUsers(name)
            const users:SearchUser[] = response.data
            return users
        }
        catch(err)
        {
            return rejectWithValue(JSON.stringify(err))
        }
})

export const SearchSlice = createSlice({
    name:"Search",
    initialState: initialState,
    reducers:{
       
    },
    extraReducers(builder){
        builder.addCase(SearchUserAction.pending,state=>{
            state.loading = true,
            state.error = null
            state.users = []
        })
        builder.addCase(SearchUserAction.fulfilled,(state,action:PayloadAction<SearchUser[]>)=>{
            state.loading = false,
            state.users = action.payload
        })
        builder.addCase(SearchUserAction.rejected,(state,action)=>{
            state.loading = false,
            state.error = action.payload as string
        })

       
    }
})
export default SearchSlice.reducer