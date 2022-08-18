import { createSlice } from "@reduxjs/toolkit";
import webConfig from "../../web.config";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        keywords: webConfig.keywords,
        user: null,
        accessToken: null
    },
    reducers: {
        setUser(state, action) {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        }
    }
});

const { actions, reducer } = userSlice;

export const { setUser } = actions;
export default reducer;