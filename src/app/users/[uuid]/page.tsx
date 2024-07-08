'use client';

import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import LoadingOverlay from '../../../components/LoadingOverlay';
import Error from '../../error';
import EditUserPage from './edit-user-page';
import { getUserByUuid } from '../../../lib/api';

export default function EditUser({ params }): JSX.Element {
  if (!params?.uuid) {
    redirect('/users');
  }

  const {
    isPending,
    error,
    data: user,
  } = useQuery({
    queryKey: ['userByUuid', params.uuid],
    queryFn: () => getUserByUuid(params.uuid).then((res) => res.data),
  });

  if (isPending) {
    return <LoadingOverlay label='Loading' />;
  }

  if (error) {
    return <Error error={error} />;
  }

  console.log('user', user);
  if (!user) {
    redirect('/users');
  }

  return <EditUserPage user={user} />;
}
