'use client';

import { useEffect, useState } from 'react';
import useUserStore from '../../lib/user-store';
import CreateUserPage from './create-user-page';
import { redirect } from 'next/navigation';
import { set } from 'react-hook-form';
import LoadingOverlay from '../../components/LoadingOverlay';

export default function CreateUser() {
  const [loading, setLoading] = useState(true);
  const userStore = useUserStore();
  const currentUser = userStore.user;
  useEffect(() => {
    if (!currentUser) {
      redirect('/login');
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingOverlay label='Loading' />;
  }

  return <CreateUserPage />;
}
