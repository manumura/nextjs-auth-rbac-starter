'use client';

import FormInput from '@/components/FormInput';
import { clearStorage, saveIdToken } from '@/lib/storage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { loginAction } from '../../lib/actions';
import useUserStore from '../../lib/user-store';

export function LoginButton({ isValid }): React.ReactElement {
  const { pending } = useFormStatus();
  const btn = <button className='w-full btn btn-primary'>Login</button>;
  const btnDisabled = <button className='w-full btn btn-disabled btn-primary'>Login</button>;
  const btnLoading = (
    <button className='w-full btn btn-disabled btn-primary'>
      <span className='loading loading-spinner'></span>
      Login
    </button>
  );

  return !isValid ? btnDisabled : (pending ? btnLoading : btn);
}

export default function LoginPage({ error }): React.ReactElement {
  const router = useRouter();
  const initialState = {
    message: '',
    error: false,
    user: null,
    idToken: null,
  };
  const [state, formAction] = useFormState(
    loginAction,
    initialState,
  );
  const methods = useForm();
  const {
    formState: { isValid },
  } = methods;
  const userStore = useUserStore();

  useEffect(() => {
    // Handle access token expired
    if (error === '401') {
      clearStorage();
      userStore.setUser(undefined);
      toast('Session expired, please login again.', {
        type: 'error',
        position: 'top-center',
        toastId: '401',
      });
    }

    if (error === '404') {
      toast('Not Found!', {
        type: 'error',
        position: 'top-center',
        toastId: '404',
      });
    }
  }, [error]);

  useEffect(() => {
    if (state?.message) {
      toast(state.message, {
        type: state.error ? 'error' : 'success',
        position: 'top-center',
      });

      if (!state?.error) {
        userStore.setUser(state?.user);
        saveIdToken(state?.idToken);
        router.replace('/');
      }
    }
  }, [state, router]);

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
            action={formAction}
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
            <LoginButton isValid={isValid} />
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
