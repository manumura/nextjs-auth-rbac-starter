'use client';

import FormInput from '@/components/FormInput';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { forgotPasswordAction } from '../../lib/actions';

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

export default function ForgotPasswordPage(): React.ReactElement {
  const router = useRouter();
  const methods = useForm();
  const [loading, setLoading] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const {
    handleSubmit,
    formState: { isValid },
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

    setLoading(true);
    const state = await forgotPasswordAction(null, formData);
    setLoading(false);

    if (state?.message) {
      toast(state.message, {
        type: state.error ? 'error' : 'success',
        position: 'top-center',
      });
    }

    if (!state?.error) {
      router.push('/');
    }
  };

  const emailConstraints = {
    required: { value: true, message: 'Email is required' },
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
              Forgot password?
            </h1>
            <FormInput
              label='Email'
              name='email'
              type='email'
              constraints={emailConstraints}
            />

            <SubmitButton isValid={isValid} loading={loading} />
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
