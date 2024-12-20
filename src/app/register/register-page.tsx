'use client';

import FormInput from '@/components/FormInput';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { register, validateRecaptcha } from '../../lib/api';
import { IUser } from '../../types/custom-types';
import { AxiosError } from 'axios';
import { validatePassword } from '../../lib/utils';

export function RegisterButton({ isValid, isLoading }): React.ReactElement {
  const btn = <button className='btn btn-primary w-full'>Register</button>;
  const btnDisabled = (
    <button className='btn btn-disabled btn-primary w-full'>Register</button>
  );
  const btnLoading = (
    <button className='btn btn-disabled btn-primary w-full'>
      <span className='loading loading-spinner'></span>
      Register
    </button>
  );

  return !isValid ? btnDisabled : isLoading ? btnLoading : btn;
}

export default function RegisterPage(): React.ReactElement {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const methods = useForm({
    mode: 'all',
  });

  const {
    clearErrors,
    handleSubmit,
    formState: { isValid },
    watch,
  } = methods;

  const mutation = useMutation({
    mutationFn: ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => onMutate(email, password, name),
    async onSuccess(user, variables, context) {
      toast('Registration successful! Please follow the link sent to your email to verify your account.', {
        type: 'success',
        position: 'bottom-right',
      });

      router.push('/login');
    },
    onError(error, variables, context) {
      toast(error?.message, {
        type: 'error',
        position: 'bottom-right',
      });
    },
  });

  const onMutate = async (email, password, name): Promise<IUser> => {
    if (!executeRecaptcha) {
      throw new Error('Recaptcha not loaded');
    }
    const token = await executeRecaptcha('onSubmit');
    const isCaptchaValid = await validateRecaptcha(token);
    if (!isCaptchaValid) {
      throw new Error('Captcha validation failed');
    }

    const { isValid: isPasswordValid, message } = validatePassword(password);
    if (!isPasswordValid) {
      throw new Error(
        'Password must be at least 8 characters long, and contain at least 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character',
      );
    }

    try {
      const response = await register(email, password, name);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data.message) {
        throw new Error(error.response.data.message);
      }
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Register failed');
    }
  };

  const onSubmit = async (formData): Promise<void> => {
    if (!formData) {
      return;
    }

    mutation.mutate({
      email: formData.email,
      password: formData.password,
      name: formData.name,
    });
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
    maxLength: {
      value: 70,
      message: 'Password is max 70 characters',
    },
    validate: (value: string): string | undefined => {
      const { isValid, message } = validatePassword(value);
      if (!isValid) {
        return message || 'Password is invalid';
      }
      if (watch('passwordConfirm') && watch('passwordConfirm') !== value) {
        return 'Passwords do no match';
      }
      clearErrors("passwordConfirm");
    },
  };
  const passwordConfirmConstraints = {
    required: { value: true, message: 'Confirm Password is required' },
    validate: (value): string | undefined => {
      if (watch('password') !== value) {
        return 'Passwords do no match';
      }
      clearErrors("password");
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
            <RegisterButton isValid={isValid} isLoading={mutation.isPending} />
          </form>
        </FormProvider>
      </div>
    </section>
  );
}
