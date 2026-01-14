'use client';

import { useQuery } from '@tanstack/react-query';
import { redirect, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import LoadingOverlay from '../../components/LoadingOverlay';
import appConfig from '../../config/config';
import { getUsers } from '../../lib/api';
import useUserStore from '../../lib/user-store';
import { isAdmin } from '../../lib/utils';
import Error from '../error';
import UsersPage from './users-page';

function UsersContent() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = appConfig.defaultRowsPerPage;
  // TODO filter by role
  const role = undefined;

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const currentUser = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Current User in Users Page:', currentUser);
      if (!currentUser) {
        redirect('/login');
      }
      if (!isAdmin(currentUser)) {
        redirect('/');
      }
      setIsAuthChecked(true);
    };

    checkAuth();
  }, [currentUser, setUser]);

  const queryFunction = async () => {
    const data = await getUsers(page, pageSize, role).then((res) => res.data);
    const users = data.elements;
    const totalElements = data.totalElements;
    return { users, totalElements };
  };

  const {
    isPending,
    error,
    data: { users, totalElements } = { users: [], totalElements: 0 },
  } = useQuery({
    queryKey: ['users', page, pageSize, role],
    // queryKey: ['users', page, pageSize],
    queryFn: queryFunction,
    retry: false,
    enabled: isAuthChecked, // Only fetch when auth is confirmed
  });

  if (!isAuthChecked || isPending) {
    return <LoadingOverlay label='Loading' />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <UsersPage
      users={users}
      totalElements={totalElements}
      page={page}
      pageSize={pageSize}
      role={role}
      currentUser={currentUser}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingOverlay label='Loading users...' />}>
      <UsersContent />
    </Suspense>
  );
}
