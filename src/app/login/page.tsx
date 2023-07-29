import LoginPage from "./login-page";

export default async function Login({searchParams}) {
  return <LoginPage error={searchParams.error} />;
}
