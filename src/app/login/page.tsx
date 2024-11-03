'use client';

import { useEffect, useState, use } from 'react';
import useUserStore from '../../lib/user-store';
import LoginPage from './login-page';
import { redirect } from 'next/navigation';
import LoadingOverlay from '../../components/LoadingOverlay';

export default function Login({searchParams}: { readonly searchParams: Promise<{ error: string }> }) {
  const { error } = use(searchParams);
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

  return <LoginPage error={error} />;
}
