'use client';

import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import LoadingOverlay from '../../components/LoadingOverlay';
import { getProfile } from '../../lib/api';
import Error from '../error';
import EditProfilePage from './edit-profile-page';
import useUserStore from '../../lib/user-store';
import { useEffect, useState } from 'react';

export default function EditProfile() {
  const [loading, setLoading] = useState(true);
  const userStore = useUserStore();
  const currentUser = userStore.user;
  useEffect(() => {
    if (!currentUser) {
      redirect('/login');
    }
    setLoading(false);
  }, []);

  const {
    isPending,
    error,
    data: user,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile().then((res) => res.data),
    retry: false,
  });

  if (isPending || loading) {
    return <LoadingOverlay label='Loading' />;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (!user) {
    redirect('/login?error=404');
  }

  // Forward fetched data to your Client Component
  return <EditProfilePage user={user} />;
}
