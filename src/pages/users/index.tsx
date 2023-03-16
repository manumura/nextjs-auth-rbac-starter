import { Pagination } from "@/components/Pagination";
import { getUsers } from "@/lib/api";
import { DEFAULT_ROWS_PER_PAGE } from "@/lib/constant";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DeleteUserModal from "../../components/DeleteUserModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import { clearStorage } from "../../lib/storage";
import { FiDelete, FiEdit } from "react-icons/fi";

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

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    setPage(router.query.page || 1);
    const abortController = new AbortController();

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
    };

    doGetUsers(role, page, pageSize, abortController.signal);

    // TODO test to remove
    function sleep(ms) {
      return new Promise((resolve, reject) => setTimeout(resolve, ms));
    }
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
    console.log(user);
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const onDeleteModalClose = () => {
    console.log("close modal");
    setIsDeleteModalOpen(false);
  };

  const cards = users.map((user) => (
    <tr key={user.id}>
      <th>{user.id}</th>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        <div className="flex justify-center space-x-1">
          <button className="btn-primary btn gap-2">
            <FiEdit />
            Edit
          </button>
          <button
            className="btn-accent btn gap-2"
            onClick={() => openDeleteModal(user)}
          >
            <FiDelete />
            Delete
          </button>
        </div>
      </td>
    </tr>
  ));

  const table = (
    <div className="overflow-x-auto bg-slate-50 p-10 md:container md:mx-auto">
      <table className="table-zebra table w-full">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{cards}</tbody>
      </table>
      <div className="flex justify-end">
        <Pagination
          currentPage={page}
          onPageSelect={onPageSelect}
          rowsPerPage={pageSize}
          totalElements={totalElements}
        />
      </div>
    </div>
  );

  const noResultsCard = (
    <div className="my-20 flex flex-col items-center justify-center">
      <div className="card m-5 w-3/4 max-w-screen-lg bg-slate-200 shadow-xl">
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
      {loading ? loadingSpinner : cards.length > 0 ? table : noResultsCard}
      <DeleteUserModal
        user={selectedUser}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
      />
    </section>
  );
};

export default Users;
