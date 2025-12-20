'use client';

import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import LoadingOverlay from '../../components/LoadingOverlay';
import { getUserFromToken } from '../../lib/api';
import useUserStore from '../../lib/user-store';
import Error from '../error';
import ResetPasswordPage from './reset-password-page';

export default function ResetPassword({
  searchParams,
}: {
  readonly searchParams: Promise<{ token: string }>;
}) {
  const { token } = use(searchParams);
  if (!token) {
    console.error('No token found in query params');
    redirect('/');
  }

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const currentUser = useUserStore((state) => state.user);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Current User in Login Page:', currentUser);
      if (currentUser) {
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
    queryKey: ['userByToken'],
    queryFn: () => getUserFromToken(token).then((res) => res.data),
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
    redirect('/login?error=404');
  }

  // Forward fetched data to your Client Component
  return <ResetPasswordPage token={token} />;
}
