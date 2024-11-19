import Table, { TableProps } from 'antd/es/table';
import { User } from '../data.type';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { fetchUsersList, searchUser, SSE_URL } from './user-apis';
import Space from 'antd/es/space';
import { Button, notification, Pagination } from 'antd';
import ConfirmModal from '../modal/confirm-modal';
import UserUpdate from './user-update-form';
import { useMount, useRequest } from 'ahooks';
import Search from 'antd/es/input/Search';
import { SSE } from '../utils';
import socketIO from './socket.io';

export const loader = () => {
  return {};
};

interface ITableUser {
  full_name: string;
  age: number;
  income: string;
  email: string;
  sex: 'male' | 'female';
  user: User;
}

const UserList = memo(function UserList() {
  const {
    data,
    run: refresh,
    loading,
  } = useRequest(fetchUsersList, { manual: true });

  useMount(() => {
    refreshHandler();
  });
  const list = useMemo(() => {
    if (data?.data) {
      return { users: data?.data.users, totalLength: data?.data.totalLength };
    } else {
      return { users: [], totalLength: 0 };
    }
  }, [data]);
  const [modal, setModal] = useState({
    title: '',
    open: false,
    content: <></>,
    handleOk: () => {},
    handleCancel: () => {},
    confirmLoading: false,
  });
  const updateUserRef = useRef<{
    updateUserHandler: (start: number, end: number) => Promise<boolean>;
    deleteUserHandler: (start: number, end: number) => Promise<boolean>;
    loading: boolean;
  }>();
  const ref = useRef<{ pageIndex: number; pageSize: number; mounted: boolean }>(
    {
      pageIndex: 0,
      pageSize: 10,
      mounted: false,
    }
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const refreshHandler = () => {
    refresh(
      ref.current.pageIndex * ref.current.pageSize,
      (ref.current.pageIndex + 1) * ref.current.pageSize - 1
    );
  };

  useEffect(() => {
    if (!ref.current.mounted) {
      console.log(ref);
      const sse = new SSE(`${SSE_URL}/message`);
      sse.onMessage(e => {
        console.log(e);
        sse.sse.close();
      });
      socketIO.connect();
      socketIO.on('connect', () => {
        console.log('socker connect');
      });
      socketIO.on('to-client', function (data) {
        notificationApi.info({
          message: data.data,
          description: 'socket-message',
        });
      });
      socketIO.on('exception', function (data) {
        console.log('event', data);
      });
      socketIO.on('disconnect', function () {
        console.log('Disconnected');
      });
      ref.current.mounted = true;
    }
  }, []);

  const { runAsync: searchUserApi } = useRequest(searchUser, {
    manual: true,
    debounceWait: 200,
  });

  const columns: TableProps<ITableUser>['columns'] = [
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      width: 80,
      key: 'age',
    },
    {
      title: 'Sex',
      dataIndex: 'sex',
      key: 'sex',
      width: 80,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    {
      title: 'Income',
      dataIndex: 'income',
      key: 'income',
      width: 180,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => {
        return (
          <Space size='middle'>
            <Button
              onClick={e => {
                e.preventDefault();
                const start = ref.current.pageIndex * ref.current.pageSize;
                const end =
                  (ref.current.pageIndex + 1) * ref.current.pageSize - 1;
                setModal(modal => {
                  return {
                    ...modal,
                    title: 'Edit User',
                    open: true,
                    handleOk: () => {
                      setModal(modal => {
                        return { ...modal, confirmLoading: true };
                      });
                      updateUserRef.current
                        ?.updateUserHandler(start, end)
                        .then(update => {
                          if (update) {
                            refreshHandler();
                            updateUserRef.current!.loading = false;
                            setModal(modal => {
                              return {
                                ...modal,
                                open: false,
                                confirmLoading: false,
                              };
                            });
                          } else {
                            notificationApi.info({
                              message: '更新用户失败!',
                              description: '',
                            });
                            setModal(modal => {
                              return {
                                ...modal,
                                confirmLoading: false,
                              };
                            });
                          }
                        });
                    },
                    handleCancel: async () => {
                      setModal(modal => {
                        return {
                          ...modal,
                          open: false,
                        };
                      });
                    },
                    content: (
                      <>
                        <UserUpdate
                          user={record.user}
                          isCreate={false}
                          ref={updateUserRef}
                        />
                      </>
                    ),
                  };
                });
              }}
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                const start = ref.current.pageIndex * ref.current.pageSize;
                const end =
                  (ref.current.pageIndex + 1) * ref.current.pageSize - 1;
                setModal(modal => {
                  return {
                    ...modal,
                    title: 'Delete User',
                    open: true,
                    content: (
                      <>
                        <UserUpdate
                          isCreate={false}
                          user={record.user}
                          isDelete={true}
                          ref={updateUserRef}
                        />
                      </>
                    ),
                    handleOk: async () => {
                      setModal(modal => {
                        return {
                          ...modal,
                          confirmLoading: true,
                        };
                      });
                      updateUserRef.current
                        ?.deleteUserHandler(start, end)
                        .then(res => {
                          if (res) {
                            refreshHandler();
                            setModal(modal => {
                              return {
                                ...modal,
                                open: false,
                                confirmLoading: false,
                              };
                            });
                          } else {
                            notificationApi.info({
                              message: '服务器-api异常',
                              description: '',
                            });
                          }
                        });
                    },
                    handleCancel: () => {
                      setModal(modal => {
                        return {
                          ...modal,
                          open: false,
                        };
                      });
                    },
                  };
                });
              }}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  const formatList = useMemo(() => {
    return list.users.map((user, index) => {
      return {
        key: index,
        full_name: `${user.firstName} ${user.lastName}`,
        age: user.age,
        email: user.email,
        income: user.salary,
        sex: user.sex,
        user,
      };
    });
  }, [list]);

  return (
    <>
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between'>
          <div>
            <Search
              placeholder='input search text'
              allowClear
              onSearch={e => {
                searchUserApi(e).then(() => {});
              }}
              style={{ width: 200 }}
            />
            <Button
              onClick={() => {
                socketIO.emit('events');
              }}
            >
              receive server message
            </Button>
            <Button
              onClick={() => {
                socketIO.emit('stop-interval');
              }}
            >
              stop server interval
            </Button>
          </div>
          <Button
            onClick={() => {
              const start = ref.current.pageIndex * ref.current.pageSize;
              const end =
                (ref.current.pageIndex + 1) * ref.current.pageSize - 1;
              setModal(modal => {
                return {
                  ...modal,
                  open: true,
                  title: 'Create User',
                  handleOk: () => {
                    setModal(modal => {
                      return {
                        ...modal,
                        confirmLoading: true,
                      };
                    });
                    updateUserRef.current
                      ?.updateUserHandler(start, end)
                      .then(res => {
                        if (res) {
                          refreshHandler();
                          setModal(modal => {
                            return {
                              ...modal,
                              open: false,
                              confirmLoading: false,
                            };
                          });
                        } else {
                          setModal(modal => {
                            return {
                              ...modal,
                              confirmLoading: false,
                            };
                          });
                        }
                      });
                  },
                  handleCancel: () => {
                    setModal(modal => {
                      return {
                        ...modal,
                        open: false,
                      };
                    });
                  },
                  content: (
                    <>
                      <UserUpdate isCreate={true} ref={updateUserRef} />
                    </>
                  ),
                };
              });
            }}
          >
            Create User
          </Button>
        </div>
        <div className='flex flex-col gap-4'>
          <Table<ITableUser>
            bordered={true}
            virtual
            scroll={{ x: 1000, y: 0 }}
            columns={columns}
            dataSource={formatList}
            loading={loading}
            pagination={false}
          />
          <Pagination
            showSizeChanger
            onChange={(pageIndex, pageSize) => {
              ref.current.pageIndex = pageIndex - 1;
              ref.current.pageSize = pageSize;
              refreshHandler();
            }}
            defaultCurrent={1}
            total={list.totalLength}
            align={'end'}
            hideOnSinglePage={true}
          />
        </div>
      </div>
      {contextHolder}
      <ConfirmModal
        title={modal.title}
        isModalOpen={modal.open}
        handleOk={modal.handleOk}
        handleCancel={modal.handleCancel}
        maskClosable={false}
        confirmLoading={modal.confirmLoading}
        children={modal.content}
      ></ConfirmModal>
    </>
  );
});

export default UserList;
