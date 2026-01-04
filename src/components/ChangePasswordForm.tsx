import { FormProvider } from 'react-hook-form';
import { validatePassword } from '../lib/utils';
import FormInput from './FormInput';

export default function ChangePasswordForm({
  changePasswordMethods,
  loading,
  onPasswordChanged,
  onCancel,
}: {
  readonly changePasswordMethods: any;
  readonly loading: boolean;
  readonly onPasswordChanged: (event: React.FormEvent<HTMLFormElement>) => void;
  readonly onCancel: () => void;
}): React.ReactElement {
  const {
    clearErrors,
    formState: { isValid: isChangePasswordValid },
    watch,
  } = changePasswordMethods;

  const oldPasswordConstraints = {
    required: { value: true, message: 'Password is required' },
  };
  const passwordConstraints = {
    required: { value: true, message: 'Password is required' },
    minLength: {
      value: 8,
      message: 'Password is min 8 characters',
    },
    maxLength: {
      value: 70,
      message: 'Password is max 70 characters',
    },
    validate: (value: string): string | undefined => {
      const { isValid, errors } = validatePassword(value);
      if (!isValid) {
        let message = '';
        if (errors.length > 0) {
          message = errors.join('\n');
        }
        return message || 'Password is invalid';
      }
      if (
        watch('newPasswordConfirm') &&
        watch('newPasswordConfirm') !== value
      ) {
        return 'Passwords do no match';
      }
      clearErrors('newPasswordConfirm');
    },
  };
  const passwordConfirmConstraints = {
    required: { value: true, message: 'Confirm Password is required' },
    validate: (value: string): string | undefined => {
      if (watch('newPassword') !== value) {
        return 'Passwords do no match';
      }
      clearErrors('newPassword');
    },
  };

  const btnChangePassword = (
    <button
      type='submit'
      name='intent'
      value='change-password'
      className='btn btn-primary'
    >
      Save
    </button>
  );
  const btnDisabled = (
    <button className='btn btn-disabled btn-primary'>Save</button>
  );
  const btnLoading = (
    <button className='btn btn-disabled w-full'>
      <span className='loading loading-spinner'></span>
      Save
    </button>
  );
  const changePasswordButton = !isChangePasswordValid
    ? btnDisabled
    : loading
      ? btnLoading
      : btnChangePassword;

  return (
    <FormProvider {...changePasswordMethods}>
      <form
        onSubmit={onPasswordChanged}
        id='change-password-form'
        className='mx-auto flex max-w-2xl flex-col items-center overflow-hidden pt-5'
      >
        <div className='card w-3/4 bg-slate-50 shadow-xl'>
          <div className='card-body'>
            <div className='card-title'>
              <h1>Change my Password</h1>
            </div>
            <FormInput
              label='Current Password'
              name='oldPassword'
              type='password'
              constraints={oldPasswordConstraints}
            />
            <FormInput
              label='New Password'
              name='newPassword'
              type='password'
              constraints={passwordConstraints}
            />
            <FormInput
              label='Confirm New Password'
              name='newPasswordConfirm'
              type='password'
              constraints={passwordConfirmConstraints}
            />
            <div className='card-actions justify-end'>
              <div>{changePasswordButton}</div>
              <div>
                <button
                  type='button'
                  className={`btn btn-outline btn-accent ${
                    loading ? 'btn-disabled' : ''
                  }`}
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
