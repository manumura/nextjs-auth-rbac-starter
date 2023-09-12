'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import DropBox from '../../components/DropBox';
import FormInput from '../../components/FormInput';
import { sleep } from '../../lib/utils';
import { updateProfile, updateProfileImage } from '../../lib/api';

export default function EditProfilePage({ user }) {
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

  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      name: user.name,
      password: '',
      passwordConfirm: '',
    },
  });
  const [loading, setLoading] = useState(false);

  const handleCancel = (): void => {
    router.back();
  };

  const {
    handleSubmit,
    // formState: { errors, isSubmitSuccessful },
    watch,
    setError,
  } = methods;

  const onSubmit = async (data): Promise<void> => {
    if (!data || loading) {
      return;
    }

    if (!data.name && !data.password) {
      setError('name', { message: 'Please edit at least 1 field' });
      setError('password', { message: 'Please edit at least 1 field' });
      return;
    }

    try {
      setLoading(true);
      let success = true;

      const res = await updateProfile(data.name, data.password);
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
          position: 'top-center',
        });
        router.back();
        router.refresh();
      } else {
        toast('Profile update failed!', {
          type: 'error',
          position: 'top-center',
        });
      }
    } catch (error) {
      toast(`Profile update failed!  ${error?.response?.data?.message}`, {
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
  const btn = <button className='btn btn-primary'>Save</button>;
  const btnLoading = (
    <button className='w-full btn btn-disabled'>
      <span className='loading loading-spinner'></span>
      Save
    </button>
  );
  const uploadProgressStyle = {
    '--size': '3.2rem',
    '--value': uploadProgress,
  } as React.CSSProperties;

  return (
    <section className='h-section bg-slate-200'>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='mx-auto flex max-w-2xl flex-col items-center overflow-hidden py-20'
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
              Image
              <DropBox onDrop={onDrop} imgSrc={user.imageUrl} />
              {/* <FormInput label='Image' name='image' type='file' /> */}
              <div className='card-actions justify-end'>
                {uploadProgress > 0 && (
                  <div className='radial-progress' style={uploadProgressStyle}>
                    {uploadProgress}%
                  </div>
                )}
                <div>{loading ? btnLoading : btn}</div>
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
