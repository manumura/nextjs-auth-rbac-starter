import { redirect } from "next/navigation";
import ResetPasswordPage from "../reset-password-page";
import { cookies } from "next/headers";
import {
  axiosInstance,
  forgotPassword,
  getUserByToken,
  resetPassword,
} from "@/lib/api";

async function isAuthenticated() {
  // Redirect if user is authenticated
  const accessToken = cookies().get("accessToken")?.value;
  return !!accessToken;
}

async function getUser(token) {
  try {
    const response = await getUserByToken(token);
    const user = response.data;
    return user;
  } catch (err) {
    console.error(
      `Reset Password getServerSideProps error: ${err.response?.data}`,
    );
    return undefined;
  }
}

export default async function ResetPassword({ searchParams }) {
  // Fetch data directly in a Server Component
  const isAuth = await isAuthenticated();
  if (isAuth) {
    redirect("/");
  }

  if (!searchParams?.token) {
    redirect("/login?error=404");
  }

  const user = await getUser(searchParams?.token);
  if (!user) {
    redirect("/login?error=404");
  }

  // Forward fetched data to your Client Component
  return <ResetPasswordPage token={searchParams?.token} />;
}
