'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import logo from '../../public/next.svg';
import useUserStore from '../lib/user-store';
import { isAdmin } from '../lib/utils';
import { IUser } from '../types/custom-types';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

function getNavItems(user: IUser | null | undefined): React.JSX.Element[] {
  const navItems: React.JSX.Element[] = [];

  if (!user) {
    const registerLink = (
      <Link href='/register' id='register-link' className='text-neutral'>
        Register
      </Link>
    );
    const loginLink = <LoginButton id='login-link' />;
    navItems.push(registerLink);
    navItems.push(loginLink);
    return navItems;
  }

  if (isAdmin(user)) {
    const usersLink = (
      <Link href='/users' id='users-link' className='text-neutral'>
        Users
      </Link>
    );
    navItems.push(usersLink);
  }
  const profileLink = (
    <Link href='/profile' id='profile-link' className='text-neutral'>
      Profile
    </Link>
  );
  const logoutLink = <LogoutButton id='logout-link' />;
  navItems.push(profileLink);
  navItems.push(logoutLink);
  return navItems;
}

export default function Navbar({ children }) {
  const currentUser = useUserStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const [navItems, setNavItems] = useState<React.JSX.Element[]>(
    getNavItems(currentUser),
  );
  const toggleDrawer = (): void => setOpen(!open);

  useEffect(() => {
    // Re-render navItems when user changes
    const unsubscribe = useUserStore.subscribe((userState) => {
      console.log('Navbar user updated', userState.user);
      setNavItems(getNavItems(userState.user));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const navItemsList = navItems.map((item: React.JSX.Element) => {
    return <li key={item.props.id}>{item}</li>;
  });

  const navbar = (
    <div className='navbar w-full'>
      <div
        className='btn btn-square btn-ghost flex-none lg:hidden'
        onClick={toggleDrawer}
      >
        {/* <label htmlFor='my-drawer' className='btn btn-square btn-ghost'> */}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          className='inline-block h-6 w-6 stroke-current'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M4 6h16M4 12h16M4 18h16'
          ></path>
        </svg>
        {/* </label> */}
      </div>
      {/* Website logo */}
      <div className='mx-2 flex-1 px-2'>
        <div className='flex items-center'>
          <Link href='/'>
            <Image src={logo} height='20' alt='Logo' placeholder='empty' />
          </Link>
          <Link href='/'>
            <span className='text-neutral pl-5 text-2xl font-semibold'>
              MyApp
            </span>
          </Link>
        </div>
      </div>
      {/* Desktop menu only shows for lg and up devices */}
      <div className='hidden flex-none lg:block'>
        <ul className='menu menu-horizontal px-2'>{navItemsList}</ul>
      </div>
    </div>
  );

  return (
    <div className='drawer'>
      <input
        id='my-drawer'
        type='checkbox'
        className='drawer-toggle'
        checked={open}
        onChange={toggleDrawer}
      />
      <div className='drawer-content flex flex-col'>
        {navbar}
        {children}
      </div>
      <div className='drawer-side'>
        <label htmlFor='my-drawer' className='drawer-overlay'></label>
        <ul
          className='menu min-h-full w-80 bg-slate-100 p-4'
          onClick={toggleDrawer}
        >
          {navItemsList}
        </ul>
      </div>
    </div>
  );
}
