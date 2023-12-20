import { useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./slices/UserSlice";
import FeedReducer from "./slices/FeedSlice";
import  SearchReducer  from "./slices/SearchSlice";
import  ReplyReducer  from "./slices/ReplySlice";
const store = configureStore({
    reducer:{
        User: UserReducer,
        Feed: FeedReducer,
        Search: SearchReducer,
        Reply: ReplyReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch : () => AppDispatch = useDispatch
export default store