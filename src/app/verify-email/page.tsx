'use client';

import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import LoadingOverlay from '../../components/LoadingOverlay';
import { verifyEmail } from '../../lib/api';
import useUserStore from '../../lib/user-store';
import VerifyEmailPage from './verify-email-page';

export default function VerifyEmail({ searchParams }: { readonly searchParams: Promise<{ token: string }> }) {
  const { token } = use(searchParams);
  const [loading, setLoading] = useState(true);
  const userStore = useUserStore();
  const currentUser = userStore.user;
  useEffect(() => {
    if (currentUser) {
      redirect('/');
    }
    setLoading(false);
  }, []);

  if (!token) {
    console.error('No token found in query params');
    redirect('/');
  }

  const {
    isPending,
    error,
    data: result,
  } = useQuery({
    queryKey: ['verify-email', token],
    queryFn: () =>
      verifyEmail(token).then((user) => (user ? 'success' : 'failed')),
    retry: false,
  });

  if (isPending || loading) {
    return <LoadingOverlay label='Loading' />;
  }

  let r = result;
  if (error) {
    r = 'failed';
  }

  return <VerifyEmailPage result={r} />;
}
