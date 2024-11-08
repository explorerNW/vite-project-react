import { createSlice } from '@reduxjs/toolkit';

export const userLogin = createSlice({
    name: 'userLogin',
    initialState: {
        userLogin: false,
        currentUser: {},
        sessionTimeout: false,
    },
    reducers: {
        login: state => {
            state.userLogin = true;
        },
        logout: state => {
            state.userLogin = false;
        },
        currentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        sessionTimeout: (state, action) => {
            state.sessionTimeout = action.payload;
        },
    },
});

export const { login, logout, currentUser, sessionTimeout } = userLogin.actions;

export default userLogin.reducer;
