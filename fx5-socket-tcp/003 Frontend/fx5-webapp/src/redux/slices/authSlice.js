import { createSlice } from "@reduxjs/toolkit";
import { loadUserFromCookie, login } from "../../services/authService";
import * as status from "../constants/status";
import Cookies from "js-cookie";

const authSlice = createSlice({
    name: "auth", // to distinguih slices from each other
    initialState: {
        status: "idle",
        data: null,
        erroer: null,
    },
    reducers: {
        logout: (state) => {
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            state.data = null; //remove data
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(login.pending, (state, action) => {
            state.status = status.PENDING;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.status = status.SUCCESSFULLY;
            state.data = action.payload;
        })
        .addCase(login.rejected, (state, action) => {
            state.status = status.FAILED;
            state.erroer = action.error.message;
        })

        .addCase(loadUserFromCookie.fulfilled, (state, action) => {
            state.data = action.payload;
        })
    },
})

export const { logout } = authSlice.actions; 
export default authSlice.reducer;