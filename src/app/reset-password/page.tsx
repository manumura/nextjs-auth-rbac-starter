'use client';

import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import LoadingOverlay from '../../components/LoadingOverlay';
import { getUserFromToken } from '../../lib/api';
import useUserStore from '../../lib/user-store';
import Error from '../error';
import ResetPasswordPage from './reset-password-page';

export default function ResetPassword({ searchParams }) {
  const userStore = useUserStore();
  const userFromStore = userStore.user;

  useEffect(() => {
    if (userFromStore) {
      redirect('/');
    }
  }, [userFromStore]);

  if (!searchParams?.token) {
    redirect('/login?error=404');
  }

  const {
    isPending,
    error,
    data: user,
  } = useQuery({
    queryKey: ['userByToken'],
    queryFn: () => getUserFromToken(searchParams?.token).then((res) => res.data),
  });

  if (isPending) {
    return <LoadingOverlay label='Loading' />;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (!user) {
    redirect('/login?error=404');
  }

  // Forward fetched data to your Client Component
  return <ResetPasswordPage token={searchParams?.token} />;
}
