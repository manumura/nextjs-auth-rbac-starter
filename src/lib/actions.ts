'use server';

import { UUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import appConfig from '../config/config';
import { validateCaptcha } from './captcha.utils';
import { setAuthCookies } from './cookies.utils.';
import { getUserFromIdToken } from './jwt.utils';

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
      // const message = response.message ? `Register failed! ${response.message}`: 'Register failed!';
      const message = 'Register failed!';
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
    // const message = error?.response?.data?.message ? `Register failed! ${error?.response?.data?.message}`: 'Register failed!';
    const message = 'Register failed!';
    return {
      message,
      error: true,
    };
  }
}

export async function loginAction(
  prevState: any,
  formData: FormData,
): Promise<any> {
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
      };
    }

    const response = await res.json();
    console.log('Login response: ', response);
    setAuthCookies(cookieStore, response);

    const idToken = response.idToken;
    const user = await getUserFromIdToken(idToken);
    const message = `Welcome ${user?.name}!`;

    revalidatePath('/');
    return {
      message,
      error: false,
      user,
      idToken,
    };
  } catch (error) {
    console.error('Login server action error: ', error);
    const message = error?.response?.data?.message ? `Login failed! ${error?.response?.data?.message}`: 'Login failed!';
    return {
      message,
      error: true,
    };
  }
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

    //   revalidatePath(`/users/${uuid}`);
    revalidatePath('/users');
    return {
      message,
      error: false,
    };
  } catch (error) {
    console.error('Update User server action error: ', error);
    const message = error?.response?.data?.message ? `Update user failed! ${error?.response?.data?.message}`: 'Update user failed!';
    return {
      message,
      error: true,
    };
  }
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

    //   revalidatePath(`/users/${uuid}`);
    revalidatePath('/users');
    return {
      message,
      error: false,
    };
  } catch (error) {
    console.error('Create User server action error: ', error);
    const message = error?.response?.data?.message ? `Create user failed! ${error?.response?.data?.message}`: 'Create user failed!';
    return {
      message,
      error: true,
    };
  }
}
