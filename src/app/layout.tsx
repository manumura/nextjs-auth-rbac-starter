import { cookies } from 'next/headers';
import DrawerLayout from '../components/DrawerLayout';
import { Providers } from '../components/Providers';
import { getUserFromIdToken } from '../lib/jwt.utils';
import { IUser } from '../lib/user-store';
import '../styles/globals.css';

// To avoid tailwind to purge toastify styles
import 'react-toastify/dist/ReactToastify.min.css';

// Fix for Error: connect ECONNREFUSED ::1:9002 on localhost with node > 16
import dns from 'node:dns';
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

  return (
    <html lang='en' data-theme='emerald'>
      <body>
        <Providers>
          <DrawerLayout user={user}>{children}</DrawerLayout>
        </Providers>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'MyApp',
  description: 'Welcome to MyApp',
};
