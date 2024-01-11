import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import appConfig from '../../config/config';
import { IUser } from '../../lib/user-store';
import ProfilePage from './profile-page';

async function getProfile(): Promise<IUser | undefined> {
  const BASE_URL = appConfig.baseUrl;
  const cookieStore = cookies();

  const res = await fetch(`${BASE_URL}/api/v1/profile`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Cookie: cookieStore as any,
    },
    cache: 'no-cache',
  });

  if (!res.ok) {
    console.error(`Get Profile getServerSideProps error: ${res.statusText}`);
    return undefined;
  }

  const json = await res.json();
  return json;
}

export default async function Profile() {
  // Fetch data directly in a Server Component
  const user = await getProfile();
  if (!user) {
    redirect('/login?error=404');
  }

  // Forward fetched data to your Client Component
  return (
    <ProfilePage user={user} />
  );
}
