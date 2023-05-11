import { cookies, headers } from "next/headers";
import DrawerLayout from "../components/DrawerLayout";
import "../styles/globals.css";

// To avoid tailwind to purge toastify styles
import "react-toastify/dist/ReactToastify.min.css";
import { axiosInstance } from "../lib/api";

// TODO refresh token expired
async function getProfile() {
  // try {
  //   // const accessToken = cookies().get("accessToken")?.value;
  //   const cookieStore = cookies();
  //   const response = await axiosInstance.get("/v1/profile", {
  //     headers: {
  //       // Authorization: `bearer ${accessToken}`,
  //       Cookie: cookieStore as any,
  //     },
  //     withCredentials: true,
  //   });

  //   return response.data;
  // } catch (err) {
  //   console.error(`Profile getServerSideProps error: `, err.response?.data);
  //   return undefined;
  // }

  const h = headers();
  const protocol = h.get("x-forwarded-proto");
  const host = h.get("host");
  const cookieStore = cookies();

  const res = await fetch(`${protocol}://${host}/api/profile`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Cookie": cookieStore as any,
    },
  });
  console.log("TEST RootLayout", res.headers.get("set-cookie"));

  if (!res.ok) {
    return undefined;
  }

  const user = await res.json();
  return user;
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
        <DrawerLayout user={user}>{children}</DrawerLayout>
      </body>
    </html>
  );
}

export const metadata = {
  title: "MyApp",
  description: "Welcome to MyApp",
};
