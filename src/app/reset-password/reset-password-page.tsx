'use client';

import FormInput from '@/components/FormInput';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { resetPasswordAction } from '../../lib/actions';

export function SubmitButton({ isValid, loading }): React.ReactElement {
  const btn = <button className='w-full btn btn-primary'>Submit</button>;
  const btnDisabled = <button className='w-full btn btn-disabled btn-primary'>Submit</button>;
  const btnLoading = (
    <button className='w-full btn btn-disabled btn-primary'>
      <span className='loading loading-spinner'></span> 
      Submit
    </button>
  );

  return !isValid ? btnDisabled : (loading ? btnLoading : btn);
}

export default function ResetPasswordPage({ token }): React.ReactElement {
  const router = useRouter();
  const methods = useForm();
  const [loading, setLoading] = useState(false);

  const {
    watch,
    handleSubmit,
    formState: { isValid },
  } = methods;

  const onSubmit = async (data): Promise<void> => {
    if (!data || loading) {
      return;
    }

    const formData = new FormData();
    formData.append('token', token);
    formData.append('password', data.password);

    setLoading(true);
    const state = await resetPasswordAction(null, formData);
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
              Reset password
            </h1>
            <FormInput
              label='New Password'
              name='password'
              type='password'
              constraints={passwordConstraints}
            />
            <FormInput
              label='Confirm New Password'
              name='passwordConfirm'
              type='password'
              constraints={passwordConfirmConstraints}
            />

            <SubmitButton isValid={isValid} loading={loading} />
            <div className='text-center'>
              <Link href='/' className='text-secondary'>
                Cancel
              </Link>
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
}
