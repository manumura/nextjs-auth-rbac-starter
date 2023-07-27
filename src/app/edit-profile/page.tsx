import { cookies, headers } from 'next/headers';
import { redirect } from "next/navigation";
import { getClientBaseUrl } from "../../lib/util";
import EditProfilePage from "./edit-profile-page";

async function getUser() {
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
    console.error(`Edit Profile getServerSideProps error: `,  res.statusText);
    return undefined;
  }

  const json = await res.json();
  return json;
}

export default async function EditProfile() {
  // Fetch data directly in a Server Component
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

  // Forward fetched data to your Client Component
  return <EditProfilePage user={user} />;
}
