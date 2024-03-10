'use server';

import { UUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import appConfig from '../config/config';

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
    return {
      message: 'Update user failed!',
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
    return {
      message: 'Create user failed!',
      error: true,
    };
  }
}
