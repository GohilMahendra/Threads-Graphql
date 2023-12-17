import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { SignUpArgsType, UpdateArgsType, User, UserResponse } from "../../types/User";
import { loginUser, signUpUser, updateUser } from "../../apis/UserAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
type UserStateType = 
{
    user: User,
    loading: boolean,
    error: null | string,
}

const initalUser:User = 
{
    email:"",
    followers:0,
    following:0,
    _id:"",
    bio:"",
    username:"",
    fullname:"",
    verified: false,
    profile_picture:"",
}
const initialState: UserStateType = 
{
    user:initalUser,
    loading:false,
    error: null,

}

export const SignInAction = createAsyncThunk(
    "user/SignInAction",
    async({email,password}:{email:string,password:string},{rejectWithValue})=>{
        try
        {
            const response = await loginUser(email,password)
            const userResponse = response.user as UserResponse
            await AsyncStorage.setItem("token",userResponse.token)
            await AsyncStorage.setItem("email",email)
            await AsyncStorage.setItem("password",password)
            const user:User = 
            {
                email: userResponse.email,
                followers: userResponse.followers,
                following: userResponse.following,
                _id: userResponse._id,
                username: userResponse.username,
                profile_picture: userResponse.profile_picture,
                fullname: userResponse.fullname,
                bio: userResponse.bio,
                verified: userResponse.verified
            }
            return user
        }
        catch(err)
        {
            return rejectWithValue(JSON.stringify(err))
        }
})
export const SignUpAction = createAsyncThunk(
    "user/SignUpAction",
    async(args:SignUpArgsType,{rejectWithValue})=>{
        try
        {
            const response = await signUpUser(args)
            return response.message
        }
        catch(err)
        {
            return rejectWithValue(JSON.stringify(err))
        }
})
export const UpdateAction = createAsyncThunk(
    "user/UpdateAction",
    async(args:UpdateArgsType,{rejectWithValue})=>{
        try
        {
            const response = await updateUser(args)
            return response.message
        }
        catch(err)
        {
            return rejectWithValue(JSON.stringify(err))
        }
})
export const UserSlice = createSlice({
    name:"User",
    initialState: initialState,
    reducers:{
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
          },
    },
    extraReducers(builder){
        builder.addCase(SignInAction.pending,state=>{
            state.loading = true,
            state.error = null
        })
        builder.addCase(SignInAction.fulfilled,(state,action:PayloadAction<User>)=>{
            state.loading = false,
            state.user = action.payload
        })
        builder.addCase(SignInAction.rejected,(state,action)=>{
            state.loading = false,
            state.error = action.payload as string
        })

        builder.addCase(SignUpAction.pending,state=>{
            state.loading = true,
            state.error = null
        })

        builder.addCase(SignUpAction.fulfilled,(state,action:PayloadAction<User>)=>{
            state.loading = false,
            state.user = action.payload
        })
        builder.addCase(SignUpAction.rejected,(state,action)=>{
            state.loading = false,
            state.error = action.payload as string
        })
    }
})
export const { setUser } = UserSlice.actions
export default UserSlice.reducer