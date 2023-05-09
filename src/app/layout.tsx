import DrawerLayout from "../components/DrawerLayout";
import { DrawerOpenProvider } from "../lib/DrawerOpenContext";
import "../styles/globals.css";

// To avoid tailwind to purge toastify styles
import "react-toastify/dist/ReactToastify.min.css";

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="emerald">
      <body>
        <DrawerOpenProvider>
          <DrawerLayout>{children}</DrawerLayout>
        </DrawerOpenProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: "MyApp",
  description: "Welcome to MyApp",
};
