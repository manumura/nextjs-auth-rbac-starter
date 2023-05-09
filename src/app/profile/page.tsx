import { cookies } from "next/headers";
import { axiosInstance } from "../../lib/api";
import { redirect } from "next/navigation";
import ProfilePage from "../profile-page";

async function getUser() {
  try {
    const accessToken = cookies().get("accessToken")?.value;
    const response = await axiosInstance.get("/v1/profile", {
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error(`Profile getServerSideProps error: ${err.response?.data}`);
    return undefined;
  }
}

export default async function EditProfile() {
  // Fetch data directly in a Server Component
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  // Forward fetched data to your Client Component
  return <ProfilePage user={user} />;
}
