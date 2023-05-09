import "@/styles/globals.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getProfile } from "../lib/api";
import { clearStorage, saveUser } from "../lib/storage";
import useUserStore from "../lib/user-store";
import { sleep } from "../lib/util";

// To avoid tailwind to purge toastify styles
import "react-toastify/dist/ReactToastify.min.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const userStore = useUserStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // https://www.jamesperkins.dev/post/page-to-page-loading-in-next/
    const handleStart = (url, { shallow }) => setLoading(true);
    const handleComplete = (url, { shallow }) => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

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
      console.log("Get user profile in App component");
      setLoading(true);
      // TODO remove this
      await sleep(1000);
      const res = await getProfile(signal);
      if (res?.data) {
        const user = res.data;
        userStore.setUser(user);
        saveUser(user);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error(error.message);
        /* Logic for non-aborted error handling goes here. */
        userStore.setUser(null);
        clearStorage();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
        <Component {...pageProps} />
  );
}
