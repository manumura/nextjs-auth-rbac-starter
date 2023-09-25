import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { IUser } from '../../lib/user-store';
import { getClientBaseUrl } from '../../lib/utils';
import ProfilePage from './profile-page';

async function getProfile(): Promise<IUser | undefined> {
  const baseUrl = getClientBaseUrl(headers());
  const cookieStore = cookies();

  const res = await fetch(`${baseUrl}/api/profile`, {
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
