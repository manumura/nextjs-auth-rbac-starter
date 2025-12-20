'use client';

import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingOverlay from '../../components/LoadingOverlay';
import useUserStore from '../../lib/user-store';
import RegisterPage from './register-page';

export default function Register() {
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

  return <RegisterPage />;
}
