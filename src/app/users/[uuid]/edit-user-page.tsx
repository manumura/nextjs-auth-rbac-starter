'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import FormInput from '../../../components/FormInput';
import FormSelect from '../../../components/FormSelect';
import { updateUser } from '../../../lib/api';
import { IUser } from '../../../types/custom-types';

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

  return !isValid ? btnDisabled : isLoading ? btnLoading : btn;
}

export default function EditUserPage({ user }): React.ReactElement {
  const router = useRouter();
  // Get QueryClient from the context
  const queryClient = useQueryClient();
  const methods = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      password: '',
      passwordConfirm: '',
      role: user.role,
    },
    mode: 'all',
  });
  const {
    watch,
    handleSubmit,
    formState: { isValid, errors },
    setError,
  } = methods;

  const mutation = useMutation({
    mutationFn: ({
      uuid,
      name,
      email,
      role,
      password,
    }: {
      uuid: UUID;
      name: string;
      email: string;
      role: string;
      password: string;
    }) => onMutate(uuid, name, email, role, password),
    async onSuccess(userUpdated, variables, context) {
      toast(`User updated successfully ${userUpdated?.name}!`, {
        type: 'success',
        position: 'top-right',
      });

      await queryClient.invalidateQueries({ queryKey: ['userByUuid', user.uuid] });
      router.back();
    },
    onError(error, variables, context) {
      toast(error?.message, {
        type: 'error',
        position: 'top-right',
      });
    },
  });

  const onMutate = async (
    uuid,
    name,
    email,
    role,
    password,
  ): Promise<IUser> => {
    const response = await updateUser(uuid, name, email, role, password);
    if (response.status !== 200) {
      throw new Error('User update failed');
    }
    const user = response.data;
    return user;
  };

  const onSubmit = async (formData): Promise<void> => {
    if (!formData || !user) {
      return;
    }

    mutation.mutate({
      uuid: user.uuid,
      email: formData.email,
      name: formData.name,
      role: formData.role,
      password: formData.password,
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
    pattern: {
      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      message: 'Email address is invalid',
    },
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
  );

  return <section className='h-section bg-slate-200'>{editUserForm}</section>;
}
