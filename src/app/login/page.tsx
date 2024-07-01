'use client';

import LoginPage from './login-page';

export default function Login({searchParams}) {
  return <LoginPage error={searchParams.error} />;
}
