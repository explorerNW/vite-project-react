import Table, { TableProps } from 'antd/es/table';
import { User } from '../data.type';
import { memo, useMemo, useRef, useState } from 'react';
import { fetchUsersList } from './user-apis';
import Space from 'antd/es/space';
import { Button, Modal } from 'antd';
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
  const destroyAll = () => {
    Modal.destroyAll();
  };
  const columns: TableProps<ITableUser>['columns'] = [
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Sex',
      dataIndex: 'sex',
      key: 'sex',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Income',
      dataIndex: 'income',
      key: 'income',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
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
                    if (updateUserRef.current) {
                      setModal(modal => {
                        return { ...modal, confirmLoading: true };
                      });
                      updateUserRef.current.updateUserHandler().then(update => {
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
                    }
                  },
                  handleCancel: () => {
                    setModal(modal => {
                      return { ...modal, open: false, content: <></> };
                    });
                    destroyAll();
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
      ),
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
      <Table<ITableUser>
        columns={columns}
        dataSource={formatList}
        loading={loading}
      />
      <ConfirmModal
        title={modal.title}
        isModalOpen={modal.open}
        handleOk={modal.handleOk}
        handleCancel={modal.handleCancel}
        maskClosable={false}
        confirmLoading={modal.confirmLoading}
      >
        {modal.content}
      </ConfirmModal>
    </>
  );
});
