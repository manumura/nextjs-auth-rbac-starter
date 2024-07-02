'use client';

import FormInput from '@/components/FormInput';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { registerAction } from '../../lib/actions';
import { useMutation } from '@tanstack/react-query';
import { register } from '../../lib/api';
import { validateCaptcha } from '../../lib/captcha.utils';

export function RegisterButton({ isValid, isLoading }): React.ReactElement {
  const btn = <button className='w-full btn btn-primary'>Register</button>;
  const btnDisabled = <button className='w-full btn btn-disabled btn-primary'>Register</button>;
  const btnLoading = (
    <button className='w-full btn btn-disabled btn-primary'>
      <span className='loading loading-spinner'></span> 
      Register
    </button>
  );

  return !isValid ? btnDisabled : (isLoading ? btnLoading : btn);
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

  const mutation = useMutation({
    mutationFn: ({ email, password, name }: { email: string; password: string, name: string }) =>
      register(email, password, name),
    async onSuccess(response, variables, context) {
      const user = response.data;
      toast(`Registration successful ${user?.name}!`, {
        type: 'success',
        position: 'top-right',
      });

      router.push('/login');
    },
    onError(error, variables, context) {
      toast(error?.message, {
        type: 'error',
        position: 'top-right',
      });
    },
  });

  const onSubmit = async (data): Promise<void> => {
    if (!data || loading || !executeRecaptcha) {
      return;
    }

    setLoading(true);
    const token = await executeRecaptcha('onSubmit');
    const isCaptchaValid = await validateCaptcha(token);
    setLoading(false);

    if (!isCaptchaValid) {
      console.error('Captcha validation failed');
      return;
    }

    mutation.mutate({ email: data.email, password: data.password, name: data.name });
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
            <RegisterButton isValid={isValid} isLoading={loading || mutation.isPending} />
          </form>
        </FormProvider>
      </div>
    </section>
  );
}
