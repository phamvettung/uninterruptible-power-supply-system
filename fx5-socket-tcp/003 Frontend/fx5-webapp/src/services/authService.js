import { createAsyncThunk } from "@reduxjs/toolkit";
import { POST, GET } from '../constants/httpMethod';
import BASE_URL from "../api";
import Cookies from "js-cookie";

/**
 * Call Register API
 * @param {*} user User for register
 * @returns data of response
 * @author PVT (2025-10-16)
 */
export const register = (user) => {
    const response = BASE_URL[POST]("/auth/register", user);
    return response.data;
}

/**
 * Call Login API
 * @param {*} user User for login
 * @returns Return data of response
 * @author PVT (2025-10-16)
 */
export const login = createAsyncThunk("/auth/login", async (user, { rejectWithValue }) => {
    try{
        const response = await BASE_URL[POST]("/auth/login", user);
        
        // Store both tokens in cookie
        Cookies.set("access_token", JSON.stringify(response.data.data.accessToken));
        Cookies.set("refresh_token", JSON.stringify(response.data.data.refreshToken));

        return response.data;

    } catch (error){

        if (error.response) {
            return rejectWithValue(error.response.data)
        }
        return rejectWithValue( {
            code: 99,
            msg: error.message,
            data: null
        });
        
    }
})

/**
 * Decode the token after login
 * @param {*} token token to decode
 * @returns Return details info of user
 * @author PVT (2025-10-16)
 */
export const verifyToken = async (token) => {

    const response = await BASE_URL[GET]("/user/info", {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data
}

/**
 * Get data from cookie and store token redux
 * @author PVT (2025-10-16)
 */
export const loadUserFromCookie = createAsyncThunk("auth/loadUserFromCookie", async (token) => {
    return token;
});