'use client';

import FormInput from '@/components/FormInput';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { resetPassword } from '../../lib/api';
import { AxiosResponse } from 'axios';
import { IUser } from '../../types/custom-types';

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

export default function ResetPasswordPage({ token }): React.ReactElement {
  const router = useRouter();
  const methods = useForm();

  const {
    watch,
    handleSubmit,
    formState: { isValid },
  } = methods;

  const mutation = useMutation({
    mutationFn: ({ password, token }: { password: string; token: string; }) =>
      onMutate(password, token),
    async onSuccess(user, variables, context) {
      toast('Password successfully updated!', {
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

  const onMutate = async (password, token): Promise<IUser> => {
    let response: AxiosResponse<IUser>;
    try {
      response = await resetPassword(password, token);
    } catch (error) {
      if (error?.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message);
    }

    if (response.status !== 200) {
      throw new Error('Reset password failed');
    }
    const user = response.data;
    return user;
  };

  const onSubmit = async (formData): Promise<void> => {
    if (!formData) {
      return;
    }

    mutation.mutate({ password: formData.password, token });
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

            <SubmitButton isValid={isValid} isLoading={mutation.isPending} />
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
