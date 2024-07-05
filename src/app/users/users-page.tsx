'use client';

import { Pagination } from '@/components/Pagination';
import { EventSourceMessage } from '@microsoft/fetch-event-source';
import { UUID } from 'crypto';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiDelete, FiEdit, FiPlusCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import DeleteUserModal from '../../components/DeleteUserModal';
import { subscribe } from '../../lib/sse';
import { getSavedUserEvents, saveUserEvents } from '../../lib/storage';
import { appConstant } from '../../config/constant';
import appConfig from '../../config/config';

export default function UsersPage({
  users,
  totalElements,
  page,
  pageSize,
  currentUser,
}) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [usersToDisplay, setUsersToDisplay] = useState(users);

  const userChangeEventAbortController = new AbortController();

  useEffect(() => {
    setUsersToDisplay(users);
  }, [users]);

  useEffect(() => {
    subscribeUserChangeEvents();
    return () => {
      userChangeEventAbortController.abort();
      console.log(
        'Unsubscribed to user change events - signal aborted:',
        userChangeEventAbortController.signal.aborted,
      );
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

  const onMessage = (message: EventSourceMessage) => {
    const shouldProcess = shouldProcessMessage(message);
    if (!shouldProcess) {
      return;
    }

    processMessage(message);
  };

  const shouldProcessMessage = (message: EventSourceMessage): boolean => {
    if (!message.event || !message.data || !message.id) {
      // console.log('Invalid message:', message);
      return false;
    }

    const data = JSON.parse(message.data);
    const auditUserUuid = data.auditUserUuid;

    if (auditUserUuid === currentUser.uuid) {
      // console.log('Ignoring event from current user');
      return false;
    }

    // Store notifications to prevent duplicate notifications
    const userEventsMap = getSavedUserEvents() || new Map<UUID, string[]>();
    const events = userEventsMap?.get(currentUser.uuid) || [];

    if (events.includes(message.id)) {
      // console.log('Event already processed:', message.id);
      return false;
    }

    const newEvents = [message.id, ...events];
    if (newEvents.length >= appConstant.MAX_USER_EVENTS_TO_STORE) {
      newEvents.pop();
    }
    userEventsMap.set(currentUser.uuid, newEvents);
    saveUserEvents(userEventsMap);

    return true;
  };

  const processMessage = (message: EventSourceMessage): void => {
    const data = JSON.parse(message.data);
    const type = message.event;
    const userFromEvent = data.user;

    const userIndex = usersToDisplay.findIndex(
      (u) => u.uuid === userFromEvent.uuid,
    );
    // const userInList = usersToDisplay.find(
    //   (u) => u.uuid === userFromEvent.uuid,
    // );
    // const isUserModified =
    //   userInList && userInList.updatedAt !== userFromEvent.updatedAt;

    // if (type === 'USER_CREATED' && !userInList && +page === 1) {
    //   // Add user to list
    //   console.log('Adding user to list');
    //   // Remove last record if page is full
    //   if (usersToDisplay.length >= pageSize) {
    //     usersToDisplay.pop();
    //   }
    //   setUsersToDisplay([userFromEvent, ...usersToDisplay]);
    // }
    if (type === 'USER_CREATED') {
      const msg = `New user has been created: ${userFromEvent.email}. Please refresh the page to see the changes.`;
      console.log(msg);
      toast(msg, {
        type: 'info',
        position: 'top-right',
        autoClose: false,
      });
    }

    if (type === 'USER_UPDATED') {
      const msg = `User has been updated: ${userFromEvent.email}.`;
      console.log(msg);
      toast(msg, {
        type: 'info',
        position: 'top-right',
        autoClose: false,
      });

      if (userIndex !== -1) {
        usersToDisplay[userIndex] = userFromEvent;
        setUsersToDisplay([...usersToDisplay]);
        hightlightRow(userFromEvent.uuid);
      }
    }

    // if (type === 'USER_DELETED' && userInList) {
    //   // Remove user from list
    //   console.log('Removing user from list');
    //   const index = usersToDisplay.indexOf(userInList);
    //   usersToDisplay.splice(index, 1);
    //   setUsersToDisplay([...usersToDisplay]);
    // }
    if (type === 'USER_DELETED') {
      const msg = `User has been deleted: ${userFromEvent.email}. Please refresh the page to see the changes.`;
      console.log(msg);
      toast(msg, {
        type: 'warning',
        position: 'top-right',
        autoClose: false,
      });
    }
  };

  const hightlightRow = (userUuid: string) => {
    const row = document.getElementById('user-' + userUuid);
    if (row) {
      row.classList.add('highlight-row');
      row.onanimationend = () => {
        row.classList.remove('highlight-row');
      };
    }
  };

  async function subscribeUserChangeEvents() {
    console.log('Subscribing to user change events');
    subscribe(
      `${appConfig.baseUrl}/api/v1/events/users`,
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
    <tr key={user.uuid} id={`user-${user.uuid}`}>
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
