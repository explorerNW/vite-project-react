import { createSlice } from "@reduxjs/toolkit";

export const userLogin = createSlice({
    name: 'userLogin',
    initialState: {
        value: false
    },
    reducers: {
        login: (state) => { 
            state.value = true 
        },
        logout: (state) => { state.value = false },
    }
});

export const { login, logout } = userLogin.actions;

export default userLogin.reducer;