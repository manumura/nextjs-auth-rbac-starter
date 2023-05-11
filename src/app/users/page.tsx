import { cookies } from "next/headers";
import appConfig from "../../config/config";
import { axiosInstance } from "../../lib/api";
import UsersPage from "../users-page";

async function getUsers(page, pageSize, role) {
  try {
    const cookieStore = cookies();
    const response = await axiosInstance.get("/v1/users", {
      params: { role, page, pageSize },
      headers: {
        // Authorization: `bearer ${accessToken}`,
        Cookie: cookieStore as any,
      },
      withCredentials: true,
    });

    const users = response.data.elements;
    const totalElements = response.data.totalElements;
    return { users, totalElements };
  } catch (err) {
    console.error(`Get Users getServerSideProps error: `, err.response?.data);
    return { users: [], totalElements: 0 };
  }
}

export default async function Users({ searchParams }) {
  // Fetch data directly in a Server Component
  const page = searchParams?.page || 1;
  const pageSize = appConfig.defaultRowsPerPage;
  // TODO filter by role
  const role = undefined;

  const { users, totalElements } = await getUsers(page, pageSize, role);

  // Forward fetched data to your Client Component
  return (
    <UsersPage
      users={users}
      totalElements={totalElements}
      page={page}
      pageSize={pageSize}
    />
  );
}
