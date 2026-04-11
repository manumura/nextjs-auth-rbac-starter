'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import ChangePasswordForm from '../../components/ChangePasswordForm';
import DeleteProfileForm from '../../components/DeleteProfileForm';
import EditProfileForm from '../../components/EditProfileForm';
import {
  deleteProfile,
  logout,
  updatePassword,
  updateProfile,
  updateProfileImage,
} from '../../lib/api';
import { clearStorage } from '../../lib/storage';
import useUserStore from '../../lib/user-store';
import { IUser } from '../../types/custom-types';

export default function EditProfilePage({ user }) {
  const router = useRouter();
  const [images, setImages] = useState([] as any[]);
  // Get QueryClient from the context
  const queryClient = useQueryClient();

  const onDrop = useCallback(
    (acceptedFiles) => {
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
    },
    [images],
  );
  const onUploadProgress = (progressEvent): void => {
    const { loaded, total } = progressEvent;
    if (progressEvent.bytes) {
      const progress = Math.round((loaded / total) * 100);
      // setUploadProgress(progress);
      console.log('Upload progress:', progress);
    }
  };

  const handleCancel = (): void => {
    router.back();
  };

  //----------------- Edit Profile -------------------
  const editProfileMethods = useForm({
    defaultValues: {
      name: user.name,
    },
    mode: 'all',
  });

  const { handleSubmit: handleEditProfile, setError: setEditProfileError } =
    editProfileMethods;

  const mutationProfile = useMutation({
    mutationFn: ({ name }: { name: string }) => onMutateProfile(name),
    async onSuccess(user, variables, context) {
      toast('Profile successfully updated!', {
        type: 'success',
        position: 'bottom-right',
      });

      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      router.push('/profile');
    },
    onError(error, variables, context) {
      toast(error?.message, {
        type: 'error',
        position: 'bottom-right',
      });
    },
  });

  const onMutateProfile = async (name): Promise<IUser> => {
    try {
      const user = await updateProfile(name);

      if (images.length <= 0) {
        return user;
      }

      // Upload profile image
      console.log('Uploading image');
      const formData = new FormData();
      formData.append('image', images[0]);

      await updateProfileImage(formData);
      return user;
    } catch (error) {
      if (error instanceof HTTPError) {
        const message = error.data?.message ?? 'Create user failed';
        throw new Error(message);
      }
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Edit user failed');
    }
  };

  const onProfileEdited = async (formData): Promise<void> => {
    if (!formData?.name && images.length <= 0) {
      setEditProfileError('name', { message: 'Please edit at least 1 field' });
      // setError('password', { message: 'Please edit at least 1 field' });
      return;
    }

    mutationProfile.mutate({
      name: formData.name,
    });
  };
  // ------------------------------------------------

  //----------------- Change Password -------------------
  const changePasswordMethods = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
    mode: 'all',
  });

  const {
    handleSubmit: handleChangePassword,
    setError: setChangePasswordError,
  } = changePasswordMethods;

  const mutationPassword = useMutation({
    mutationFn: ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => onMutatePassword(oldPassword, newPassword),
    async onSuccess(user, variables, context) {
      toast(`${user.name} successfully changed password!`, {
        type: 'success',
        position: 'bottom-right',
      });

      router.push('/profile');
    },
    onError(error, variables, context) {
      toast(error?.message, {
        type: 'error',
        position: 'bottom-right',
      });
    },
  });

  const onMutatePassword = async (oldPassword, newPassword): Promise<IUser> => {
    try {
      const user = await updatePassword(oldPassword, newPassword);
      return user;
    } catch (error) {
      if (error instanceof HTTPError) {
        const message = error.data?.message ?? 'Create user failed';
        throw new Error(message);
      }
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Edit password failed');
    }
  };

  const onPasswordChanged = async (formData): Promise<void> => {
    if (!formData?.oldPassword || !formData?.newPassword) {
      setChangePasswordError('oldPassword', {
        message: 'Please enter current and new password',
      });
      setChangePasswordError('newPassword', {
        message: 'Please enter current and new password',
      });
      return;
    }

    mutationPassword.mutate({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });
  };
  // ------------------------------------------------

  //----------------- Delete Profile -------------------
  const handleLogout = async (): Promise<void> => {
    await logout();
    useUserStore.getState().setUser(null);
    clearStorage();
    // googleLogout();
  };

  const mutationDeleteProfile = useMutation({
    mutationFn: () => onMutateDeleteProfile(),
    async onSuccess(user, variables, context) {
      toast('Profile successfully deleted!', {
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

  const onMutateDeleteProfile = async (): Promise<IUser> => {
    try {
      const user = await deleteProfile();
      if (!user) {
        throw new Error('Profile delete failed');
      }
      await handleLogout();
      return user;
    } catch (error) {
      if (error instanceof HTTPError) {
        const message = error.data?.message ?? 'Create user failed';
        throw new Error(message);
      }
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Profile delete failed');
    }
  };

  const onProfileDeleted = async (): Promise<void> => {
    mutationDeleteProfile.mutate();
  };
  // ------------------------------------------------

  const shouldShowChangePasswordForm =
    !user.providers || user.providers?.length <= 0;

  const loading = mutationProfile.isPending || mutationPassword.isPending || mutationDeleteProfile.isPending;

  return (
    <section className='min-h-screen bg-slate-200'>
      <EditProfileForm
        user={user}
        editProfileMethods={editProfileMethods}
        loading={loading}
        onEditProfile={handleEditProfile(onProfileEdited)}
        onDrop={onDrop}
        onCancel={handleCancel}
      />

      {shouldShowChangePasswordForm && (
        <ChangePasswordForm
          changePasswordMethods={changePasswordMethods}
          loading={loading}
          onPasswordChanged={handleChangePassword(onPasswordChanged)}
          onCancel={handleCancel}
        />
      )}

      <DeleteProfileForm
        onDeleteProfile={onProfileDeleted}
        onCancel={handleCancel}
        loading={loading}
      />
    </section>
  );
}
