import { UUID } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import appConfig from '../../../config/config';
import { IUser } from '../../../lib/user-store';
import EditUserPage from './edit-user-page';

async function getUserByUuid(uuid: UUID): Promise<IUser | undefined> {
  const BASE_URL = appConfig.baseUrl;
  const cookieStore = cookies();

  const res = await fetch(`${BASE_URL}/api/v1/users/${uuid}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Cookie: cookieStore as any,
    },
    cache: 'no-cache',
  });

  if (!res.ok) {
    console.error(`Edit User getServerSideProps error: ${res.statusText}`);
    return undefined;
  }

  const json = await res.json();
  return json;
}

export default async function EditUser({ params }): Promise<JSX.Element> {
  // Fetch data directly in a Server Component
  const user = await getUserByUuid(params?.uuid);
  if (!user) {
    redirect('/users');
  }

  // Forward fetched data to your Client Component
  return <EditUserPage user={user} />;
}
