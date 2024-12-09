import SliderCaptcha from 'rc-slider-captcha';
import './login.scss';
import ImageBg from '@/assets/1bg@2x.7146d57f.jpg';
import ImagePuzzle from '@/assets/1puzzle@2x.png';
import { SetStateAction, useState } from 'react';
import {
  Form,
  Navigate,
  useActionData,
  useLoaderData,
  useSubmit,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/user-login';
import { User } from '../data.type';
import { isEmail, isPhone } from '../utils';

import iconCloudHomeSvg from '@/assets/icon-cloud-home.svg';
import Button from 'antd/es/button';

const verifyCaptcha = async (data: { x: number }) => {
  if (data?.x && data.x > 87 && data.x < 93) {
    return Promise.resolve(true);
  }
  return Promise.reject(false);
};

const loginCheck = (
  name: string,
  password: string,
  setShowSliderCaptcha: {
    (value: SetStateAction<boolean>): void;
    (arg0: boolean): void;
  }
) => {
  if (name && password) {
    setShowSliderCaptcha(true);
  }
};

export const cleanStorage = () => {
  localStorage.removeItem('user_id');
  localStorage.removeItem('token');
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSliderCaptcha, setShowSliderCaptcha] = useState(false);
  const submit = useSubmit();
  const res = useActionData() as {
    success: boolean;
    currentUser: User;
    error: { name: string; password: string; user_exist: string };
  };
  const [showError, setShowError] = useState(true);
  const [emailError, setEmailError] = useState('');
  const loaderData = useLoaderData() as { user: User; userLogout: boolean };

  const dispatch = useDispatch();

  if (res?.success || loaderData?.user?.id) {
    dispatch(login());
    return <Navigate to={'/home'}></Navigate>;
  }
  return (
    <>
      <Form>
        <div className='login bg-white flex flex-col w-3/5 rounded-[3px] gap-2 p-2 shadow-inner max-w-xs'>
          <div className='flex flex-row items-center gap-1'>
            <img src={iconCloudHomeSvg} width='48px' height='48px'></img>
            <span className='text-[#5e85c0] text-3xl'>欢迎登陆</span>
          </div>
          <div className='flex flex-col gap-4'>
            {/* 邮箱/电话号码 */}
            <div className='flex flex-col relative'>
              <div className='field flex gap-1 w-full'>
                <span
                  className='icon-[mdi--user] text-[2rem]'
                  style={{ color: '#bcbcbc' }}
                ></span>
                <input
                  className='w-full'
                  placeholder='请输入Email/手机号码'
                  name='email'
                  value={email}
                  onChange={event => {
                    setEmail(event.target.value);
                  }}
                  onBlur={event => {
                    if (
                      isEmail(event.target.value) ||
                      isPhone(event.target.value)
                    ) {
                      setEmailError('');
                    } else {
                      if (/^\d+$/.test(event.target.value)) {
                        setEmailError('电话号码错误, 请检查!');
                      } else {
                        setEmailError('邮箱格式错误, 请检查!');
                      }
                    }
                  }}
                />
              </div>
              {emailError ? (
                <span className='text-red-500 float-left w-full text-[.75rem] absolute bottom-[-1rem] pl-[.25rem]'>
                  {emailError}
                </span>
              ) : (
                <></>
              )}
              <span className='text-red-500 float-left w-full text-[.75rem] absolute bottom-[-1rem] pl-[.25rem]'>
                {showError && !emailError && res?.error?.user_exist}
              </span>
            </div>
            {/* 密码 */}
            <div className='flex flex-col relative'>
              <div className='field gap-1 w-full'>
                <span
                  className='icon-[mdi--password] text-[2rem]'
                  style={{ color: '#bcbcbc' }}
                ></span>
                <input
                  className='w-full'
                  type='password'
                  placeholder='请输入密码'
                  name='password'
                  value={password}
                  onChange={event => {
                    setPassword(event.target.value);
                    if (res?.error?.password || res?.error?.user_exist) {
                      setShowError(false);
                    }
                  }}
                />
              </div>
              <span className='text-red-500 float-left w-full text-[.75rem] absolute bottom-[-1rem] pl-[.25rem]'>
                {showError && res?.error?.password}
              </span>
            </div>
            {/* 短信验证码 */}
            <div className='flex relative'>
              <div className='field gap-1 w-full justify-end'>
                <input
                  className='w-full text-left pl-[.5rem]'
                  type='text'
                  placeholder='验证码'
                  name='code'
                />
                <Button
                  type='primary'
                  className='h-[2.5rem] rounded-r-[3px] rounded-l-[0px]'
                >
                  获取验证码
                </Button>
              </div>
            </div>
          </div>
          <div>
            <Button
              type='primary'
              className='float-end bg-[#5f85c1]'
              onClick={() => {
                loginCheck(email, password, setShowSliderCaptcha);
              }}
            >
              登录
            </Button>
          </div>
        </div>
      </Form>
      {showSliderCaptcha ? (
        <div
          className='slider-capt-cha'
          style={{ display: showSliderCaptcha ? 'block' : 'none' }}
        >
          <div className='back-drop'></div>
          <SliderCaptcha
            request={async () => {
              return {
                bgUrl: ImageBg,
                puzzleUrl: ImagePuzzle,
              };
            }}
            onVerify={async data => {
              const result = await verifyCaptcha(data);
              if (result) {
                setShowSliderCaptcha(false);
                submit(
                  { email, password },
                  { method: 'post', action: '/login' }
                );
                setPassword('');
                setShowError(true);
              }
              return result;
            }}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
