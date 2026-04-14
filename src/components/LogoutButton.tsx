'use client';

import { useMutation } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { logout } from '../lib/api';
import { clearStorage } from '../lib/storage';
import useUserStore from '../lib/user-store';

const LogoutButton = ({ id }) => {
  const router = useRouter();
  const pathname = usePathname();
  const userStore = useUserStore();

  const mutation = useMutation({
    mutationFn: async () => onMutate(),
    onSuccess(data, variables, context) {
      userStore.setUser(null);
      clearStorage();

      toast('Logout successfull', {
        type: 'success',
        position: 'bottom-right',
      });

      if (pathname !== '/') {
        router.push('/');
      }
      // Redirect to home page after logout is done in Navbar component's useEffect when user state changes to null
      // router.refresh();
    },
    onError(error, variables, context) {
      toast(error?.message, {
        type: 'error',
        position: 'bottom-right',
      });
    },
  });

  const onMutate = async (): Promise<void> => {
    await logout();
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
