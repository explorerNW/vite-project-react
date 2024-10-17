import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./redux/counter-slice";
import userLogin from "./redux/user-login";
const store = configureStore({
    reducer: {
        counter: counterReducer,
        login: userLogin
    }
});
export default store;