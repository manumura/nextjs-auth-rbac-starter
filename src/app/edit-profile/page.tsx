'use client';

import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import LoadingOverlay from '../../components/LoadingOverlay';
import { getProfile } from '../../lib/api';
import Error from '../error';
import EditProfilePage from './edit-profile-page';

export default function EditProfile() {
  const {
    isPending,
    error,
    data: user,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile().then((res) => res.data),
  });

  if (isPending) {
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
