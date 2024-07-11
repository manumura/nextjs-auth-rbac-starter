'use client';

import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingOverlay from '../../components/LoadingOverlay';
import { getUserFromToken } from '../../lib/api';
import useUserStore from '../../lib/user-store';
import Error from '../error';
import ResetPasswordPage from './reset-password-page';

export default function ResetPassword({ searchParams }) {
  const [loading, setLoading] = useState(true);
  const userStore = useUserStore();
  const currentUser = userStore.user;
  useEffect(() => {
    if (currentUser) {
      redirect('/');
    }
    setLoading(false);
  }, []);

  if (!searchParams?.token) {
    redirect('/');
  }

  const {
    isPending,
    error,
    data: user,
  } = useQuery({
    queryKey: ['userByToken'],
    queryFn: () => getUserFromToken(searchParams?.token).then((res) => res.data),
  });

  if (isPending || loading) {
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
