'use client';

import FormInput from '@/components/FormInput';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import FormSelect from '../../components/FormSelect';
import { createUser } from '../../lib/api';
import { IUser } from '../../types/custom-types';

export function SaveButton({ isValid, isLoading }): React.ReactElement {
  const btn = <button className='btn btn-primary mx-1'>Save</button>;
  const btnDisabled = (
    <button className='btn btn-disabled btn-primary mx-1'>Save</button>
  );
  const btnLoading = (
    <button className='btn btn-disabled btn-primary mx-1'>
      <span className='loading loading-spinner'></span>
      Save
    </button>
  );

  return !isValid ? btnDisabled : (isLoading ? btnLoading : btn);
}

export default function CreateUserPage(): React.ReactElement {
  const router = useRouter();
  const methods = useForm({
    mode: 'all',
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const mutation = useMutation({
    mutationFn: ({
      email,
      name,
      role,
    }: {
      email: string;
      name: string;
      role: string;
    }) => onMutate(email, name, role),
    async onSuccess(user, variables, context) {
      toast(`User created successfully ${user?.name}`, {
        type: 'success',
        position: 'top-right',
      });

      router.replace('/users');
    },
    onError(error, variables, context) {
      toast(error?.message, {
        type: 'error',
        position: 'top-right',
      });
    },
  });

  const onMutate = async (email, name, role): Promise<IUser> => {
    const response = await createUser(email, name, role);
    if (response.status !== 201) {
      throw new Error('User creation failed');
    }
    const user = response.data;
    return user;
  };

  const onSubmit = async (formData): Promise<void> => {
    if (!formData) {
      return;
    }

    mutation.mutate({
      email: formData.email,
      name: formData.name,
      role: formData.role,
    });
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
              <SaveButton isValid={isValid} isLoading={mutation.isPending} />
              <button
                type='button'
                id='btn-cancel'
                className={`btn btn-outline mx-1 ${
                  mutation.isPending ? 'btn-disabled' : ''
                }`}
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
