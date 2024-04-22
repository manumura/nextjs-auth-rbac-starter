'use server';

import { UUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import appConfig from '../config/config';
import { validateCaptcha } from './captcha.utils';
import { setAuthCookies } from './cookies.utils.';
import { getUserFromIdToken } from './jwt.utils';
import { IUser } from './user-store';

export type LoginState = {
  message: string,
  error: boolean,
  user: IUser | undefined,
  idToken: string | undefined,
};

export async function registerAction(
  prevState: any,
  formData: FormData,
): Promise<any> {
  try {
    console.log('Register server action');
    const BASE_URL = appConfig.baseUrl;

    // validate the token via the server action we've created previously
    const token = formData.get('token') as string;
    const isCaptchaValid = await validateCaptcha(token);
    console.log('isCaptchaValid', isCaptchaValid);

    if (!isCaptchaValid) {
      return {
        message: 'Captcha verification failed!',
        error: true,
      };
    }

    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const payload = {
      name,
      email,
      password,
    };
    const body = JSON.stringify(payload);

    // await sleep(3000);

    const res = await fetch(`${BASE_URL}/api/v1/register`, {
      method: 'POST',
      body,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Cookie: cookieStore as any,
      },
      cache: 'no-cache',
    });

    if (!res.ok) {
      const response = await res.json();
      console.error('Register server action error: ', response);
      // const message = response.message ? `Registration failed! ${response.message}`: 'Registration failed!';
      const message = 'Registration failed! Please verify your email and try again.';
      return {
        message,
        error: true,
      };
    }

    const user = await res.json();
    console.log('Register response: ', user);
    const message = `You are successfully registered ${user.name}!`;

    // revalidatePath('/');
    return {
      message,
      error: false,
    };
  } catch (error) {
    console.error('Register server action error: ', error);
    // const message = error?.response?.data?.message ? `Registration failed! ${error?.response?.data?.message}`: 'Registration failed!';
    const message = 'Registration failed! Please verify your email and try again.';
    return {
      message,
      error: true,
    };
  }
}

export async function loginAction(
  prevState: any,
  formData: FormData,
): Promise<LoginState> {
  try {
    console.log('Login server action');

    const BASE_URL = appConfig.baseUrl;
    const cookieStore = cookies();

    const email = formData.get('email');
    const password = formData.get('password');
    const payload = {
      email,
      password,
    };
    const body = JSON.stringify(payload);

    // await sleep(3000);

    const res = await fetch(`${BASE_URL}/api/v1/login`, {
      method: 'POST',
      credentials: 'include',
      body,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Cookie: cookieStore as any,
      },
      cache: 'no-cache',
    });

    if (!res.ok) {
      const response = await res.json();
      console.error('Login server action error: ', response);
      return {
        message: `Login failed! ${response.message}`,
        error: true,
        user: undefined,
        idToken: undefined,
      };
    }

    const data = await res.json();
    // console.log('Login response: ', data);
    setAuthCookies(cookieStore, data);

    const idToken = data.idToken;
    const user = await getUserFromIdToken(idToken);
    const message = `Welcome ${user?.name}!`;

    const response: LoginState = {
      message,
      error: false,
      user,
      idToken,
    };
    console.log('Login response', response);

    // revalidatePath('/');
    // return response;
    
  } catch (error) {
    console.error('Login server action error: ', error);
    const message = error?.response?.data?.message ? `Login failed! ${error?.response?.data?.message}`: 'Login failed!';
    return {
      message,
      error: true,
      user: undefined,
      idToken: undefined,
    };
    // throw new Error(message);
  }

  // TODO workaround for form state not updating: https://github.com/vercel/next.js/blob/canary/examples/next-forms/app/add-form.tsx
  revalidatePath('/');
  redirect('/');
}

export async function updateUserAction(
  uuid: UUID,
  prevState: any,
  formData: FormData,
): Promise<any> {
  try {
    console.log('Updating user with UUID: ', uuid);
    const BASE_URL = appConfig.baseUrl;
    const cookieStore = cookies();

    const name = formData.get('name');
    const email = formData.get('email');
    const role = formData.get('role');
    const password = formData.get('password');
    const payload = {
      name,
      email,
      role,
      ...(password ? { password } : {}),
    };
    const body = JSON.stringify(payload);

    // await sleep(3000);

    const res = await fetch(`${BASE_URL}/api/v1/users/${uuid}`, {
      method: 'PUT',
      credentials: 'include',
      body,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Cookie: cookieStore as any,
      },
      cache: 'no-cache',
    });

    if (!res.ok) {
      const response = await res.json();
      console.error('Update User server action error: ', response);
      return {
        message: `Update user failed! ${response.message}`,
        error: true,
      };
    }

    const user = await res.json();
    console.log('User updated: ', user);
    const message = `User successfully updated: ${user.name}`;

    // revalidatePath('/users');
    // return {
    //   message,
    //   error: false,
    // };
  } catch (error) {
    console.error('Update User server action error: ', error);
    const message = error?.response?.data?.message ? `Update user failed! ${error?.response?.data?.message}`: 'Update user failed!';
    return {
      message,
      error: true,
    };
  }

  revalidatePath('/users');
  redirect('/users');
}

