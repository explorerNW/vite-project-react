import { json, Navigate, Outlet, useLoaderData, useLocation, useNavigate, useSubmit } from 'react-router-dom';
import './home.scss';
import { useDispatch } from 'react-redux';
import { currentUser, login, logout } from '../../redux/user-login';
import { getCurrentUser } from '../login/login.api';
import { User } from '../data';
import { cleanStorage } from '../login/login';
import { useState } from 'react';
import ConfirmModal from '../modal/confirm-modal';

export const loader = async () => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
        const user = await getCurrentUser(userId);
        return json({ user });
    }

    return json({ userLogout: true });
}

const navList = ['/home'];
const homeNavList = ['upload-file', 'device-control'];

export default function Home() {
    const navigate = useNavigate();
    const loaderData = useLoaderData() as { user: User, userLogout: boolean };
    const dispatch = useDispatch();
    const submit = useSubmit();
    const location = useLocation();
    const [activeRout, setActiveRoute] = useState(location?.state?.activePath);
    const [showLogout, setShowLogout] = useState(false);

    if (loaderData?.user) {
        dispatch(login());
        dispatch(currentUser(loaderData?.user));
    }

    const logoutHandler = () => {
        setShowLogout(true);
        cleanStorage();
        dispatch(logout());
        submit({ email: loaderData.user.email, logout: true }, { method: "POST", action: "/login" });
    }

    if (loaderData?.userLogout) {
        return <Navigate to={"/login"} />
    }

    return (
        <>
            <div className="flex flex-col flex-l-1 w-full h-full bg-white home">
                <div className='h-[2rem] leading-8 header bg-[var(--background-color-theme)]'>
                    <div className="flex items-center justify-between pr-4 text-white">
                        <ul className="flex gap-4 ml-[8rem]">
                            {
                                navList.map((path, index) => {
                                    return (
                                        <li className="cursor-pointer hover:text-[#eab308]" onClick={() => { setActiveRoute(path); navigate(path, { state: { activePath: path } }) }} key={index}>{path.toString().replace('/', '').trim()}</li>
                                    );
                                })
                            }
                        </ul>
                        <span className="cursor-pointer hover:text-[#eab308]" onClick={() => setShowLogout(true)}>logout</span>
                        <ConfirmModal title="登出" isModalOpen={showLogout} handleOk={logoutHandler} handleCancel={() => setShowLogout(false)} >
                            退出登录?
                        </ConfirmModal>
                    </div>
                </div>
                <div className='flex-l-1 relative p-4'>
                    <div>
                        <ul className="flex gap-4 text-black">
                            {
                                homeNavList.map((path, index) => {
                                    return (
                                        <li className={(path === activeRout) ? 'cursor-pointer active' : 'cursor-pointer'} onClick={() => { setActiveRoute(path); navigate(path, { state: { activePath: path } }); }} key={index}>{path.toString().replace('/', '').trim()}</li>
                                    );
                                })
                            }
                        </ul>
                    </div>
                    <Outlet />
                </div>
                <div className='h-[2rem] leading-8 bg-[var(--background-color-theme)]'></div>
            </div>
        </>
    );
}