'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import LoadingOverlay from '../../../../components/LoadingOverlay';
import { appMessages } from '../../../../config/constant';
import { getUserFromIdToken } from '../../../../lib/jwt.utils';
import useMessageStore from '../../../../lib/message-store';
import { saveAuthentication } from '../../../../lib/storage';
import useUserStore from '../../../../lib/user-store';

export default function OauthFacebookCallback({
  searchParams,
}: {
  readonly searchParams: Promise<{
    access_token: string;
    refresh_token: string;
    id_token: string;
    expires_at: string;
    token_type: string;
  }>;
}) {
  const {
    access_token: accessToken,
    refresh_token: refreshToken,
    id_token: idToken,
    expires_at: expiresAt,
    token_type: tokenType,
  } = use(searchParams);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleAuth() {
      console.log('Facebook OAuth callback params:', {
        accessToken,
        refreshToken,
        idToken,
        expiresAt,
        tokenType,
      });

      if (!idToken || !accessToken || !refreshToken) {
        setError('Login failed. Please try again.');
        return;
      }

      try {
        const user = await getUserFromIdToken(idToken);
        if (!user) {
          setError('Login failed. Please try again.');
          return;
        }
        console.log('Facebook OAuth logged in user:', user);

        const accessTokenExpiresAt = new Date(expiresAt);
        saveAuthentication(
          accessToken,
          accessTokenExpiresAt,
          refreshToken,
          idToken,
        );
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
  }, [accessToken, refreshToken, idToken, expiresAt, tokenType, router]);

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
