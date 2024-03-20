import { createSlice } from '@reduxjs/toolkit'
import { api } from "../services/api";

const initialState = {
    user: null,
    token: null,
    isAuth: false,
    lang: 'en',
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        changeLang: (state, { payload }) => {
            state.lang = payload
        },
        removeAuth: (state) => {
            state.token = null
            state.user = null
            state.isAuth = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                api.endpoints.login.matchFulfilled, (state, { payload }) => {
                    // payload?.access_token
                    state.token = payload?.access_token
                    state.isAuth = true
                }
            )
            .addMatcher(
                api.endpoints.getUserInfo.matchFulfilled, (state, { payload }) => {
                    console.log('user', payload)
                    state.user = payload?.data[0]
                }
            )
    },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, addToCart, changeLang, removeAuth } = authSlice.actions

export default authSlice.reducer