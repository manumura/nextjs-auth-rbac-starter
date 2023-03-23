import { Pagination } from "@/components/Pagination";
import { axiosInstance } from "@/lib/api";
import { DEFAULT_ROWS_PER_PAGE } from "@/lib/constant";
import { useRouter } from "next/router";
import { useState } from "react";
import { FiDelete, FiEdit, FiPlusCircle } from "react-icons/fi";
import DeleteUserModal from "../../components/DeleteUserModal";
import LoadingSpinner from "../../components/LoadingSpinner";

export async function getServerSideProps({ req, res, query }) {
  try {
    // TODO handle 403
    // TODO .env template
    // TODO filter by role
    // TODO forget password
    const page = query.page || 1;
    const pageSize = DEFAULT_ROWS_PER_PAGE;
    const role = undefined;

    const response = await axiosInstance.get("/v1/users", {
      params: { role, page, pageSize },
      headers: {
        Cookie: req.headers.cookie,
      },
    });

    // Set new cookies in case tokens are expired (set from axios interceptor)
    const setCookieHeader = response.config?.headers["set-cookie"];
    if (setCookieHeader) {
      res.setHeader("Set-Cookie", setCookieHeader);
    }

    const users = response.data.elements;
    const totalElements = response.data.totalElements;
    return { props: { users, totalElements, page, pageSize } };
  } catch (err) {
    console.error(err);
    console.error("Get Users getServerSideProps error: ", err.response?.data);
    // Set new cookies in case tokens are expired (set from axios interceptor)
    const setCookieHeader = err.response?.headers["set-cookie"];
    if (setCookieHeader) {
      res.setHeader("Set-Cookie", setCookieHeader);
    }

    return {
      redirect: {
        permanent: false,
        destination: `/login?error=${err.response?.data?.statusCode}`,
      },
      props: {},
    };
  }
}

const Users = ({ users, totalElements, page, pageSize }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const onPageSelect = (pageSelected) => {
    router.push(`users?page=${pageSelected}`);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const onDeleteModalClose = (isSuccess) => {
    setIsDeleteModalOpen(false);
    if (isSuccess) {
      console.log("success ", selectedUser);
      // Refresh page
      router.reload();
    }
  };

  const onEditUser = (userId) => {
    router.push(`users/${userId}`);
  };

  const onCreateUser = () => {
    router.push("create-user");
  };

  const noUserRow = (
    <tr>
      <td colSpan={5} className="text-center font-bold">
        No Users found
      </td>
    </tr>
  );

  const userRows = users.map((user) => (
    <tr key={user.id}>
      <th>{user.id}</th>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        <div className="flex justify-end space-x-1">
          <button
            className="btn-primary btn-sm btn gap-2"
            onClick={() => onEditUser(user.id)}
          >
            <FiEdit />
            Edit
          </button>
          <button
            className="btn-accent btn-sm btn gap-2"
            onClick={() => openDeleteModal(user)}
          >
            <FiDelete />
            Delete
          </button>
        </div>
      </td>
    </tr>
  ));

  const usersTable = (
    <div className="overflow-x-auto bg-slate-50 p-10 md:container md:mx-auto">
      <table className="table-zebra table w-full">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>
              <div className="flex justify-end space-x-1">
                <button className="btn gap-2" onClick={onCreateUser}>
                  <FiPlusCircle />
                  Create User
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>{users.length > 0 ? userRows : noUserRow}</tbody>
      </table>
      <div className="flex justify-end">
        {users.length > 0 && (
          <Pagination
            currentPage={page}
            onPageSelect={onPageSelect}
            rowsPerPage={pageSize}
            totalElements={totalElements}
          />
        )}
      </div>
    </div>
  );

  const loadingSpinner = <LoadingSpinner />;

  return (
    //TODO min-h
    <section className="h-[calc(100vh-72px)] bg-slate-200">
      {loading ? loadingSpinner : usersTable}
      <DeleteUserModal
        user={selectedUser}
        isOpen={isDeleteModalOpen}
        onClose={() => onDeleteModalClose(false)}
      />
    </section>
  );
};

export default Users;
