'use client';

import { useRouter } from 'next/navigation';

const LoginButton = ({ id }) => {
  const router = useRouter();

  const handleLogin = (): void => {
    router.push('/login');
  };

  const btn = (
    <button className='btn-outline btn' id={id} onClick={handleLogin}>
      Login
    </button>
  );

  return btn;
};

export default LoginButton;
