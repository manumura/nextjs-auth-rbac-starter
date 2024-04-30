'use client';

import FormInput from '@/components/FormInput';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { registerAction } from '../../lib/actions';

export function RegisterButton({ isValid, loading }): React.ReactElement {
  const btn = <button className='w-full btn btn-primary'>Register</button>;
  const btnDisabled = <button className='w-full btn btn-disabled btn-primary'>Register</button>;
  const btnLoading = (
    <button className='w-full btn btn-disabled btn-primary'>
      <span className='loading loading-spinner'></span> 
      Register
    </button>
  );

  return !isValid ? btnDisabled : (loading ? btnLoading : btn);
}

export default function RegisterPage(): React.ReactElement {
  const router = useRouter();
  const methods = useForm({
    mode: 'all',
  });
  const [loading, setLoading] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const {
    handleSubmit,
    formState: { isValid },
    watch,
  } = methods;

  const onSubmit = async (data): Promise<void> => {
    if (!data || loading || !executeRecaptcha) {
      return;
    }

    const token = await executeRecaptcha('onSubmit');

    const formData = new FormData();
    formData.append('token', token);
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);

    setLoading(true);
    const state = await registerAction(null, formData);
    setLoading(false);
    
    if (state?.message) {
      toast(state.message, {
        type: state.error ? 'error' : 'success',
        position: 'top-right',
      });
    }

    if (!state?.error) {
      router.push('/login');
    }
  };

  const nameConstraints = {
    required: { value: true, message: 'Full Name is required' },
    minLength: {
      value: 5,
      message: 'Full Name is min 5 characters',
    },
  };
  const emailConstraints = {
    required: { value: true, message: 'Email is required' },
  };
  const passwordConstraints = {
    required: { value: true, message: 'Password is required' },
    minLength: {
      value: 8,
      message: 'Password is min 8 characters',
    },
  };
  const passwordConfirmConstraints = {
    required: { value: true, message: 'Confirm Password is required' },
    validate: (value): string | undefined => {
      if (watch('password') !== value) {
        return 'Passwords do no match';
      }
    },
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
              Register to MyApp!
            </h1>
            <FormInput
              label='Full Name'
              name='name'
              constraints={nameConstraints}
            />
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
            <FormInput
              label='Confirm Password'
              name='passwordConfirm'
              type='password'
              constraints={passwordConfirmConstraints}
            />
            <span className='block'>
              Already have an account?{' '}
              <Link href='/login' className='text-secondary'>
                Login Here
              </Link>
            </span>
            <RegisterButton isValid={isValid} loading={loading} />
          </form>
        </FormProvider>
      </div>
    </section>
  );
}
