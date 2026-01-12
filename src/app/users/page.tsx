'use client';

import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { Suspense, use, useEffect, useState } from 'react';
import LoadingOverlay from '../../components/LoadingOverlay';
import appConfig from '../../config/config';
import { getUsers } from '../../lib/api';
import useUserStore from '../../lib/user-store';
import Error from '../error';
import UsersPage from './users-page';
import { isAdmin } from '../../lib/utils';

function Users({ queryParams }) {
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

  const { page, pageSize, role } = queryParams;
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

export default function Page({
  searchParams,
}: {
  readonly searchParams: Promise<{ page: string }>;
}) {
  const { page } = use(searchParams);
  const p = Number(page) || 1;
  const pageSize = appConfig.defaultRowsPerPage;
  // TODO filter by role
  const role = undefined;
  const queryParams = { page: p, pageSize, role };

  return (
    <Suspense fallback={<LoadingOverlay label='Fetching users...' />}>
      <Users queryParams={queryParams} />
    </Suspense>
  );
}
