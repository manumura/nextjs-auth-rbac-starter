'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import FormInput from '../../../components/FormInput';
import FormSelect from '../../../components/FormSelect';
import { updateUser } from '../../../lib/api';

export default function EditUserPage({ user }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const methods = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      password: '',
      passwordConfirm: '',
      role: user.role,
    },
  });
  const { handleSubmit, watch } = methods;

  const onSubmit = async (data): Promise<void> => {
    if (!data || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      const res = await updateUser(
        user.uuid,
        data.name,
        data.email,
        data.role,
        data.password,
      );
      const response = res?.data;

      toast(`User successfully updated: ${response.name}`, {
        type: 'success',
        position: 'top-center',
      });
      router.back();
      router.refresh();
    } catch (error) {
      toast(`Update user failed! ${error?.response?.data?.message}`, {
        type: 'error',
        position: 'top-center',
      });
    } finally {
      setSubmitting(false);
    }
  };

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
  const passwordConstraints = {
    // required: { value: true, message: 'Password is required' },
    minLength: {
      value: 8,
      message: 'Password is min 8 characters',
    },
  };
  const passwordConfirmConstraints = {
    // required: { value: true, message: 'Confirm Password is required' },
    validate: (value): string | undefined => {
      if (watch('password') !== value) {
        return 'Passwords do no match';
      }
    },
  };
  const roleConstraints = {
    required: { value: true, message: 'Role is required' },
  };

  const roles = [
    { label: '--- Please select a role ---', value: '' },
    { label: 'Admin', value: 'ADMIN' },
    { label: 'User', value: 'USER' },
  ];

  const btn = <button className='btn btn-primary mx-1'>Save</button>;
  const btnLoading = (
    <button className='btn btn-primary mx-1 btn-disabled'>
      <span className='loading loading-spinner'></span>
      Save
    </button>
  );

  const editUserForm = (
    <div className='w-full py-10'>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='mx-auto w-full max-w-md space-y-5 overflow-hidden rounded-2xl bg-slate-50 p-8 shadow-lg'
        >
          <h2 className='mb-4 text-center text-2xl font-[600]'>Edit user</h2>
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
          <FormSelect
            label='Role'
            name='role'
            options={roles}
            constraints={roleConstraints}
          />
          <div className='flex justify-center space-x-5'>
            {submitting ? btnLoading : btn}
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
  );

  return (
    <section className='h-section bg-slate-200'>
      {editUserForm}
    </section>
  );
}
