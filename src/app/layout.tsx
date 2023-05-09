import { cookies } from "next/headers";
import DrawerLayout from "../components/DrawerLayout";
import { axiosInstance } from "../lib/api";
import "../styles/globals.css";

// To avoid tailwind to purge toastify styles
import "react-toastify/dist/ReactToastify.min.css";

// TODO refresh token expired
// TODO refresh users list after update
async function getProfile() {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) {
      return undefined;
    }

    const response = await axiosInstance.get("/v1/profile", {
      headers: {
        // Authorization: `bearer ${accessToken}`,
         Cookie: cookieStore as any,
      },
      withCredentials: true,
    });
    const user = response.data;
    return user;
  } catch (err) {
    console.error(
      `Get Profile in RootLayout getServerSideProps error: `,
      err.response?.data,
    );
    return undefined;
  }
}

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getProfile();

  return (
    <html lang="en" data-theme="emerald">
      <body>
        <DrawerLayout user={user}>
          {children}
        </DrawerLayout>
      </body>
    </html>
  );
}

export const metadata = {
  title: "MyApp",
  description: "Welcome to MyApp",
};
