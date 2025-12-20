'use client';

import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingOverlay from '../../components/LoadingOverlay';
import useUserStore from '../../lib/user-store';
import CreateUserPage from './create-user-page';

export default function CreateUser() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const currentUser = useUserStore((state) => state.user);

  useEffect(() => {
    const checkAuth = async () => {
      if (!currentUser) {
        redirect('/login');
      }
      setIsAuthChecked(true);
    };

    checkAuth();
  }, [currentUser]);

  if (!isAuthChecked) {
    return <LoadingOverlay label='Loading' />;
  }

  return <CreateUserPage />;
}
