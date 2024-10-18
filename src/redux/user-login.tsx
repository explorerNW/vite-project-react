import { createSlice } from "@reduxjs/toolkit";

export const userLogin = createSlice({
    name: 'userLogin',
    initialState: {
        userLogin: false,
        currentUser: {}
    },
    reducers: {
        login: (state) => { 
            state.userLogin = true 
        },
        logout: (state) => { state.userLogin = false },
        currentUser: (state, action) => { state.currentUser = action.payload }
    }
});

export const { login, logout, currentUser } = userLogin.actions;

export default userLogin.reducer;