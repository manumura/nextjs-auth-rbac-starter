'use client';

import FormInput from '@/components/FormInput';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import FormSelect from '../../components/FormSelect';
import { sleep } from '../../lib/utils';
import { createUser } from '../../lib/api';

export default function CreateUserPage() {
  const router = useRouter();
  const methods = useForm();
  const [loading, setLoading] = useState(false);

  const { handleSubmit } = methods;

  const onSubmit = async (data): Promise<void> => {
    if (!data || loading) {
      return;
    }

    try {
      setLoading(true);
      const res = await createUser(data.email, data.name, data.role);
      const response = res?.data;

      toast(`User successfully created: ${response.name}`, {
        type: 'success',
        position: 'top-center',
      });
      // Go back to users page and refresh the list
      router.push('/users');
      router.refresh();
    } catch (error) {
      toast(`User creation failed: ${error?.response?.data?.message}`, {
        type: 'error',
        position: 'top-center',
      });
    } finally {
      setLoading(false);
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
  const roleConstraints = {
    required: { value: true, message: 'Role is required' },
  };

  const roles = [
    { label: '--- Please select a role ---', value: '' },
    { label: 'Admin', value: 'ADMIN' },
    { label: 'User', value: 'USER' },
  ];

  const btn = <button className='btn btn-primary mx-1'>Create</button>;
  const btnLoading = (
    <button className='btn btn-primary mx-1 btn-disabled'>
      <span className='loading loading-spinner'></span>
      Create
    </button>
  );

  const onCancel = (): void => {
    router.back();
  };

  return (
    <section className='h-section bg-slate-200 py-20'>
      <div className='w-full'>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
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
              {loading ? btnLoading : btn}
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
