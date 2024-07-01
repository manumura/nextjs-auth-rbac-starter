'use client';

import FormInput from '@/components/FormInput';
import { clearAuthentication, saveIdToken } from '@/lib/storage';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { login } from '../../lib/api';
import { getUserFromIdToken } from '../../lib/jwt.utils';

export function LoginButton({ isValid, isPending }): React.ReactElement {
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

  return !isValid ? btnDisabled : isPending ? btnLoading : btn;
}

export default function LoginPage({ error }): React.ReactElement {
  const router = useRouter();
  // const userStore = useUserStore();

  const methods = useForm({
    mode: 'all',
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful, isValid },
  } = methods;

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    async onSuccess(response, variables, context) {
      const idToken = response.data.idToken;
      const user = await getUserFromIdToken(idToken);

      toast(`Welcome ${user?.name}!`, {
        type: 'success',
        position: 'top-right',
      });

      saveIdToken(idToken);
      router.replace('/');
    },
    onError(error, variables, context) {
      toast(error?.message, {
        type: 'error',
        position: 'top-right',
      });
    },
  });

  const onSubmit = async (formData) => {
    mutation.mutate(formData);
  };

  useEffect(() => {
    // Handle access token expired
    if (error === '401') {
      clearAuthentication();
      // userStore.setUser(undefined);
      toast('Session expired, please login again.', {
        type: 'error',
        position: 'top-right',
        toastId: '401',
      });
    }

    if (error === '404') {
      toast('Not Found!', {
        type: 'error',
        position: 'top-right',
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

            <LoginButton isValid={isValid} isPending={mutation.isPending} />
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
