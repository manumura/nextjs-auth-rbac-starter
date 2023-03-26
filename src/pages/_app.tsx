import DrawerLayout from "@/components/DrawerLayout";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import { DrawerOpenProvider } from "@/lib/DrawerOpenContext";
import "@/styles/globals.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import LoadingOverlay from "../components/LoadingOverlay";
import { getProfile } from "../lib/api";
import { clearStorage, saveUser } from "../lib/storage";
import { sleep } from "../lib/util";

// To avoid tailwind to purge toastify styles
import "react-toastify/dist/ReactToastify.min.css";

export default function App({ Component, pageProps }) {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  // TODO loading route change
  useEffect(() => {
    const abortController = new AbortController();
    doGetUser(abortController.signal);

    /* 
      Abort the request as it isn't needed anymore, the component being 
      unmounted. It helps avoid, among other things, the well-known "can't
      perform a React state update on an unmounted component" warning.
    */
    return () => abortController.abort();
  }, []);

  const doGetUser = async (signal) => {
    try {
      setLoading(true);
      // TODO remove this
      await sleep(1000);
      const res = await getProfile(signal);
      if (res?.data) {
        const user = res.data;
        setUser(user);
        saveUser(user);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error(error.message);
        /* Logic for non-aborted error handling goes here. */
        setUser(null);
        clearStorage();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthProvider>
      <DrawerOpenProvider>
        <DrawerLayout>
          <Component {...pageProps} />
        </DrawerLayout>
        {loading && <LoadingOverlay />}
        <ToastContainer />
      </DrawerOpenProvider>
    </AuthProvider>
  );
}
