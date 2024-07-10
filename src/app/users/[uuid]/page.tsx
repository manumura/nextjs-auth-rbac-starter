'use client';

import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { getUserByUuid } from '../../../lib/api';
import Error from '../../error';
import EditUserPage from './edit-user-page';

export const dynamicParams = true;
export async function generateStaticParams() {
  return [{uuid: ''}];
}

export default function EditUser({params}): JSX.Element {
  if (!params?.uuid) {
    redirect('/users');
  }

  const uuid = params.uuid;
  const {
    isPending,
    error,
    data: user,
  } = useQuery({
    queryKey: ['userByUuid', uuid],
    queryFn: () => getUserByUuid(uuid).then((res) => res.data),
  });

  if (isPending) {
    return <LoadingOverlay label='Loading' />;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (!user) {
    redirect('/users');
  }

  return <EditUserPage user={user} />;
}
