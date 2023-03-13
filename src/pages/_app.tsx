import DrawerLayout from "@/components/DrawerLayout";
import { AuthProvider } from "@/lib/AuthContext";
import { DrawerOpenProvider } from "@/lib/DrawerOpenContext";
import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";

// To avoid tailwind to purge toastify styles
import "react-toastify/dist/ReactToastify.min.css";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <DrawerOpenProvider>
        <DrawerLayout>
          <Component {...pageProps} />
        </DrawerLayout>
        <ToastContainer />
      </DrawerOpenProvider>
    </AuthProvider>
  );
}
