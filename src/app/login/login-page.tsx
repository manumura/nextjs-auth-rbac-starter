'use client';

import FormInput from '@/components/FormInput';
import { clearAuthentication, saveAuthentication, saveIdToken } from '@/lib/storage';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { login, validateRecaptcha } from '../../lib/api';
import { getUserFromIdToken } from '../../lib/jwt.utils';
import useUserStore from '../../lib/user-store';
import { IUser } from '../../types/custom-types';

export function LoginButton({ isValid, isLoading }): React.ReactElement {
  const btn = <button className='btn btn-primary w-full'>Login</button>;
  const btnDisabled = (
    <button className='btn btn-disabled btn-primary w-full'>Login</button>
  );
  const btnLoading = (
    <button className='btn btn-disabled btn-primary w-full'>
      <span className='loading loading-spinner'></span>
      Login
    </button>
  );

  return !isValid ? btnDisabled : (isLoading ? btnLoading : btn);
}

export default function LoginPage({ error }): React.ReactElement {
  const router = useRouter();
  const userStore = useUserStore();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const methods = useForm({
    mode: 'all',
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful, isValid },
  } = methods;

  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => onMutate(email, password),
    onSuccess(user, variables, context) {
      userStore.setUser(user);

      toast(`Welcome ${user?.name}!`, {
        type: 'success',
        position: 'bottom-right',
      });

      router.replace('/');
    },
    onError(error, variables, context) {
      toast(error?.message, {
        type: 'error',
        position: 'bottom-right',
      });
    },
  });

  const onMutate = async (email, password): Promise<IUser> => {
    if (!executeRecaptcha) {
      throw new Error('Recaptcha not loaded');
    }
    const token = await executeRecaptcha('onSubmit');
    const isCaptchaValid = await validateRecaptcha(token);
    if (!isCaptchaValid) {
      throw new Error('Captcha validation failed');
    }
    const response = await login(email, password);
    if (!response || response.status !== 200) {
      throw new Error('Invalid response');
    }

    const { accessToken, refreshToken, idToken } = response.data;
    if (!idToken || !accessToken || !refreshToken) {
      throw new Error('Invalid response');
    }

    saveAuthentication(accessToken, refreshToken, idToken);
    const user = await getUserFromIdToken(idToken);
    if (!user) {
      throw new Error('Invalid user');
    }

    return user;
  };

  const onSubmit = async (formData) => {
    if (!formData) {
      return;
    }

    mutation.mutate(formData);
  };

  useEffect(() => {
    // Handle access token expired
    if (error === '401') {
      clearAuthentication();
      userStore.setUser(null);
      toast('Session expired, please login again.', {
        type: 'error',
        position: 'bottom-right',
        toastId: '401',
      });
    }

    if (error === '404') {
      toast('Not Found!', {
        type: 'error',
        position: 'bottom-right',
        toastId: '404',
      });
    }
  }, [error]);

  const emailConstraints = {
    required: { value: true, message: 'Email is required' },
  };
  const passwordConstraints = {
    required: { value: true, message: 'Password is required' },
  };

  return (
    <section className='h-section bg-slate-200 py-20'>
      <div className='w-full'>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='mx-auto w-full max-w-md space-y-5 overflow-hidden rounded-2xl bg-slate-50 p-8 shadow-lg'
          >
            <h1 className='mb-4 text-center text-4xl font-[600]'>
              Login to MyApp
            </h1>
            <FormInput
              label='Email'
              name='email'
              type='email'
              constraints={emailConstraints}
            />
            <FormInput
              label='Password'
              name='password'
              type='password'
              constraints={passwordConstraints}
            />

            <div className='text-right'>
              <Link href='/forgot-password' className='text-secondary'>
                Forgot Password?
              </Link>
            </div>

            <LoginButton isValid={isValid} isLoading={mutation.isPending} />
            <span className='block'>
              Need an account?{' '}
              <Link href='/register' className='text-secondary'>
                Sign Up Here
              </Link>
            </span>
          </form>
        </FormProvider>
      </div>
    </section>
  );
}
