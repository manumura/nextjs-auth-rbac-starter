'use client';

import { Pagination } from '@/components/Pagination';
import {
  EventSourceMessage
} from '@microsoft/fetch-event-source';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiDelete, FiEdit, FiPlusCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import DeleteUserModal from '../../components/DeleteUserModal';
import { subscribe, userChangeEventAbortController } from '../../lib/sse';

// Disable SWR caching on this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function UsersPage({ users, totalElements, page, pageSize, currentUser }) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [usersToDisplay, setUsersToDisplay] = useState(users);

  // Store notifications to prevent duplicate notifications
  const notifications: string[] = [];

  useEffect(() => {
    setUsersToDisplay(users);
  }, [users]);

  useEffect(() => {
    subscribeUserChangeEvents();
    return () => {
      console.log('Unsubscribing to user change events');
      userChangeEventAbortController.abort();
    };
  }, []);

  const onPageSelect = (pageSelected): void => {
    router.replace(`users?page=${pageSelected}`);
    // router.refresh();
  };

  const openDeleteModal = (user): void => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const onCloseDeleteModal = (isSuccess): void => {
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

  async function subscribeUserChangeEvents() {
    console.log('Subscribing to user change events');
    const onMessage = (message: EventSourceMessage) => {
      if (!message.event || !message.data || !message.id) {
        return;
      }

      // TODO store notifications in a global store
      if (notifications.includes(message.id)) {
        console.log('Notification already processed');
        return;
      }
      notifications.push(message.id);

      const data = JSON.parse(message.data);
      const userFromEvent = data.user;
      const auditUserUuid = data.auditUserUuid;

      if (auditUserUuid === currentUser.uuid) {
        console.log('Ignoring event from current user');
        return;
      }

      const userInList = usersToDisplay.find((u) => u.uuid === userFromEvent.uuid);
      const isUserModified = userInList && userInList.updatedAt !== userFromEvent.updatedAt;

      // if (message.event === 'USER_CREATED' && !userInList && +page === 1) {
      //   // Add user to list
      //   console.log('Adding user to list');
      //   // Remove last record if page is full
      //   if (usersToDisplay.length >= pageSize) {
      //     usersToDisplay.pop();
      //   }
      //   setUsersToDisplay([userFromEvent, ...usersToDisplay]);
      // }
      if (message.event === 'USER_CREATED') {
        const msg = `New user has been created: ${userFromEvent.email}`;
        console.log(msg);
        toast(msg, {
          type: 'info',
          position: 'top-center',
          autoClose: false,
        });
      }
      
      if (message.event === 'USER_UPDATED' && isUserModified) {
        // Update user in list
        console.log('Updating user in list');
        const index = usersToDisplay.indexOf(userInList);
        usersToDisplay[index] = userFromEvent;
        setUsersToDisplay([...usersToDisplay]);
      }
      
      // if (message.event === 'USER_DELETED' && userInList) {
      //   // Remove user from list
      //   console.log('Removing user from list');
      //   const index = usersToDisplay.indexOf(userInList);
      //   usersToDisplay.splice(index, 1);
      //   setUsersToDisplay([...usersToDisplay]);
      // }
      if (message.event === 'USER_DELETED') {
        const msg = `User has been deleted: ${userFromEvent.email}`;
        console.log(msg);
        toast(msg, {
          type: 'warning',
          position: 'top-center',
          autoClose: false,
        });
      }
    };

    subscribe(
      // TODO url from config
      'http://localhost:9002/api/v1/events/users',
      userChangeEventAbortController,
      onMessage,
    );
  }

  const isUserListEmpty = !usersToDisplay || usersToDisplay.length <= 0;
  const noUserRow = (
    <tr>
      <td colSpan={5} className='text-center font-bold'>
        No Users found
      </td>
    </tr>
  );

  const userRows = usersToDisplay?.map((user) => (
    <tr key={user.uuid}>
      <th>{user.uuid}</th>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        <div className='flex justify-end space-x-1'>
          <button
            className='btn btn-primary btn-sm gap-2'
            onClick={(): void => onEditUser(user.uuid)}
          >
            <FiEdit />
            Edit
          </button>
          <button
            className='btn btn-accent btn-sm gap-2'
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
    <div className='mt-10 overflow-x-auto rounded-lg bg-slate-50 p-10 md:container md:mx-auto'>
      <table className='table table-zebra w-full'>
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
        <tbody>{!isUserListEmpty ? userRows : noUserRow}</tbody>
      </table>
      <div className='flex justify-end'>
        {!isUserListEmpty && (
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
        onClose={onCloseDeleteModal}
      />
    </section>
  );
}
