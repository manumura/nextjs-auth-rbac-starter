'use server';

import axios from 'axios';

// TODO move to backend
export async function validateCaptcha(token: string): Promise<boolean> {
  const res = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  );
  return res.data.score > 0.5;
}
