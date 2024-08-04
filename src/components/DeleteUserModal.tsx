'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { toast } from 'react-toastify';
import { deleteUser } from '../lib/api';
import Modal from './Modal';
import { IUser } from '../types/custom-types';

const DeleteUserModal = ({
  user,
  isOpen,
  onClose,
}: {
  user: IUser;
  isOpen: boolean;
  onClose: (success: boolean) => Promise<void>;
}) => {
  const onCancel = async (): Promise<void> => {
    onClose(false);
  };

  const mutation = useMutation({
    mutationFn: ({ userUuid }: { userUuid: UUID }) => onMutate(userUuid),
    async onSuccess(user, variables, context) {
      toast(`User deleted successfully ${user?.name}`, {
        type: 'success',
        position: 'bottom-right',
      });

      onClose(true);
    },
    onError(error, variables, context) {
      toast(error?.message, {
        type: 'error',
        position: 'bottom-right',
      });
    },
  });

  const onMutate = async (userUuid): Promise<IUser> => {
    const response = await deleteUser(userUuid);
    if (response.status !== 200) {
      throw new Error('User deletion failed');
    }
    const user = response.data;
    return user;
  };

  const onDelete = async (): Promise<void> => {
    if (!user?.uuid) {
      return;
    }

    mutation.mutate({
      userUuid: user.uuid,
    });
  };

  const btn = (
    <button className='btn btn-accent mx-1' id='btn-delete' onClick={onDelete}>
      Delete
    </button>
  );
  const btnLoading = (
    <button
      className='btn btn-disabled btn-accent mx-1'
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
      {mutation.isPending ? btnLoading : btn}
      <button
        id='btn-cancel'
        type='button'
        className={`btn btn-outline mx-1 ${
          mutation.isPending ? 'btn-disabled' : ''
        }`}
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
      onClose={(): Promise<void> => onClose(false)}
    />
  );
};

export default DeleteUserModal;
