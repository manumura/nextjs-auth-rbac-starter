'use client';

import { Poppins } from 'next/font/google';
import { useEffect, useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';
import Navbar from '../components/Navbar';
import { Providers } from '../components/Providers';
import useUserStore from '../lib/user-store';
import { getCurrentUserFromStorage } from '../lib/utils';
import '../styles/globals.css';

// Fix for Error: connect ECONNREFUSED ::1:9002 on localhost with node > 16
// import dns from 'node:dns';
// dns.setDefaultResultOrder('ipv4first');

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const currentUser = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Current User in Root Layout:', currentUser);
      if (!currentUser) {
        const currentUserFromLocalStorage = await getCurrentUserFromStorage();
        console.log(
          'Current User from Local Storage in Root Layout:',
          currentUserFromLocalStorage,
        );
        setUser(currentUserFromLocalStorage);
      }
      setIsAuthChecked(true);
      console.log('RootLayout mounted');
    };

    checkAuth();
  }, [currentUser, setUser]);

  const body = !isAuthChecked ? (
    <LoadingOverlay label='Loading' />
  ) : (
    <Providers>
      <Navbar>{children}</Navbar>
    </Providers>
  );

  return (
    <html lang='en' data-theme='emerald'>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>Welcome to MyApp !</title>
        <meta name='description' content='Welcome to MyApp !' />
        <link rel='icon' href='/favicon.ico' />
      </head>
      <body className={poppins.variable}>{body}</body>
    </html>
  );
}

// export const metadata = {
//   title: 'MyApp',
//   description: 'Welcome to MyApp',
// };
