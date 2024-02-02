import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { SearchUser } from "../../types/User";
import { SearchUserAction } from "../actions/SearchActions";
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