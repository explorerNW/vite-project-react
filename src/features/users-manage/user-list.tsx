import Table, { TableProps } from 'antd/es/table';
import { User } from '../data.type';
import { memo, useMemo, useRef, useState } from 'react';
import { fetchUsersList } from './user-apis';
import Space from 'antd/es/space';
import { Button } from 'antd';
import ConfirmModal from '../modal/confirm-modal';
import UserUpdate from './user-update-form';
import { useRequest } from 'ahooks';

export const loader = () => {
  return {};
};

export default function Users() {
  const { data, refresh, loading } = useRequest(fetchUsersList);

  return (
    <>
      <UserList list={data?.data || []} refresh={refresh} loading={loading} />
    </>
  );
}

interface ITableUser {
  full_name: string;
  age: number;
  income: string;
  email: string;
  sex: 'male' | 'female';
  user: User;
}

export const UserList = memo(function UserList({
  list,
  refresh,
  loading,
}: {
  list: User[];
  refresh: () => void;
  loading: boolean;
}) {
  const [modal, setModal] = useState({
    title: '',
    open: false,
    content: <></>,
    handleOk: () => {},
    handleCancel: () => {},
    confirmLoading: false,
  });
  const updateUserRef = useRef<{
    updateUserHandler: () => Promise<boolean>;
    loading: boolean;
  }>();
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
      width: 200,
    },
    {
      title: 'Income',
      dataIndex: 'income',
      key: 'income',
      width: 200,
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
                        ?.updateUserHandler()
                        .then(update => {
                          if (update) {
                            refresh();
                            updateUserRef.current!.loading = false;
                            setModal(modal => {
                              return {
                                ...modal,
                                open: false,
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
            <Button onClick={() => {}}>Delete</Button>
          </Space>
        );
      },
    },
  ];

  const formatList = useMemo(() => {
    return list.map((user, index) => {
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
        <div className='text-right'>
          <Button
            onClick={() => {
              setModal(modal => {
                return {
                  ...modal,
                  open: true,
                  title: 'Create User',
                  handleOk: () => {
                    updateUserRef.current?.updateUserHandler().then(res => {
                      if (res) {
                        refresh();
                        setModal(modal => {
                          return {
                            ...modal,
                            open: false,
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
        <Table<ITableUser>
          bordered={true}
          virtual
          scroll={{ x: 1000, y: 400 }}
          columns={columns}
          dataSource={formatList}
          loading={loading}
        />
      </div>
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
