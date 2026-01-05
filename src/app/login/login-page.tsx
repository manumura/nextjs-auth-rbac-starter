'use client';

import FormInput from '@/components/FormInput';
import { clearAuthentication, saveAuthentication } from '@/lib/storage';
import { CredentialResponse } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import FacebookLoginButton from '../../components/FacebookLoginButton';
import GoogleLoginButton from '../../components/GoogleLoginButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import appConfig from '../../config/config';
import { appMessages, errorMessages } from '../../config/constant';
import { googleLogin, login, validateRecaptcha } from '../../lib/api';
import { getUserFromIdToken } from '../../lib/jwt.utils';
import useMessageStore from '../../lib/message-store';
import useUserStore from '../../lib/user-store';
import {
  IAuthenticatedUser,
  LoginResponse
} from '../../types/custom-types';

export function LoginButton({ isValid, isLoading }): React.ReactElement {
  const btn = <button className='btn btn-primary w-full'>Login</button>;
  const btnDisabled = (
    <button className='btn btn-disabled btn-primary w-full'>Login</button>
  );
  const btnLoading = (
    <button className='btn btn-disabled btn-primary w-full'>
      <span className='loading loading-spinner'></span>
      Login
    </button>
  );

  return !isValid ? btnDisabled : isLoading ? btnLoading : btn;
}

export default function LoginPage({ error }): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userStore = useUserStore();
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    // Handle access token expired
    if (error === '401') {
      clearAuthentication();
      userStore.setUser(null);
      toast('Session expired, please login again.', {
        type: 'error',
        position: 'bottom-right',
        toastId: '401',
      });
    }

    if (error === '404') {
      toast('Not Found!', {
        type: 'error',
        position: 'bottom-right',
        toastId: '404',
      });
    }
  }, [error, userStore]);

  const methods = useForm({
    mode: 'all',
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful, isValid },
  } = methods;

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => onLoginMutate(email, password),
    onSuccess(user, variables, context) {
      userStore.setUser(user);

      toast(`Welcome ${user?.name}!`, {
        type: 'success',
        position: 'bottom-right',
      });

      router.replace('/');
    },
    onError(err, variables, context) {
      toast(err?.message, {
        type: 'error',
        position: 'bottom-right',
      });
    },
  });

  const onLoginMutate = async (
    email,
    password,
  ): Promise<IAuthenticatedUser> => {
    if (!executeRecaptcha) {
      throw new Error('Recaptcha not loaded');
    }
    const token = await executeRecaptcha('onSubmit');
    const isCaptchaValid = await validateRecaptcha(token);
    if (!isCaptchaValid) {
      throw new Error('Captcha validation failed');
    }

    try {
      const response = await login(email, password);

      const user = await getUserFromLoginResponse(response.data);
      if (!user) {
        throw new Error('Invalid user');
      }
      return user;
    } catch (error) {
      console.error(error);
      let message = 'Unknown error';
      if (error instanceof AxiosError && error.response?.data) {
        const msg = error.response.data.message;
        if (msg === errorMessages.INVALID_EMAIL_OR_PASSWORD.code) {
          message = errorMessages.INVALID_EMAIL_OR_PASSWORD.text;
        } else if (msg === errorMessages.EMAIL_NOT_VERIFIED.code) {
          message = errorMessages.EMAIL_NOT_VERIFIED.text;
        } else {
          message = msg;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }
      throw new Error(message);
    }
  };

  const onSubmit = async (formData) => {
    if (!formData) {
      return;
    }

    loginMutation.mutate(formData);
  };

  const emailConstraints = {
    required: { value: true, message: 'Email is required' },
  };
  const passwordConstraints = {
    required: { value: true, message: 'Password is required' },
  };

  const onGoogleLoginFailed = () => {
    toast('Login failed', {
      type: 'error',
      position: 'bottom-right',
    });
  };

  const onGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse | null,
  ) => {
    if (!credentialResponse?.credential) {
      toast('Login failed', {
        type: 'error',
        position: 'bottom-right',
      });
      return;
    }

    setIsLoading(true);
    console.log('Google login token:', credentialResponse.credential);
    const user = await getUserFromGoogleToken(credentialResponse.credential);
    setIsLoading(false);

    if (!user) {
      toast('Login failed', {
        type: 'error',
        position: 'bottom-right',
      });
      return;
    }

    const time = new Date().getTime();
    useMessageStore.getState().setMessage({
      type: appMessages.LOGIN_SUCCESS.type,
      text: appMessages.LOGIN_SUCCESS.text.replace('${name}', user.name),
      id: time,
    });

    userStore.setUser(user);
    router.replace('/');
  };

  const getUserFromGoogleToken = async (
    token: string,
  ): Promise<IAuthenticatedUser | null> => {
    if (!token) {
      return null;
    }

    try {
      const response = await googleLogin(token);
      if (!response?.data) {
        return null;
      }

      return getUserFromLoginResponse(response.data);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const getUserFromLoginResponse = async (
    response: LoginResponse,
  ): Promise<IAuthenticatedUser | null> => {
    const { accessToken, accessTokenExpiresAt, refreshToken, idToken } =
      response;
    if (!idToken || !accessToken || !refreshToken) {
      return null;
    }

    const user = await getUserFromIdToken(idToken);
    if (!user) {
      return null;
    }

    saveAuthentication(
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      idToken,
    );
    return user;
  };

  const onFacebookLoginClicked = () => {
    const url = appConfig.baseUrl + '/api/v1/oauth2/facebook';
    window.location.href = url;

    // Open the URL in a new window
    // const width = 600;
    // const height = 600;
    // const left = window.screen.width / 2 - width / 2;
    // const top = window.screen.height / 2 - height / 2;
    // const features = `width=${width},height=${height},left=${left},top=${top},popup=yes`;
    // window.open(url, 'facebookLoginWindow', features);
  };

  return (
    <section className='h-section bg-slate-200 py-20'>
      <div className='w-full'>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='mx-auto w-full max-w-md space-y-5 overflow-hidden rounded-2xl bg-slate-50 p-8 shadow-lg'
          >
            <h1 className='mb-4 text-center text-4xl font-[600]'>
              Login to MyApp
            </h1>
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

            <div className='text-right'>
              <Link href='/forgot-password' className='text-secondary'>
                Forgot Password?
              </Link>
            </div>

            <LoginButton
              isValid={isValid}
              isLoading={loginMutation.isPending || isLoading}
            />
            <span className='block'>
              Need an account?{' '}
              <Link href='/register' className='text-secondary'>
                Sign Up Here
              </Link>
            </span>

            <div className='divider'>OR</div>
            {loginMutation.isPending || isLoading ? (
              <LoadingSpinner label='Loading' isHorizontal={true} />
            ) : (
              <>
                <GoogleLoginButton
                  onGoogleLoginSuccess={onGoogleLoginSuccess}
                  onGoogleLoginFailed={onGoogleLoginFailed}
                />
                <FacebookLoginButton onClick={onFacebookLoginClicked} />
              </>
            )}
          </form>
        </FormProvider>
      </div>
    </section>
  );
}
