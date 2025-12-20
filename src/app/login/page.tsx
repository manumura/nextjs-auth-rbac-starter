'use client';

import { redirect } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import LoadingOverlay from '../../components/LoadingOverlay';
import useUserStore from '../../lib/user-store';
import LoginPage from './login-page';

export default function Login({
  searchParams,
}: {
  readonly searchParams: Promise<{ error: string }>;
}) {
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

  if (!isAuthChecked) {
    return <LoadingOverlay label='Loading' />;
  }

  const { error } = use(searchParams);

  return <LoginPage error={error} />;
}
