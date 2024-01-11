import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import appConfig from '../../config/config';
import { IUser } from '../../lib/user-store';
import ResetPasswordPage from './reset-password-page';

async function isAuthenticated(): Promise<boolean> {
  // Redirect if user is authenticated
  const accessToken = cookies().get('accessToken')?.value;
  return !!accessToken;
}

async function getUserByToken(token): Promise<IUser | undefined> {
  const BASE_URL = appConfig.baseUrl;
  const res = await fetch(`${BASE_URL}/api/v1/token/${token}`, {
    method: 'GET',
  });

  if (!res.ok) {
    console.error(`Reset password getServerSideProps error: ${res.statusText}`);
    return undefined;
  }

  const json = await res.json();
  return json;
}

export default async function ResetPassword({ searchParams }) {
  // Fetch data directly in a Server Component
  const isAuth = await isAuthenticated();
  if (isAuth) {
    redirect('/');
  }

  if (!searchParams?.token) {
    redirect('/login?error=404');
  }

  const user = await getUserByToken(searchParams?.token);
  if (!user) {
    redirect('/login?error=404');
  }

  // Forward fetched data to your Client Component
  return <ResetPasswordPage token={searchParams?.token} />;
}
