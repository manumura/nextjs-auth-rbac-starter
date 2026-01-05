'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { ToastContainer } from 'react-toastify';

// To avoid tailwind to purge toastify styles
// import 'react-toastify/dist/ReactToastify.min.css';
import appConfig from '../config/config';
import { GoogleOAuthProvider } from '@react-oauth/google';

export function Providers({ children }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleReCaptchaProvider reCaptchaKey={appConfig.reCaptchaKey}>
        <GoogleOAuthProvider clientId={appConfig.googleClientId}>
          {children}
          <ToastContainer />
        </GoogleOAuthProvider>
      </GoogleReCaptchaProvider>
    </QueryClientProvider>
  );
}
