'use client';

import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingOverlay from '../../components/LoadingOverlay';
import { getProfile } from '../../lib/api';
import useUserStore from '../../lib/user-store';
import Error from '../error';
import EditProfilePage from './edit-profile-page';

export default function EditProfile() {
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

  const {
    isPending,
    error,
    data: user,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile().then((res) => res.data),
    retry: false,
    enabled: isAuthChecked, // Only fetch when auth is confirmed
  });

  if (!isAuthChecked || isPending) {
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
