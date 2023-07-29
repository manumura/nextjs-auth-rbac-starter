import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ForgotPasswordPage from "./forgot-password-page";

async function isAuthenticated() {
  // Redirect if user is authenticated
  const accessToken = cookies().get("accessToken")?.value;
  return !!accessToken;
}

export default async function ForgotPassword() {
  // Fetch data directly in a Server Component
  const isAuth = await isAuthenticated();
  if (isAuth) {
    redirect("/");
  }

  // Forward fetched data to your Client Component
  return <ForgotPasswordPage />;
}
