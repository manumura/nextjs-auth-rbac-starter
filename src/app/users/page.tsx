'use client';

import { useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import LoadingOverlay from '../../components/LoadingOverlay';
import appConfig from '../../config/config';
import { getUsers } from '../../lib/api';
import { getUserFromIdToken } from '../../lib/jwt.utils';
import { getSavedIdToken } from '../../lib/storage';
import Error from '../error';
import UsersPage from './users-page';

function Users({ searchParams }) {
  const page = searchParams?.page || 1;
  const pageSize = appConfig.defaultRowsPerPage;
  // TODO filter by role
  const role = undefined;

  const queryFunction = async () => {
    const data = await getUsers(page, pageSize, role).then((res) => res.data);
    const users = data.elements;
    const totalElements = data.totalElements;

    const idToken = getSavedIdToken();
    const currentUser = idToken ? await getUserFromIdToken(idToken) : null;
    return { users, totalElements, currentUser };
  };

  const {
    isPending,
    error,
    data: { users, totalElements, currentUser } = { users: [], totalElements: 0, currentUser: null},
  } = useQuery({
    queryKey: ['users', page, pageSize, role],
    queryFn: queryFunction,
  });  

  if (isPending) {
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

export default function Page({ searchParams }) {
  return (
    <Suspense fallback={<LoadingOverlay label='Fetching users...' />}>
      <Users searchParams={searchParams} />
    </Suspense>
  );
}
