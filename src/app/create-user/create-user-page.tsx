'use client';

import FormInput from '@/components/FormInput';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import FormSelect from '../../components/FormSelect';
import { createUserAction } from '../../lib/actions';

export function SaveButton({ isValid }): React.ReactElement {
  const { pending } = useFormStatus();
  const btn = <button className='btn btn-primary mx-1'>Save</button>;
  const btnDisabled = <button className='btn btn-disabled btn-primary mx-1'>Save</button>;
  const btnLoading = (
    <button className='btn btn-disabled btn-primary mx-1'>
      <span className='loading loading-spinner'></span>
      Save
    </button>
  );

  return !isValid ? btnDisabled : (pending ? btnLoading : btn);
}

export default function CreateUserPage(): React.ReactElement {
  const router = useRouter();
  const initialState = {
    message: '',
    error: false,
  };
  const [state, formAction] = useFormState(
    createUserAction,
    initialState,
  );
  const methods = useForm({
    mode: 'all',
  });

  const {
    formState: { isValid },
  } = methods;

  useEffect(() => {
    if (state?.message) {
      toast(state.message, {
        type: state.error ? 'error' : 'success',
        position: 'top-right',
      });

      if (!state.error) {
        router.replace('/users');
      }
    }
  }, [state, router]);

  const onCancel = (): void => {
    router.back();
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
  const roleConstraints = {
    required: { value: true, message: 'Role is required' },
  };

  const roles = [
    { label: '--- Please select a role ---', value: '' },
    { label: 'Admin', value: 'ADMIN' },
    { label: 'User', value: 'USER' },
  ];

  return (
    <section className='h-section bg-slate-200 py-20'>
      <div className='w-full'>
        <FormProvider {...methods}>
          <form
            action={formAction}
            className='mx-auto w-full max-w-md space-y-5 overflow-hidden rounded-2xl bg-slate-50 p-8 shadow-lg'
          >
            <h2 className='mb-4 text-center text-2xl font-[600]'>
              Create a new user
            </h2>
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
            <FormSelect
              label='Role'
              name='role'
              options={roles}
              constraints={roleConstraints}
            />
            <div className='flex justify-center space-x-5'>
              <SaveButton isValid={isValid} />
              <button
                type='button'
                id='btn-cancel'
                className='btn-outline btn mx-1'
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
}
