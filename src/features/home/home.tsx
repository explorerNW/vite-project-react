import {
  Navigate,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useSubmit,
} from 'react-router-dom';
import './home.scss';
import { useDispatch } from 'react-redux';
import { currentUser, login, logout } from '../../redux/user-login';
import { User } from '../data.type';
import { cleanStorage } from '../login/login';
import { useState } from 'react';
import ConfirmModal from '../modal/confirm-modal';
import { homePageLoader } from '../../loader';

export const loader = homePageLoader;

const navList = ['/home'];
const homeNavList = ['upload-file', 'device-control', 'user-list', 'temp'];

export default function Home() {
  const navigate = useNavigate();
  const loaderData = useLoaderData() as { user: User; userLogout: boolean };
  const dispatch = useDispatch();
  const submit = useSubmit();
  const location = useLocation();
  const [activeRout, setActiveRoute] = useState(location?.state?.activePath);
  const [modal, setModal] = useState({
    title: '',
    open: false,
    content: <></>,
    handleOk: () => {},
    handleCancel: () => {},
  });

  const handleCancel = () => {
    setModal(modal => {
      return { ...modal, open: false };
    });
  };

  if (loaderData?.user) {
    dispatch(login());
    dispatch(currentUser(loaderData?.user));
  }

  const logoutHandler = () => {
    cleanStorage();
    dispatch(logout());
    submit(
      { email: loaderData.user.email, logout: true },
      { method: 'POST', action: '/login' }
    );
  };

  if (loaderData?.userLogout) {
    return <Navigate to={'/login'} />;
  }

  return (
    <>
      <ConfirmModal
        title={modal.title}
        isModalOpen={modal.open}
        handleOk={modal.handleOk}
        handleCancel={modal.handleCancel}
      >
        {modal.content}
      </ConfirmModal>
      <div className='flex flex-col flex-l-1 w-full h-full bg-white home'>
        <div className='h-[2rem] leading-8 header bg-[var(--background-color-theme)]'>
          <div className='flex items-center justify-between pr-4 text-white'>
            <ul className='flex gap-4 ml-[8rem]'>
              {navList.map((path, index) => {
                return (
                  <li
                    className='cursor-pointer hover:text-[#eab308]'
                    onClick={() => {}}
                    key={index}
                  >
                    {path.toString().replace('/', '').trim()}
                  </li>
                );
              })}
            </ul>
            <span
              className='cursor-pointer hover:text-[#eab308]'
              onClick={() => {
                setModal(modal => {
                  return {
                    ...modal,
                    title: '登出',
                    open: true,
                    handleOk: () => {
                      logoutHandler();
                      handleCancel();
                    },
                    handleCancel: () => {
                      handleCancel();
                    },
                    content: <span>退出登录?</span>,
                  };
                });
              }}
            >
              logout
            </span>
          </div>
        </div>
        <div className='flex-l-1 relative p-4 flex flex-col gap-4'>
          <div>
            <ul className='flex gap-4 text-black'>
              {homeNavList.map((path, index) => {
                return (
                  <li
                    className={
                      'cursor-pointer' + (path === activeRout ? ' active' : '')
                    }
                    onClick={() => {
                      if (path === activeRout) {
                        return;
                      }
                      setActiveRoute(path);
                      handleCancel();
                      navigate(path, {
                        state: { activePath: path },
                      });
                      // setModal(modal => {
                      //   return {
                      //     ...modal,
                      //     title: 'Are you sure?',
                      //     content: <></>,
                      //     open: true,
                      //     handleOk: () => {
                      //       setActiveRoute(path);
                      //       handleCancel();
                      //       navigate(path, {
                      //         state: { activePath: path },
                      //       });
                      //     },
                      //     handleCancel: handleCancel,
                      //   };
                      // });
                    }}
                    key={index}
                  >
                    {path.toString().replace('/', '').trim()}
                  </li>
                );
              })}
            </ul>
          </div>
          <Outlet />
        </div>
        <div className='h-[2rem] leading-8 bg-[var(--background-color-theme)]'></div>
      </div>
    </>
  );
}
