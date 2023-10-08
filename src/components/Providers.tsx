'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { ToastContainer } from 'react-toastify';

// To avoid tailwind to purge toastify styles
import 'react-toastify/dist/ReactToastify.min.css';

export function Providers({ children }) {
  const reCaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

  return (
    <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>
      {children}
      <ToastContainer />
    </GoogleReCaptchaProvider>
  );
}
