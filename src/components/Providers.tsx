'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { ToastContainer } from 'react-toastify';

// To avoid tailwind to purge toastify styles
import 'react-toastify/dist/ReactToastify.min.css';

export function Providers({ children }) {
  const queryClient = new QueryClient();
  const reCaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>
        {children}
        <ToastContainer />
      </GoogleReCaptchaProvider>
    </QueryClientProvider>
  );
}
