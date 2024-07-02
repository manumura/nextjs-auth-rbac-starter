'use client';

import FormInput from '@/components/FormInput';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { forgotPassword } from '../../lib/api';
import { validateCaptcha } from '../../lib/captcha.utils';

export function SubmitButton({ isValid, isLoading }): React.ReactElement {
  const btn = <button className='w-full btn btn-primary'>Submit</button>;
  const btnDisabled = <button className='w-full btn btn-disabled btn-primary'>Submit</button>;
  const btnLoading = (
    <button className='w-full btn btn-disabled btn-primary'>
      <span className='loading loading-spinner'></span> 
      Submit
    </button>
  );

  return !isValid ? btnDisabled : (isLoading ? btnLoading : btn);
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

  const mutation = useMutation({
    mutationFn: ({ email }: { email: string; }) =>
      forgotPassword(email),
    async onSuccess(response, variables, context) {
      const data = response.data;
      toast('Please follow the link sent by email', {
        type: 'success',
        position: 'top-right',
      });

      router.push('/');
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

    mutation.mutate({ email: data.email });
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

            <SubmitButton isValid={isValid} isLoading={loading || mutation.isPending} />
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
