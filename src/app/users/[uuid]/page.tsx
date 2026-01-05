'use client';

import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { UUID } from 'node:crypto';
import { use, useEffect, useState, type JSX } from 'react';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { getUserByUuid } from '../../../lib/api';
import useUserStore from '../../../lib/user-store';
import { isAdmin } from '../../../lib/utils';
import Error from '../../error';
import EditUserPage from './edit-user-page';

export default function EditUser({
  params,
}: {
  readonly params: Promise<{ uuid: UUID }>;
}): JSX.Element {
  const { uuid } = use(params);
  if (!uuid) {
    redirect('/users');
  }

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const currentUser = useUserStore((state) => state.user);

  useEffect(() => {
    const checkAuth = async () => {
      if (!currentUser) {
        redirect('/login');
      }
      if (!isAdmin(currentUser)) {
        redirect('/');
      }
      setIsAuthChecked(true);
    };

    checkAuth();
  }, [currentUser]);

  const {
    isPending,
    error,
    data: user,
  } = useQuery({
    queryKey: ['userByUuid', uuid],
    queryFn: () => getUserByUuid(uuid).then((res) => res.data),
    retry: false,
    enabled: isAuthChecked, // Only fetch when auth is confirmed
  });

  if (!isAuthChecked || isPending) {
    return <LoadingOverlay label='Loading' />;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (!user) {
    redirect('/users');
  }

  return <EditUserPage user={user} />;
}
