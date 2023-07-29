import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getClientBaseUrl } from "../../lib/utils";
import ResetPasswordPage from "./reset-password-page";

async function isAuthenticated() {
  // Redirect if user is authenticated
  const accessToken = cookies().get("accessToken")?.value;
  return !!accessToken;
}

async function getUserByToken(token) {
  const baseUrl = getClientBaseUrl(headers());
  const res = await fetch(`${baseUrl}/api/token/${token}`, {
    method: "GET",
  });

  if (!res.ok) {
    console.error(`Reset password getServerSideProps error: `, res.statusText);
    return undefined;
  }

  const json = await res.json();
  return json;
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

  const user = await getUserByToken(searchParams?.token);
  if (!user) {
    redirect("/login?error=404");
  }

  // Forward fetched data to your Client Component
  return <ResetPasswordPage token={searchParams?.token} />;
}
