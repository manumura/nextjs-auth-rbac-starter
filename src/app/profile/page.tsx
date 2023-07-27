import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import ProfilePage from "./profile-page";
import { getClientBaseUrl } from "../../lib/util";
import { toast } from "react-toastify";

async function getProfile() {
  const baseUrl = getClientBaseUrl(headers());
  const cookieStore = cookies();

  const res = await fetch(`${baseUrl}/api/profile`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: cookieStore as any,
    },
  });

  if (!res.ok) {
    console.error(`Get Profile getServerSideProps error: `,  res.statusText);
    return undefined;
  }

  const json = await res.json();
  return json;
}

export default async function Profile() {
  // Fetch data directly in a Server Component
  const user = await getProfile();
  if (!user) {
    redirect("/login");
  }

  // Forward fetched data to your Client Component
  return (
    <ProfilePage user={user} />
  );
}
