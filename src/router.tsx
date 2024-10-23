import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorPage from "./features/error-page/error-page";
import { loader as homeLoader } from "./features/home/home";
import { loader as loginLoader, action as loginAction } from './features/login/login';
import { loader as deviceControlLoader, action as deviceControlAction } from './features/device-control/device-control';
import { loader as uploadFileLoader } from './features/upload-file/upload-file';
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./features/home/home"));
const UploadFile = lazy(() => import("./features/upload-file/upload-file"));
const DeviceControl = lazy(() => import("./features/device-control/device-control"));
const SessionTimeout = lazy(() => import("./features/error-page/session-timeout"));

const router = createBrowserRouter([
    {
        path: '',
        element: <App />,
        loader: loginLoader,
        errorElement: <ErrorPage />
    },
    {
        path: 'login',
        element: <App />,
        loader: loginLoader,
        action: loginAction,
        errorElement: <ErrorPage />
    },
    {
        path: 'home',
        element: <Suspense fallback="加载中..." ><Home /></Suspense>,
        loader: homeLoader,
        children: [
            {
                path: 'upload-file',
                loader: uploadFileLoader,
                element: <Suspense fallback="加载中..." ><UploadFile /></Suspense>,
                errorElement: <ErrorPage />,
            },
            {
                path: 'device-control',
                loader: deviceControlLoader,
                action: deviceControlAction,
                element: <Suspense fallback="加载中..." ><DeviceControl /></Suspense>,
                errorElement: <ErrorPage />,
            }
        ]
    },
    {
        path: 'session-timeout',
        element: <Suspense fallback="加载中.."><SessionTimeout /></Suspense>
    }
]);

export default router;