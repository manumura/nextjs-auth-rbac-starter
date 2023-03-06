import "@/styles/globals.css";
import React from "react";
import { ToastContainer } from "react-toastify";

import 'react-toastify/dist/ReactToastify.min.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer />
    </>
  );
}
