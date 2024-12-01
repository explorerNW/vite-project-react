import Modal from 'antd/es/modal';
import { ReactNode } from 'react';

export default function ConfirmModal({
  title,
  isModalOpen,
  handleOk,
  handleCancel,
  children,
  maskClosable,
  confirmLoading,
}: {
  title: string;
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  children?: ReactNode;
  maskClosable?: boolean;
  confirmLoading?: boolean;
}) {
  return (
    <>
      <Modal
        title={title}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={maskClosable}
        confirmLoading={confirmLoading}
        destroyOnClose
      >
        {children && children}
      </Modal>
    </>
  );
}
