import { cookies } from 'next/headers';
import DrawerLayout from '../components/DrawerLayout';
import { getUserFromIdToken } from '../lib/jwt.utils';
import { IUser } from '../lib/user-store';
import '../styles/globals.css';

// To avoid tailwind to purge toastify styles
import 'react-toastify/dist/ReactToastify.min.css';

async function getProfile(): Promise<IUser | undefined> {
  const cookieStore = cookies();
  const idTokenCookie = cookieStore.get('idToken');
  if (!idTokenCookie?.value) {
    console.error('No idToken cookie found');
    return undefined;
  }

  const user = await getUserFromIdToken(idTokenCookie?.value);
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

  return (
    <html lang='en' data-theme='emerald'>
      <body>
        <DrawerLayout user={user}>{children}</DrawerLayout>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'MyApp',
  description: 'Welcome to MyApp',
};
