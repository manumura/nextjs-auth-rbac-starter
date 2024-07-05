'use client';

import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import LoadingOverlay from '../../components/LoadingOverlay';
import { getProfile } from '../../lib/api';
import Error from '../error';
import ProfilePage from './profile-page';

export default function Profile() {
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
  return (
    <ProfilePage user={user} />
  );
}