export async function createUserAction(
  prevState: any,
  formData: FormData,
): Promise<any> {
  try {
    console.log('Creating user');
    const BASE_URL = appConfig.baseUrl;
    const cookieStore = cookies();

    const name = formData.get('name');
    const email = formData.get('email');
    const role = formData.get('role');
    const payload = {
      name,
      email,
      role,
    };
    const body = JSON.stringify(payload);

    // await sleep(3000);

    const res = await fetch(`${BASE_URL}/api/v1/users`, {
      method: 'POST',
      credentials: 'include',
      body,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Cookie: cookieStore as any,
      },
      cache: 'no-cache',
    });

    if (!res.ok) {
      const response = await res.json();
      console.error('Create User server action error: ', response);
      return {
        message: `Create user failed! ${response.message}`,
        error: true,
      };
    }

    const user = await res.json();
    console.log('User created: ', user);
    const message = `User successfully created: ${user.name}`;

    // revalidatePath('/users');
    // return {
    //   message,
    //   error: false,
    // };
  } catch (error) {
    console.error('Create User server action error: ', error);
    const message = error?.response?.data?.message ? `Create user failed! ${error?.response?.data?.message}`: 'Create user failed!';
    return {
      message,
      error: true,
    };
  }

  revalidatePath('/users');
  redirect('/users');
}

export async function forgotPasswordAction(
  prevState: any,
  formData: FormData,
): Promise<any> {
  try {
    console.log('Forgot password server action');
    const BASE_URL = appConfig.baseUrl;

    // validate the token via the server action we've created previously
    const token = formData.get('token') as string;
    const isCaptchaValid = await validateCaptcha(token);
    console.log('isCaptchaValid', isCaptchaValid);

    if (!isCaptchaValid) {
      return {
        message: 'Captcha verification failed!',
        error: true,
      };
    }

    const email = formData.get('email');
    const payload = {
      email,
    };
    const body = JSON.stringify(payload);

    // await sleep(3000);

    const res = await fetch(`${BASE_URL}/api/v1/forgot-password`, {
      method: 'POST',
      body,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Cookie: cookieStore as any,
      },
      cache: 'no-cache',
    });

    if (!res.ok) {
      const response = await res.json();
      console.error('Forgot password server action error: ', response);
      const message = response ? `An error occured, please try again:  ${response}` : 'An error occured, please try again';
      return {
        message,
        error: true,
      };
    }

    const user = await res.json();
    console.log('Forgot password response: ', user);
    const message = `Success! Please check the email sent at ${email}.`;

    // revalidatePath('/');
    return {
      message,
      error: false,
    };
  } catch (error) {
    console.error('Forgot password server action error: ', error);
    const message = error?.response?.data?.message ? `An error occured, please try again:  ${error?.response?.data?.message}.` : 'An error occured, please try again.';
    return {
      message,
      error: true,
    };
  }
}

export async function resetPasswordAction(
  prevState: any,
  formData: FormData,
): Promise<any> {
  try {
    console.log('Reset password server action');
    const BASE_URL = appConfig.baseUrl;

    const token = formData.get('token');
    const password = formData.get('password');
    const payload = {
      token,
      password,
    };
    const body = JSON.stringify(payload);

    // await sleep(3000);

    const res = await fetch(`${BASE_URL}/api/v1/new-password`, {
      method: 'POST',
      body,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Cookie: cookieStore as any,
      },
      cache: 'no-cache',
    });

    if (!res.ok) {
      const response = await res.json();
      console.error('Reset password server action error: ', response);
      const message = response ? `Password update failed: ${response}.` : 'Password update failed.';
      return {
        message,
        error: true,
      };
    }

    const user = await res.json();
    console.log('Reset password response: ', user);
    const message = 'Password successfully updated!';

    // revalidatePath('/');
    return {
      message,
      error: false,
    };
  } catch (error) {
    console.error('Reset password server action error: ', error);
    const message = error?.response?.data?.message ? `Password update failed: ${error?.response?.data?.message}.` : 'Password update failed.';
    return {
      message,
      error: true,
    };
  }
}
