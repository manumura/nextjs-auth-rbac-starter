'use client';

import FormInput from '@/components/FormInput';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { forgotPassword, validateRecaptcha } from '../../lib/api';
import { AxiosResponse } from 'axios';
import { MessageResponse } from '../../types/custom-types';

export function SubmitButton({ isValid, isLoading }): React.ReactElement {
  const btn = <button className='btn btn-primary w-full'>Submit</button>;
  const btnDisabled = (
    <button className='btn btn-disabled btn-primary w-full'>Submit</button>
  );
  const btnLoading = (
    <button className='btn btn-disabled btn-primary w-full'>
      <span className='loading loading-spinner'></span>
      Submit
    </button>
  );

  return !isValid ? btnDisabled : (isLoading ? btnLoading : btn);
}

export default function ForgotPasswordPage(): React.ReactElement {
  const router = useRouter();
  const methods = useForm();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const mutation = useMutation({
    mutationFn: ({ email }: { email: string }) => onMutate(email),
    async onSuccess(message, variables, context) {
      toast('Please follow the link sent by email', {
        type: 'success',
        position: 'bottom-right',
      });

      router.push('/');
    },
    onError(error, variables, context) {
      toast(error?.message, {
        type: 'error',
        position: 'bottom-right',
      });
    },
  });

  const onMutate = async (email): Promise<string> => {
    if (!executeRecaptcha) {
      throw new Error('Recaptcha not loaded');
    }
    const token = await executeRecaptcha('onSubmit');
    const isCaptchaValid = await validateRecaptcha(token);
    if (!isCaptchaValid) {
      throw new Error('Captcha validation failed');
    }

    let response: AxiosResponse<MessageResponse>;
    try {
      response = await forgotPassword(email);
    } catch (error) {
      if (error?.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message);
    }
    return response.data.message;
  };

  const onSubmit = async (formData): Promise<void> => {
    if (!formData) {
      return;
    }

    mutation.mutate({ email: formData.email });
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

            <SubmitButton
              isValid={isValid}
              isLoading={mutation.isPending}
            />
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
