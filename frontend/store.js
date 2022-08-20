import thunkMiddleware from "redux-thunk";
import { createWrapper } from "next-redux-wrapper";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

import user from "./features/user/userSlice";

let store;

const combineReducer = combineReducers({
	user
});

const configStore = () => configureStore({
	reducer: combineReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunkMiddleware),
	devTools: process.env.NODE_ENV !== "production"
});

export const makeStore = () => {
	store = configStore();
	return store;
};

export const wrapper = createWrapper(makeStore);

export function getStore() {
	return store;
}
