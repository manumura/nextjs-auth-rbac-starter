import { Pagination } from "@/components/Pagination";
import { axiosInstance } from "@/lib/api";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { FiDelete, FiEdit, FiPlusCircle } from "react-icons/fi";
import DeleteUserModal from "../../components/DeleteUserModal";
import appConfig from "../../config/config";
import { getAuthCookies, setAuthCookies } from "../../lib/cookies";

export async function getServerSideProps(ctx: NextPageContext) {
  const { req, res, query } = ctx;

  try {
    const page = query.page || 1;
    const pageSize = appConfig.defaultRowsPerPage;
    // TODO filter by role
    const role = undefined;

    const authCookies = getAuthCookies(req, res);
    const response = await axiosInstance.get("/v1/users", {
      params: { role, page, pageSize },
      headers: {
        Cookie: authCookies,
      },
    });

    // Set new cookies in case tokens are expired (set from axios interceptor)
    setAuthCookies(response.config?.headers, res);

    const users = response.data.elements;
    const totalElements = response.data.totalElements;
    return { props: { users, totalElements, page, pageSize } };
  } catch (err) {
    console.error("Get Users getServerSideProps error: ", err.response?.data);
    // Set new cookies in case tokens are expired (set from axios interceptor)
    setAuthCookies(err.response?.headers, res);

    return {
      redirect: {
        permanent: false,
        destination: `/error?code=${err.response?.data?.statusCode}`,
      },
      props: {},
    };
  }
}

const Users = ({ users, totalElements, page, pageSize }) => {
  const router = useRouter();
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

  return (
    <section className="h-[calc(100vh-72px)] bg-slate-200">
      {usersTable}
      <DeleteUserModal
        user={selectedUser}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
      />
    </section>
  );
};

export default Users;
