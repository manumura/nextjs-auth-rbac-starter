import { Pagination } from "@/components/Pagination";
import { getUsers } from "@/lib/api";
import { DEFAULT_ROWS_PER_PAGE } from "@/lib/constant";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DeleteUserModal from "../../components/DeleteUserModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import { clearStorage } from "../../lib/storage";
import { FiDelete, FiEdit, FiPlusCircle } from "react-icons/fi";

export async function getServerSideProps({ req }) {
  // Redirect if user is not authenticated
  const accessToken = req?.cookies?.accessToken;
  if (!accessToken) {
    return {
      redirect: {
        permanent: false,
        destination: "/login?error=401",
      },
      props: {},
    };
  }

  return {
    props: {},
  };
}

const Users = () => {
  const router = useRouter();
  const [page, setPage] = useState(router.query.page || 1);
  const [pageSize, setPageSize] = useState(DEFAULT_ROWS_PER_PAGE);
  const [users, setUsers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // TODO role filter
  let role;

  const doGetUsers = async (role, page, pageSize, signal) => {
    try {
      setLoading(true);
      // TODO remove this
      await sleep(1000);
      const res = await getUsers(role, page, pageSize, signal);
      if (res?.data) {
        const users = res.data.elements;
        const totalElements = res.data.totalElements;
        setUsers(users);
        setTotalElements(totalElements);

        if (page !== 1 && users.length <= 0) {
          router.replace("users?page=1");
        }
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error(error.message);
        /* Logic for non-aborted error handling goes here. */
        if (error.response?.data?.statusCode === 401) {
          clearStorage();
          router.push(`/login?error=${error?.response?.data?.statusCode}`);
        }
      }
    } finally {
      setLoading(false);
    }

    // TODO test to remove
    function sleep(ms) {
      return new Promise((resolve, reject) => setTimeout(resolve, ms));
    }
  };

  // TODO move get users to getServerSideProps
  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const abortController = new AbortController();
    setPage(router.query.page || 1);
    doGetUsers(role, page, pageSize, abortController.signal);

    /* 
      Abort the request as it isn't needed anymore, the component being 
      unmounted. It helps avoid, among other things, the well-known "can't
      perform a React state update on an unmounted component" warning.
    */
    return () => abortController.abort();
  }, [role, page, pageSize, router.isReady, router.query.page]);

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
      // router.reload();
      // TODO remove from users array
      // const newUsers = users.filter((user) => user.id !== selectedUser.id);
      // setUsers(newUsers);
      // console.log('totalElements ', totalElements);
    }
  };

  const handleEditUser = (userId) => {
    router.push(`users/${userId}`);
  };

  const onCreateUser = () => {
    router.push('create-user');
  };

  const noUserRow = (
    <tr>
      <td colSpan={5} className="text-center font-bold">No Users found</td>
    </tr>
  );

  const userRows = users.map((user) => (
    <tr key={user.id}>
      <th>{user.id}</th>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        <div className="flex space-x-1 justify-end">
          <button className="btn-primary btn-sm btn gap-2" onClick={() => handleEditUser(user.id)}>
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
              <div className="flex space-x-1 justify-end">
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

  const noResultsCard = (
    <div className="my-20 flex flex-col items-center justify-center">
      <div className="card m-5 w-3/4 max-w-screen-lg bg-slate-50 shadow-xl">
        <div className="card-body text-center">
          <h2>No Users found</h2>
        </div>
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
        onClose={onDeleteModalClose}
      />
    </section>
  );
};

export default Users;
