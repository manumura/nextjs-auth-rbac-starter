'use client';

import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { getUserByUuid } from '../../../lib/api';
import Error from '../../error';
import EditUserPage from './edit-user-page';
import { UUID } from 'node:crypto';
import useUserStore from '../../../lib/user-store';
import { useEffect, useState } from 'react';

// export const dynamicParams = true;
// export async function generateStaticParams() {
//   return [{uuid: ''}];
// }

export default function EditUser({ params }: {params : {uuid: UUID}}): JSX.Element {
  const [loading, setLoading] = useState(true);
  const userStore = useUserStore();
  const currentUser = userStore.user;
  useEffect(() => {
    if (!currentUser) {
      redirect('/login');
    }
    setLoading(false);
  }, []);

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
    retry: false,
  });

  if (isPending || loading) {
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
