'use client';

import FormInput from '@/components/FormInput';
import { clearAuthentication, saveIdToken } from '@/lib/storage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { LoginState, loginAction } from '../../lib/actions';
import { LoginResponse } from '../../types/LoginResponse';

export function LoginButton({ isValid }): React.ReactElement {
  const { pending } = useFormStatus();
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

  return !isValid ? btnDisabled : pending ? btnLoading : btn;
}

const initialState: LoginState = {
  message: '',
  error: false,
  user: undefined,
  idToken: undefined,
};

export default function LoginPage({ error }): React.ReactElement {
  const router = useRouter();
  // const userStore = useUserStore();
  const [state, formAction] = useFormState(loginAction, initialState);
  const methods = useForm({
    mode: 'all',
  });
  const {
    formState: { isValid },
  } = methods;

  if (state?.message) {
    toast(state.message, {
      type: state.error ? 'error' : 'success',
      position: 'top-center',
    });

    if (state?.user) {
      // userStore.setUser(state?.user);
      saveIdToken(state?.idToken);
      router.replace('/');
    }
  }

  // useEffect(() => {
  //   console.log('login state', state);
  //   if (state?.message) {
  //     toast(state.message, {
  //       type: state.error ? 'error' : 'success',
  //       position: 'top-center',
  //     });

  //     if (state?.user) {
  //       // userStore.setUser(state?.user);
  //       saveIdToken(state?.idToken);
  //       router.replace('/');
  //     }
  //   }
  // }, [state, router]);

  useEffect(() => {
    // Handle access token expired
    if (error === '401') {
      clearAuthentication();
      // userStore.setUser(undefined);
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
