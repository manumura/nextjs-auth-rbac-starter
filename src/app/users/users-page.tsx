'use client';

import { Pagination } from '@/components/Pagination';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiDelete, FiEdit, FiPlusCircle } from 'react-icons/fi';
import DeleteUserModal from '../../components/DeleteUserModal';

export default function UsersPage({ users, totalElements, page, pageSize }) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const onPageSelect = (pageSelected): void => {
    router.push(`users?page=${pageSelected}`);
  };

  const openDeleteModal = (user): void => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const onDeleteModalClose = (isSuccess): void => {
    setIsDeleteModalOpen(false);
    if (isSuccess) {
      // Refresh page
      router.refresh();
    }
  };

  const onEditUser = (userUuid): void => {
    router.push(`users/${userUuid}`);
  };

  const onCreateUser = (): void => {
    router.push('create-user');
  };

  const noUserRow = (
    <tr>
      <td colSpan={5} className='text-center font-bold'>
        No Users found
      </td>
    </tr>
  );

  const userRows = users?.map((user) => (
    <tr key={user.uuid}>
      <th>{user.uuid}</th>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        <div className='flex justify-end space-x-1'>
          <button
            className='btn-primary btn-sm btn gap-2'
            onClick={(): void => onEditUser(user.uuid)}
          >
            <FiEdit />
            Edit
          </button>
          <button
            className='btn-accent btn-sm btn gap-2'
            onClick={(): void => openDeleteModal(user)}
          >
            <FiDelete />
            Delete
          </button>
        </div>
      </td>
    </tr>
  ));

  const usersTable = (
    <div className='overflow-x-auto bg-slate-50 p-10 mt-10 md:container md:mx-auto rounded-lg'>
      <table className='table-zebra table w-full'>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>
              <div className='flex justify-end space-x-1'>
                <button className='btn gap-2' onClick={onCreateUser}>
                  <FiPlusCircle />
                  Create User
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>{users && users.length > 0 ? userRows : noUserRow}</tbody>
      </table>
      <div className='flex justify-end'>
        {users && users.length > 0 && (
          <Pagination
            currentPage={page}
            onPageSelect={onPageSelect}
            rowsPerPage={pageSize}
            totalElements={totalElements}
          />
        )}
      </div>
    </div>
  );

  return (
    <section className='h-section bg-slate-200'>
      {usersTable}
      <DeleteUserModal
        user={selectedUser}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
      />
    </section>
  );
}
