'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingOverlay from '../../../../components/LoadingOverlay';
import { appMessages } from '../../../../config/constant';
import { getUserFromIdToken } from '../../../../lib/jwt.utils';
import useMessageStore from '../../../../lib/message-store';
import useUserStore from '../../../../lib/user-store';

export default function OauthFacebookCallback() {
  const searchParams = useSearchParams();
  const idToken = searchParams.get('id_token') ?? undefined;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleAuth() {
      console.log('Facebook OAuth callback params:', {
        idToken,
      });

      if (!idToken) {
        console.error('Missing ID token in Facebook OAuth callback.');
        setError('Login failed. Please try again.');
        return;
      }

      try {
        const user = await getUserFromIdToken(idToken);
        console.log('Facebook OAuth logged in user:', user);
        if (!user) {
          console.error('Failed to extract user from ID token.');
          setError('Login failed. Please try again.');
          return;
        }

        useUserStore.getState().setUser(user);
        const time = Date.now();

        useMessageStore.getState().setMessage({
          type: appMessages.LOGIN_SUCCESS.type,
          text: appMessages.LOGIN_SUCCESS.text.replace('${name}', user.name),
          id: time,
        });

        router.push('/');
      } catch (err) {
        console.error('Error during Facebook OAuth callback handling:', err);
        setError('Login failed. Please try again.');
      }
    }

    handleAuth();
  }, [idToken, router]);

  if (error) {
    return (
      <section className='h-section bg-slate-200'>
        <div className='flex flex-col items-center py-20'>
          <h1 className='mb-4 text-center text-4xl font-[600]'>
            An error occurred
          </h1>
          <p className='mb-4 text-center text-2xl text-red-500'>{error}</p>
          <Link href='/'>Go back home</Link>
        </div>
      </section>
    );
  }

  return <LoadingOverlay label='Logging in with Facebook...' />;
}
