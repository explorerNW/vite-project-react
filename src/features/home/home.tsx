import { json, Navigate, Outlet, useLoaderData, useNavigate } from 'react-router-dom';
import './home.scss';
import { useDispatch } from 'react-redux';
import { currentUser, login, logout } from '../../redux/user-login';
import { getCurrentUser } from '../login/login.api';
import { User } from '../data';
import { cleanStorage } from '../login/login';

export const loader = async () => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
        const user = await getCurrentUser(userId);
        return json({ user });
    }

    return json({ userLogout: true });
}

const navList = ['/home'];
const homeNavList = ['upload-file', 'device-control',];

export default function Home() {
    const navigate = useNavigate();
    const loaderData = useLoaderData() as { user: User, userLogout: boolean };
    const dispatch = useDispatch();

    if (loaderData?.user) {
        dispatch(login());
        dispatch(currentUser(loaderData?.user));
    }

    const logoutHandler = () => {
        cleanStorage();
        dispatch(logout());
        navigate("/login");
    }

    if (loaderData?.userLogout) {
        return <Navigate to={"/login"} />
    }
    return (
        <>
            <div className="flex flex-col flex-l-1 w-full h-full bg-white home">
                <div className='h-[2rem] leading-8 header bg-[#5e85c0]'>
                    <div className="flex items-center justify-between pr-4 text-white">
                        <ul className="flex gap-4 ml-[8rem]">
                            {
                                navList.map((path, index) => {
                                    return (
                                        <li className="cursor-pointer hover:text-[#eab308]" onClick={() => navigate(path)} key={index}>{path.toString().replace('/', '').trim()}</li>
                                    );
                                })
                            }
                        </ul>
                        <span className="cursor-pointer hover:text-[#eab308]" onClick={logoutHandler}>logout</span>
                    </div>
                </div>
                <div className='flex-l-1 relative p-4'>
                    <div>
                        <ul className="flex gap-4 text-black">
                            {
                                homeNavList.map((path, index) => {
                                    return (
                                        <li className="cursor-pointer hover:text-[#eab308]" onClick={() => navigate(path)} key={index}>{path.toString().replace('/', '').trim()}</li>
                                    );
                                })
                            }
                        </ul>
                    </div>
                    <Outlet />
                </div>
                <div className='h-[2rem] leading-8 bg-[#5e85c0]'></div>
            </div>
        </>
    );
}