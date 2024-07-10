'use client';

import { useMutation } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { logout } from '../lib/api';
import { clearAuthentication } from '../lib/storage';
import useUserStore from '../lib/user-store';

const LogoutButton = ({ id }) => {
  const router = useRouter();
  const pathname = usePathname();
  const userStore = useUserStore();

  const mutation = useMutation({
    mutationFn: async () => onMutate(),
    onSuccess(data, variables, context) {
      userStore.setUser(null);
      clearAuthentication();

      toast('Logout successfull', {
        type: 'success',
        position: 'top-right',
      });

      if (pathname !== '/') {
        router.push('/');
      }
      router.refresh();
    },
    onError(error, variables, context) {
      toast(error?.message, {
        type: 'error',
        position: 'top-right',
      });
    },
  });

  const onMutate = async (): Promise<void> => {
    const response = await logout();
    if (response.status !== 204) {
      throw new Error('Logout failed');
    }
  };

  const handleLogout = async (): Promise<void> => {
    mutation.mutate();
  };

  const btn = (
    <button className='btn-outline btn' id={id} onClick={handleLogout}>
      Logout
    </button>
  );
  const btnLoading = (
    <button className='btn-outline btn' id={id}>
      <span className='loading loading-spinner'></span>
      Logout
    </button>
  );

  return mutation.isPending ? btnLoading : btn;
};

export default LogoutButton;
