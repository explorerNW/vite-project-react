import Radio, { RadioChangeEvent } from 'antd/es/radio';
import { forwardRef, memo, useImperativeHandle, useState } from 'react';

import './user-update-form.scss';
import { isEmail } from '../utils';
import { createUser, deleteUser, updateUser } from './user-apis';
import { TCreateUser, TUpdateUser } from '../data.type';
import notification from 'antd/es/notification';
import { useRequest } from 'ahooks';

const UserUpdate = memo(
  forwardRef(function UserUpdate(
    {
      user,
      isCreate,
      isDelete,
    }: {
      user?: TCreateUser | TUpdateUser;
      isCreate: boolean;
      isDelete?: boolean;
    },
    ref
  ) {
    const [firstName, setFirstName] = useState<string>(user?.firstName || '');
    const [lastName, setLastName] = useState<string>(user?.lastName || '');
    const [age, setAge] = useState<number | ''>(user?.age || '');
    const [sex, setSex] = useState<'male' | 'female'>(
      (user as TCreateUser)?.sex || 'male'
    );
    const [email, setEmail] = useState((user as TCreateUser)?.email || '');
    const [emailError, setEmailError] = useState('');
    const [salary, setSalary] = useState(user?.salary || '¥1000000');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const { runAsync: updateUserApi, loading: loadingUpdate } = useRequest(
      updateUser,
      {
        manual: true,
        debounceWait: 200,
      }
    );
    const { runAsync: createUserApi, loading: loadingCreate } = useRequest(
      createUser,
      {
        manual: true,
        debounceWait: 200,
      }
    );

    const { runAsync: deleteUserApi, loading: loadingDeleteUser } = useRequest(
      deleteUser,
      { manual: true }
    );
    const deleteUserHandler = async () => {
      const res = await deleteUserApi({ id: (user as TUpdateUser)?.id }).catch(
        e => {
          notificationApi.info({
            message: '服务器-api异常',
            description: e,
          });
          return false;
        }
      );
      return res;
    };
    useImperativeHandle(ref, () => {
      return {
        deleteUserHandler: () => {
          return deleteUserHandler();
        },
      };
    });

    const [notificationApi, contextHolder] = notification.useNotification();
    useImperativeHandle(ref, () => {
      return {
        updateUserHandler: () => {
          if (isCreate) {
            return createUserHandler();
          } else {
            return updateUserHandler();
          }
        },
        loading: loadingCreate || loadingUpdate || loadingDeleteUser,
      };
    });

    if (isDelete) {
      return <span>确定删除此用户?</span>;
    }

    const updateUserHandler = async () => {
      if (!isCreate) {
        const payload: TUpdateUser = {
          id: (user as TUpdateUser)?.id,
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
        return res.data.success;
      }
    };

    const createUserHandler = async () => {
      const payload: TCreateUser = {
        firstName,
        lastName,
        sex,
        age: Number(age),
        email,
        salary,
        password,
      };
      const res = await createUserApi(payload).catch(e => {
        notificationApi.info({
          message: '服务器-api异常',
          description: e,
        });
        return { data: { success: false, message: e } };
      });

      if (res.data.message?.user_exist) {
        setEmailError('此邮箱已经注册!');
      } else {
        setEmailError('');
      }

      return res.data.success;
    };

    const sexOptions = [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'Female' },
    ];

    return (
      <>
        <div>
          <div className='flex flex-col gap-4 m-auto p-2 rounded-sm'>
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
                disabled={!isCreate}
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
