import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import ProfilePage from "./profile-page";

async function getProfile() {
  const h = headers();
  const protocol = h.get("x-forwarded-proto");
  const host = h.get("host");
  const cookieStore = cookies();

  const res = await fetch(`${protocol}://${host}/api/profile`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Access-Control-Allow-Credentials": "true",
      "Cookie": cookieStore as any,
    },
  });
  console.log("TEST1 Profile", res.headers.get("set-cookie"));

  if (!res.ok) {
    return undefined;
  }

  const user = await res.json();
  return user;
}

export default async function Profile() {
  // Fetch data directly in a Server Component
  const user = await getProfile();
  if (!user) {
    redirect("/login");
  }

  // Forward fetched data to your Client Component
  return <ProfilePage user={user} />;
}
