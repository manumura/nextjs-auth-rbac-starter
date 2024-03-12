'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import FormInput from '../../../components/FormInput';
import FormSelect from '../../../components/FormSelect';
import { updateUserAction } from '../../../lib/actions';

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

export default function EditUserPage({ user }): React.ReactElement {
  const router = useRouter();
  const updateUserActionWithUuid = updateUserAction.bind(null, user.uuid);
  const initialState = {
    message: '',
    error: false,
  };
  const [state, formAction] = useFormState(
    updateUserActionWithUuid,
    initialState,
  );
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
    formState: { isValid, errors },
    setError,
  } = methods;

  useEffect(() => {
    if (state?.message) {
      toast(state.message, {
        type: state.error ? 'error' : 'success',
        position: 'top-center',
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
          action={formAction}
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
            <SaveButton isValid={isValid} />
            <button
              type='button'
              id='btn-cancel'
              className='btn btn-outline mx-1'
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
