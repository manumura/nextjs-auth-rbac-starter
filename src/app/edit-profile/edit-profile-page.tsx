'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import DropBox from '../../components/DropBox';
import FormInput from '../../components/FormInput';
import { updatePassword, updateProfile, updateProfileImage } from '../../lib/api';

// Disable SWR caching on this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function EditProfilePage({ user }) {
  const router = useRouter();
  const [images, setImages] = useState([] as any[]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((file, index) => {
      const reader = new FileReader();

      reader.onabort = (): void => console.log('file reading was aborted');
      reader.onerror = (): void => console.error('file reading has failed');
      // reader.onprogress = (e) => console.log('file reading in progress ', e);
      reader.onload = (): void => {
        // Do whatever you want with the file contents
        // const binaryStr = reader.result;
        // console.log(binaryStr);
        setImages([...images, file]);
      };

      reader.readAsDataURL(file);
      return file;
    });
  }, [images]);
  const onUploadProgress = (progressEvent): void => {
    const { loaded, total } = progressEvent;
    if (progressEvent.bytes) {
      const progress = Math.round((loaded / total) * 100);
      setUploadProgress(progress);
    }
  };

  const [loading, setLoading] = useState(false);

  const handleCancel = (): void => {
    router.back();
  };

  //----------------- Edit Profile -------------------
  const editProfileMethods = useForm({
    defaultValues: {
      name: user.name,
    },
  });

  const {
    handleSubmit: handleEditProfile,
    formState: { isValid: isEditProfileValid },
    // watch,
    setError: setEditProfileError,
  } = editProfileMethods;

  const onProfileEdited = async (data): Promise<void> => {
    if (loading) {
      return;
    }

    if (!data?.name && images.length <= 0) {
      setEditProfileError('name', { message: 'Please edit at least 1 field' });
      // setError('password', { message: 'Please edit at least 1 field' });
      return;
    }

    try {
      setLoading(true);
      let success = true;

      const res = await updateProfile(data.name);
      if (res.status !== 200) {
        success = false;
      } else {
        // Upload profile image
        if (images.length > 0) {
          console.log('Uploading image');
          const formData = new FormData();
          formData.append('image', images[0]);

          const uploadRes = await updateProfileImage(
            formData,
            onUploadProgress,
          );
          if (uploadRes.status !== 200) {
            success = false;
          }
        }
      }

      if (success) {
        toast('Profile successfully updated!', {
          type: 'success',
          position: 'top-right',
        });
        router.push('/profile');
        router.refresh();
      } else {
        toast('Profile update failed!', {
          type: 'error',
          position: 'top-right',
        });
      }
    } catch (error) {
      toast(`Profile update failed!  ${error?.response?.data?.message}`, {
        type: 'error',
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };
  // ------------------------------------------------

   //----------------- Change Password -------------------
  const changePasswordMethods = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
  });

  const {
    handleSubmit: handleChangePassword,
    formState: { isValid: isChangePasswordValid, errors },
    watch,
    setError: setChangePasswordError,
  } = changePasswordMethods;

  const onPasswordChanged = async (data): Promise<void> => {
    if (loading) {
      return;
    }

    if (!data?.oldPassword || !data?.newPassword) {
      setChangePasswordError('oldPassword', { message: 'Please enter current and new password' });
      setChangePasswordError('newPassword', { message: 'Please enter current and new password' });
      return;
    }

    try {
      setLoading(true);
      const res = await updatePassword(data.oldPassword, data.newPassword);
      const response = res?.data;

      toast(`${response.name} successfully changed password!`, {
        type: 'success',
        position: 'top-right',
      });
      router.back();
      router.refresh();
    } catch (error) {
      toast(`Change password failed!  ${error?.response?.data?.message}`, {
        type: 'error',
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };
  // ------------------------------------------------

  const nameConstraints = {
    required: { value: true, message: 'Full Name is required' },
    minLength: {
      value: 5,
      message: 'Full Name is min 5 characters',
    },
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
      if (watch('newPassword') !== value) {
        return 'Passwords do no match';
      }
    },
  };

  const btn = <button className='btn btn-primary'>Save</button>;
  const btnDisabled = <button className='btn btn-disabled btn-primary'>Save</button>;
  const btnLoading = (
    <button className='w-full btn btn-disabled'>
      <span className='loading loading-spinner'></span>
      Save
    </button>
  );
  const editProfileButton = !isEditProfileValid ? btnDisabled : (loading ? btnLoading : btn);
  const changePasswordButton = !isChangePasswordValid ? btnDisabled : (loading ? btnLoading : btn);
  const uploadProgressStyle = {
    '--size': '3.2rem',
    '--value': uploadProgress,
  } as React.CSSProperties;

  return (
    <section className='min-h-screen bg-slate-200'>
      <FormProvider {...editProfileMethods}>
        <form
          onSubmit={handleEditProfile(onProfileEdited)}
          className='mx-auto flex max-w-2xl flex-col items-center overflow-hidden pt-10'
        >
          <div className='card w-3/4 bg-slate-50 shadow-xl'>
            <div className='card-body'>
              <div className='card-title'>
                <h1>Edit my Profile</h1>
              </div>
              <FormInput
                label='Full Name'
                name='name'
                constraints={nameConstraints}
              />
              Image
              <DropBox onDrop={onDrop} imgSrc={user.imageUrl} />
              {/* <FormInput label='Image' name='image' type='file' /> */}
              <div className='card-actions justify-end'>
                {uploadProgress > 0 && (
                  <div className='radial-progress' style={uploadProgressStyle}>
                    {uploadProgress}%
                  </div>
                )}
                <div>{editProfileButton}</div>
                <div>
                  <button
                    type='button'
                    className={`btn-outline btn-accent btn ${
                      loading ? 'btn-disabled' : ''
                    }`}
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>

      <FormProvider {...changePasswordMethods}>
        <form
          onSubmit={handleChangePassword(onPasswordChanged)}
          className='mx-auto flex max-w-2xl flex-col items-center overflow-hidden py-5'
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
                constraints={passwordConstraints}
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
                    className={`btn-outline btn-accent btn ${
                      loading ? 'btn-disabled' : ''
                    }`}
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}
