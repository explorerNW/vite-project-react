import Radio, { RadioChangeEvent } from 'antd/es/radio';
import { forwardRef, memo, useImperativeHandle, useState } from 'react';

import './user-update-form.scss';
import { isEmail } from '../utils';
import { updateUser } from './user-apis';
import { TUpdateUser, User } from '../data.type';
import notification from 'antd/es/notification';
import { useRequest } from 'ahooks';

const UserUpdate = memo(
  forwardRef(function UserUpdate(
    { user, isCreate }: { user: User; isCreate: boolean },
    ref
  ) {
    const [firstName, setFirstName] = useState<string>(user.firstName);
    const [lastName, setLastName] = useState<string>(user.lastName);
    const [age, setAge] = useState<number | ''>(user.age);
    const [sex, setSex] = useState<'male' | 'female'>(user.sex);
    const [email, setEmail] = useState(user.email);
    const [emailError, setEmailError] = useState('');
    const [salary, setSalary] = useState(user.salary);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [notificationApi, contextHolder] = notification.useNotification();
    const { runAsync: updateUserApi, loading } = useRequest(updateUser, {
      manual: true,
      debounceWait: 200,
    });
    useImperativeHandle(ref, () => {
      return {
        updateUserHandler: () => {
          return updateUserHandler();
        },
        loading,
      };
    });

    const updateUserHandler = async () => {
      const payload: TUpdateUser = {
        id: user.id,
        firstName,
        lastName,
        age: Number(age),
        salary,
      };
      const res = await updateUserApi(payload).catch(e => {
        notificationApi.info({
          message: '服务器-api异常',
          description: e,
        });
        return { data: { success: false, message: { user_exist: Boolean } } };
      });
      return new Promise(resolve => {
        resolve(res.data.success);
      });
    };

    const sexOptions = [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'Female' },
    ];

    return (
      <>
        <div>
          <div className='flex flex-col gap-4 border max-w-[20rem] m-auto p-2 mt-[3rem] mt-[1rem]'>
            <div className='flex gap-4'>
              <span className='w-[5rem]'>first name: </span>
              <input
                className='border'
                maxLength={20}
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </div>
            <div className='flex gap-4'>
              <span className='w-[5rem]'>last name: </span>
              <input
                className='border'
                maxLength={20}
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </div>
            <div className='flex gap-4'>
              <span className='w-[5rem]'>age: </span>
              <input
                className='border'
                value={age}
                maxLength={3}
                onChange={e => {
                  if (isNaN(Number(e.target.value)) || !e.target.value) {
                    e.preventDefault();
                    setAge('');
                  } else {
                    setAge(Number(e.target.value));
                  }
                }}
              />
            </div>
            <div className='flex gap-4 relative'>
              <span className='w-[5rem]'>email: </span>
              <input
                className='border disabled'
                value={email}
                disabled
                onChange={e => {
                  setEmail(e.target.value);
                }}
                onBlur={event => {
                  if (isEmail(event.target.value) || !event.target.value) {
                    setEmailError('');
                  } else {
                    setEmailError('邮箱格式错误, 请检查!');
                  }
                }}
              />
              {emailError ? (
                <span className='text-red-500 w-full text-[.75rem] absolute bottom-[-1rem] pl-[.25rem] left-[5.7rem]'>
                  {emailError}
                </span>
              ) : (
                <></>
              )}
            </div>
            <div className='flex gap-4'>
              <span className='w-[5rem]'>salary: </span>
              <input
                className='border'
                value={salary}
                onChange={e => {
                  if (isNaN(Number(e.target.value.slice(1)))) {
                    e.preventDefault();
                    return;
                  }
                  if (e.target.value.length < 2) {
                    setSalary('¥');
                  } else {
                    setSalary(value => {
                      if (value.slice(0, 1) === '¥') {
                        return e.target.value;
                      }

                      return '¥' + e.target.value;
                    });
                  }
                }}
              />
            </div>
            <div className='flex gap-4'>
              <span className='w-[5rem]'>sex: </span>
              <Radio.Group
                options={sexOptions}
                defaultValue={sex}
                onChange={(e: RadioChangeEvent) => {
                  setSex(e.target.value);
                }}
              />
            </div>
            {isCreate ? (
              <>
                <div className='flex gap-4'>
                  <span className='w-[5rem]'>password: </span>
                  <input
                    className='border'
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                <div className='flex gap-4 relative'>
                  <span className='w-[5rem]'>confirm password: </span>
                  <input
                    className='border'
                    type='password'
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    onBlur={() => {
                      if (password !== confirmPassword) {
                        setPasswordError('两次输入的密码不一致请检查!');
                      } else {
                        setPasswordError('');
                      }
                    }}
                  />
                  {passwordError ? (
                    <span className='text-red-500 w-full text-[.75rem] absolute bottom-[-1rem] pl-[.25rem] left-[5.7rem]'>
                      {passwordError}
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        {contextHolder}
      </>
    );
  })
);
export default UserUpdate;
