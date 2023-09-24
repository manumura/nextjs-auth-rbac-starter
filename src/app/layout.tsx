import { cookies } from 'next/headers';
import { Providers } from '../components/Providers';
import { getUserFromIdToken } from '../lib/jwt.utils';
import { IUser } from '../lib/user-store';
import '../styles/globals.css';

// To avoid tailwind to purge toastify styles
import 'react-toastify/dist/ReactToastify.min.css';

// Fix for Error: connect ECONNREFUSED ::1:9002 on localhost with node > 16
import Link from 'next/link';
import dns from 'node:dns';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';
import Navbar from '../components/Navbar';
import { isAdmin } from '../lib/utils';
dns.setDefaultResultOrder('ipv4first');

async function getProfile(): Promise<IUser | undefined> {
  const cookieStore = cookies();
  const idTokenCookie = cookieStore.get('idToken');
  if (!idTokenCookie?.value) {
    console.error('No idToken cookie found');
    return undefined;
  }

  const user = await getUserFromIdToken(idTokenCookie?.value);
  console.log('user getProfile', user);
  return user;
}

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getProfile();
  console.log('user RootLayout', user);

  const navItems: JSX.Element[] = [];
  if (user) {
    if (isAdmin(user)) {
      const usersLink = (
        <Link href='/users' id="users-link" className='text-neutral'>
          Users
        </Link>
      );
      navItems.push(usersLink);
    }
    const profileLink = (
      <Link href='/profile' id="profile-link" className='text-neutral'>
        Profile
      </Link>
    );
    const logoutLink = (<LogoutButton id="logout-link" />);
    navItems.push(profileLink);
    navItems.push(logoutLink);
  } else {
    const registerLink = (
      <Link href='/register' id="register-link" className='text-neutral'>
        Register
      </Link>
    );
    const loginLink = (<LoginButton id="login-link" />);
    navItems.push(registerLink);
    navItems.push(loginLink);
  }
  console.log('navItems RootLayout', navItems);

  return (
    <html lang='en' data-theme='emerald'>
      <body>
        <Providers>
          <Navbar navItems={navItems} />
          {/* <DrawerLayout user={user}>{children}</DrawerLayout> */}
          {children}
        </Providers>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'MyApp',
  description: 'Welcome to MyApp',
};
