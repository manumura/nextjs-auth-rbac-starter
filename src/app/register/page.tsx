'use client';

import { useEffect, useState } from 'react';
import useUserStore from '../../lib/user-store';
import RegisterPage from './register-page';
import { redirect } from 'next/navigation';
import LoadingOverlay from '../../components/LoadingOverlay';

export default function Register() {
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

  return <RegisterPage />;
}
