import { unstable_noStore } from 'next/cache';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { URLSearchParams } from 'url';
import LoadingOverlay from '../../components/LoadingOverlay';
import appConfig from '../../config/config';
import { IUser } from '../../lib/user-store';
import UsersPage from './users-page';
import { getUserFromIdToken } from '../../lib/jwt.utils';

type IGetUsersResponse = {
  users: IUser[];
  totalElements: number;
  currentUser: IUser | undefined;
};

async function getUsers(page, pageSize, role): Promise<IGetUsersResponse> {
  unstable_noStore(); // Disable SWR caching

  const BASE_URL = appConfig.baseUrl;
  const cookieStore = cookies();
  const params = new URLSearchParams({
    ...(page ? { page } : {}),
    ...(pageSize ? { pageSize } : {}),
    ...(role ? { role } : {}),
  });

  const res = await fetch(`${BASE_URL}/api/v1/users?` + params, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Cookie: cookieStore as any,
    },
    cache: 'no-store',
    // next: { revalidate: 0 },
  });

  if (!res.ok) {
    console.error(`Get Users getServerSideProps error: ${res.statusText}`);
    return { users: [], totalElements: 0, currentUser: undefined};
  }

  const json = await res.json();
  const users = json.elements;
  const totalElements = json.totalElements;

  let currentUser;
  const idTokenCookie = cookieStore.get('idToken');
  if (idTokenCookie?.value) {
    currentUser = await getUserFromIdToken(idTokenCookie.value);
  }
  
  return { users, totalElements, currentUser };
}

async function Users({ searchParams }) {
  // Fetch data directly in a Server Component
  const page = searchParams?.page || 1;
  const pageSize = appConfig.defaultRowsPerPage;
  // TODO filter by role
  const role = undefined;

  const { users, totalElements, currentUser } = await getUsers(page, pageSize, role);

  // Forward fetched data to your Client Component
  return (
    <UsersPage
      users={users}
      totalElements={totalElements}
      page={page}
      pageSize={pageSize}
      currentUser={currentUser}
    />
  );
}

export default async function Page({ searchParams }) {
  return (
    <Suspense fallback={<LoadingOverlay label='Loading...' />}>
      <Users searchParams={searchParams} />
    </Suspense>
  );
}
