import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { sessionTimeout } from '../../redux/user-login';

import './sesson-timeout.scss';

export default function SessionTimeout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <div className='flex flex-col flex-l-1 w-full h-full gap-4'>
        <div className='h-[2rem] leading-8 header'></div>
        <div className='flex-l-1 relative'>
          <div className='flex flex-col border session-timeout-container gap-4 p-4'>
            <div className='title'>
              <span>session 过期</span>
            </div>
            <div className='text-center'>请重新登录</div>
            <div className='text-right'>
              <Button
                type='primary'
                onClick={() => {
                  dispatch(sessionTimeout(true));
                  navigate('/login');
                }}
              >
                确定
              </Button>
            </div>
          </div>
        </div>
        <div className='h-[2rem] leading-8'></div>
      </div>
    </>
  );
}
