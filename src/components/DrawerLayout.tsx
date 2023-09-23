'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import useDrawerOpenStore from '../lib/drawer-open-store';
import { isAdmin } from '../lib/utils';
import LogoutButton from './LogoutButton';
import Navbar from './Navbar';

const DrawerLayout = ({ user, children }) => {
  console.log('user DrawerLayout', user);
  const router = useRouter();
  //initialize state here. we use a key and a default state
  const { open, setOpen } = useDrawerOpenStore();
  const toggleDrawer = (): void => setOpen(!open);

  const handleLogin = (): void => {
    router.push('/login');
  };

  const adminButtons = isAdmin(user) ? (
    <li>
    <Link href='/users' className='text-neutral'>
      Users
    </Link>
  </li>
  ) : null;
  const buttons = user ? (
    <>
      {adminButtons}
      <li>
        <Link href='/profile' className='text-neutral'>
          Profile
        </Link>
      </li>
      <li>
        <LogoutButton />
      </li>
    </>
  ) : (
    <>
      <li>
        <Link href='/register' className='text-neutral'>
          Register
        </Link>
      </li>
      <li>
        <button className='btn-outline btn' onClick={handleLogin}>
          Login
        </button>
      </li>
    </>
  );

  return (
    <div className='drawer'>
      <input
        id='app-drawer'
        type='checkbox'
        className='drawer-toggle'
        // checked property will now reflect our open state
        checked={open}
        onChange={toggleDrawer}
      />

      <div className='drawer-content flex flex-col'>
        <Navbar user={user} />
        {children}
      </div>

      <div className='drawer-side'>
        <label htmlFor='app-drawer' className='drawer-overlay'></label>
        <ul
          className='menu w-80 overflow-y-auto bg-slate-50 p-4'
          onClick={toggleDrawer}
        >
          {buttons}
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DrawerLayout;
