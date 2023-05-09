import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { axiosInstance } from "../../../lib/api";
import EditUserPage from "../../edit-user";

async function getUserById(id) {
  try {
    const accessToken = cookies().get("accessToken")?.value;
    const response = await axiosInstance.get(`/v1/users/${id}`, {
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
    });
    const user = response.data;
    return user;
  } catch (err) {
    console.error(`Edit User getServerSideProps error: `, err.response?.data);
    return undefined;
  }
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
