import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import user from "./features/user/userSlice";

const combineReducer = combineReducers({
	user
});

const makeStore = () => configureStore({
	reducer: combineReducer,
	devTools: true,
});

export const wrapper = createWrapper(makeStore);