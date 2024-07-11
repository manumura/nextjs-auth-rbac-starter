'use client';

import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import useUserStore from '../../lib/user-store';
import ForgotPasswordPage from './forgot-password-page';
import { set } from 'react-hook-form';
import LoadingOverlay from '../../components/LoadingOverlay';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(true);
  const userStore = useUserStore();
  const currentUser = userStore.user;
  useEffect(() => {
    if (currentUser) {
      redirect('/');
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingOverlay label='Loading' />;
  }

  // Forward fetched data to your Client Component
  return <ForgotPasswordPage />;
}
