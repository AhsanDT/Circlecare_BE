import { createSlice } from '@reduxjs/toolkit'
import { api } from "../services/api";

const initialState = {
    chat: []
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        saveChat: (state, { payload }) => {
            state.chat = [...state.chat, payload]
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                api.endpoints.getAllMessage.matchFulfilled, (state, { payload }) => {
                    console.log('chatList', payload)
                    state.chat = payload
                }
            )
    },
})

// Action creators are generated for each case reducer function
export const { saveChat, } = chatSlice.actions

export default chatSlice.reducer