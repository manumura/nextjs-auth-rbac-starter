'use client';

import FormInput from '@/components/FormInput';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { forgotPassword } from '../../lib/api';
import { sleep } from '../../lib/utils';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const methods = useForm();
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmit = async (data): Promise<void> => {
    if (!data || loading) {
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(data.email);
      // const response = res?.data;

      toast(`Success! Please check the email sent at ${data.email}`, {
        type: 'success',
        position: 'top-center',
      });
      router.push('/');
    } catch (error) {
      toast(
        `An error occured, please try again:  ${error?.response?.data?.message}`,
        {
          type: 'error',
          position: 'top-center',
        },
      );
    } finally {
      setLoading(false);
    }
  };

  const emailConstraints = {
    required: { value: true, message: 'Email is required' },
  };
  const btn = <button className='w-full btn'>Submit</button>;
  const btnLoading = (
    <button className='w-full btn btn-disabled'>
      <span className='loading loading-spinner'></span>
      Submit
    </button>
  );

  return (
    <section className='h-section bg-slate-200 py-20'>
      <div className='w-full'>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='mx-auto w-full max-w-md space-y-5 overflow-hidden rounded-2xl bg-slate-50 p-8 shadow-lg'
          >
            <h1 className='mb-4 text-center text-4xl font-[600]'>
              Forgot password?
            </h1>
            <FormInput
              label='Email'
              name='email'
              type='email'
              constraints={emailConstraints}
            />

            <div>{loading ? btnLoading : btn}</div>
            <div className='text-center'>
              <Link href='/login' className='text-secondary'>
                Cancel
              </Link>
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
}
