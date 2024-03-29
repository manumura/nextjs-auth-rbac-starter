'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { logout } from '../lib/api';
import { clearStorage } from '../lib/storage';
import useUserStore from '../lib/user-store';

const LogoutButton = ({ id }) => {
  const router = useRouter();
  const pathname = usePathname();
  const userStore = useUserStore();
  const [loading, setLoading] = useState(false);

  const handleLogout = async (): Promise<void> => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      // await sleep(1000);
      await logout();

      toast('Logout successfull!', {
        type: 'success',
        position: 'top-center',
      });
    } catch (error) {
      toast(`Logout failed! ${error?.response?.data?.message}`, {
        type: 'error',
        position: 'top-center',
      });
    } finally {
      setLoading(false);

      clearStorage();
      userStore.setUser(undefined);

      if (pathname !== '/') {
        router.push('/');
      }
      router.refresh();
    }
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

  return loading ? btnLoading : btn;
};

export default LogoutButton;
