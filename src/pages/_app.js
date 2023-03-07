import { AuthProvider } from "@/lib/AuthContext";
import "@/styles/globals.css";
import React from "react";
import { ToastContainer } from "react-toastify";

// To avoid tailwind to purge toastify styles
import 'react-toastify/dist/ReactToastify.min.css';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </AuthProvider>
  );
}
