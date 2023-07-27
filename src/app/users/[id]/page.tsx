import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getClientBaseUrl } from "../../../lib/util";
import EditUserPage from "./edit-user-page";

async function getUserById(id) {
  const baseUrl = getClientBaseUrl(headers());
  const cookieStore = cookies();

  const res = await fetch(`${baseUrl}/api/users/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: cookieStore as any,
    },
  });

  if (!res.ok) {
    console.error(`Edit User getServerSideProps error: `, res.statusText);
    return { users: [], totalElements: 0 };
  }

  const json = await res.json();
  return json;
}

export default async function EditUser({params}) {
  // Fetch data directly in a Server Component
  const user = await getUserById(params?.id);
  if (!user) {
    redirect("/users");
  }

  // Forward fetched data to your Client Component
  return <EditUserPage user={user} />;
}
