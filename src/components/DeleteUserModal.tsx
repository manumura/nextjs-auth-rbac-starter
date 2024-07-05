'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { deleteUser } from '../lib/api';
import Modal from './Modal';

const DeleteUserModal = ({ user, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);

  const onCancel = (): void => {
    onClose(false);
  };

  const onDelete = async (): Promise<void> => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      const res = await deleteUser(user?.uuid);
      setLoading(false);
      const response = res?.data;

      toast(`User successfully deleted: ${response.name}`, {
        type: 'success',
        position: 'top-right',
      });
      onClose(true);
    } catch (error) {
      setLoading(false);
      toast(`Delete user failed!  ${error?.response?.data?.message}`, {
        type: 'error',
        position: 'top-right',
      });
    }
  };

  const btn = (
    <button className='btn btn-accent mx-1' id='btn-delete' onClick={onDelete}>
      Delete
    </button>
  );
  const btnLoading = (
    <button
      className='btn btn-accent mx-1 btn-disabled'
      id='btn-delete-loading'
    >
      <span className='loading loading-spinner'></span>
      Delete
    </button>
  );

  const title = (
    <div>
      <h3 className='text-lg font-bold'>CONFIRM DELETE</h3>
    </div>
  );

  const body = (
    <div className='mt-5'>
      Are you sure you want to delete this user <b>{user?.name}</b> ?
    </div>
  );

  const footer = (
    <div className='flex'>
      {loading ? btnLoading : btn}
      <button
        id='btn-cancel'
        className='btn-outline btn mx-1'
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );

  return (
    <Modal
      title={title}
      body={body}
      footer={footer}
      isOpen={isOpen}
      onClose={(): void => onClose(false)}
    />
  );
};

export default DeleteUserModal;
