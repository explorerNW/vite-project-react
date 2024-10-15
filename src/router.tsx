import { createBrowserRouter } from "react-router-dom";
import App, { loader as appLoader } from "./App";
import ErrorPage from "./error-page";
import { loader as homeLoader } from "./features/home/home";
import { action as loginAction } from './features/login/login';
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./features/home/home"));
const UploadFile = lazy(() => import("./features/upload-file/upload-file"));
const DeviceControl = lazy(() => import("./features/device-control/device-control"));

const router = createBrowserRouter([
    {
        path: '',
        element: <App />,
        loader: appLoader,
        errorElement: <ErrorPage />
    },
    {
        path: 'login',
        element: <App />,
        action: loginAction
    },
    {
        path: 'home',
        element: <Suspense fallback="加载中..." ><Home /></Suspense>,
        loader: homeLoader,
        children: [
            {
                path: 'upload-file',
                element: <Suspense fallback="加载中..." ><UploadFile /></Suspense>,
            },
            {
                path: 'device-control',
                element: <Suspense fallback="加载中..." ><DeviceControl /></Suspense>,
            }
        ]
    }
]);

export default router;