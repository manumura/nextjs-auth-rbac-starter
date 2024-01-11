import { unstable_noStore } from 'next/cache';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { URLSearchParams } from 'url';
import LoadingOverlay from '../../components/LoadingOverlay';
import appConfig from '../../config/config';
import { IUser } from '../../lib/user-store';
import UsersPage from './users-page';

type IGetUsersResponse = {
  users: IUser[];
  totalElements: number;
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
    cache: 'no-cache',
  });

  if (!res.ok) {
    console.error(`Get Users getServerSideProps error: ${res.statusText}`);
    return { users: [], totalElements: 0 };
  }

  const json = await res.json();
  const users = json.elements;
  const totalElements = json.totalElements;
  return { users, totalElements };
}

async function Users({ searchParams }) {
  // Fetch data directly in a Server Component
  const page = searchParams?.page || 1;
  const pageSize = appConfig.defaultRowsPerPage;
  // TODO filter by role
  const role = undefined;

  const { users, totalElements } = await getUsers(page, pageSize, role);

  // Forward fetched data to your Client Component
  return (
    <UsersPage
      users={users}
      totalElements={totalElements}
      page={page}
      pageSize={pageSize}
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
