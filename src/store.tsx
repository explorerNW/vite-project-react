import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./redux/counter-slice";
import userLogin from "./redux/user-login";
// import logger from 'redux-logger';
import activeRoute from "./redux/active-route";

const store = configureStore({
    reducer: {
        counter: counterReducer,
        login: userLogin,
        activeRoute: activeRoute
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
export default store;