import { cookies, headers } from 'next/headers';
import { Suspense } from 'react';
import { URLSearchParams } from 'url';
import LoadingOverlay from '../../components/LoadingOverlay';
import appConfig from '../../config/config';
import { getClientBaseUrl, sleep } from '../../lib/utils';
import UsersPage from './users-page';
import { IUser } from '../../lib/user-store';

type IGetUsersResponse = {
  users: IUser[];
  totalElements: number;
};

async function getUsers(page, pageSize, role): Promise<IGetUsersResponse> {
  const baseUrl = getClientBaseUrl(headers());
  const cookieStore = cookies();
  const params = new URLSearchParams({
    ...(page ? { page } : {}),
    ...(pageSize ? { pageSize } : {}),
    ...(role ? { role } : {}),
  });

  // TODO remove this
  await sleep(1000);
  const res = await fetch(`${baseUrl}/api/users?` + params, {
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

export default async function Users({ searchParams }) {
  // Fetch data directly in a Server Component
  const page = searchParams?.page || 1;
  const pageSize = appConfig.defaultRowsPerPage;
  // TODO filter by role
  const role = undefined;

  const { users, totalElements } = await getUsers(page, pageSize, role);

  // Forward fetched data to your Client Component
  return (
    <Suspense fallback={<LoadingOverlay label='Loading...' />}>
      <UsersPage
        users={users}
        totalElements={totalElements}
        page={page}
        pageSize={pageSize}
      />
    </Suspense>
  );
}
