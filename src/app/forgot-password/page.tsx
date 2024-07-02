'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import useUserStore from '../../lib/user-store';
import ForgotPasswordPage from './forgot-password-page';

export default function ForgotPassword() {
  const userStore = useUserStore();
  const user = userStore.user;

  useEffect(() => {
    if (user) {
      redirect('/');
    }
  }, [user]);

  // Forward fetched data to your Client Component
  return <ForgotPasswordPage />;
}
