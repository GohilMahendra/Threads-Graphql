import { useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./slices/UserSlice";
import FeedReducer from "./slices/FeedSlice";
const store = configureStore({
    reducer:{
        User: UserReducer,
        Feed: FeedReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch : () => AppDispatch = useDispatch
export default store