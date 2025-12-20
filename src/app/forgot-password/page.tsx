'use client';

import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingOverlay from '../../components/LoadingOverlay';
import useUserStore from '../../lib/user-store';
import ForgotPasswordPage from './forgot-password-page';

export default function ForgotPassword() {
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

  // Forward fetched data to your Client Component
  return <ForgotPasswordPage />;
}
