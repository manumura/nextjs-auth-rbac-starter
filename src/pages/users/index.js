import { Pagination } from "@/components/Pagination";
import { getUsers } from "@/lib/api";
import { DEFAULT_ROWS_PER_PAGE } from "@/lib/constant";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Users = () => {
  const router = useRouter();
  const [page, setPage] = useState(router.query.page || 1);
  const [pageSize, setPageSize] = useState(DEFAULT_ROWS_PER_PAGE);
  const [users, setUsers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);

  // TODO role filter
  let role;

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    // console.log("router.query.page ", router.query.page);
    setPage(router.query.page || 1);
    // console.log("page ", page);

    const abortController = new AbortController();

    const doGetUsers = async (role, page, pageSize, signal) => {
      try {
        const res = await getUsers(role, page, pageSize, signal);
        if (res?.data) {
          const users = res.data.elements;
          const totalElements = res.data.totalElements;
          setUsers(users);
          setTotalElements(totalElements);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          /* Logic for non-aborted error handling goes here. */
          console.error(error.message);
        }
      }
    };

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

  const cards = users.map((user) => (
    <tr key={user.id}>
      <th>{user.id}</th>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
    </tr>
  ));

  const table = (
    <div className="overflow-x-auto p-5">
      <table className="table-zebra table w-full">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
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

  const noResults = (
    <div className="my-20 flex flex-col items-center justify-center">
      <div className="card m-5 w-3/4 max-w-screen-lg bg-slate-50 shadow-xl">
        <div className="card-body text-center">
          <h2>No Users found</h2>
        </div>
      </div>
    </div>
  );

  return (
    <section className="min-h-max bg-slate-50">
      {cards.length > 0 ? table : noResults}
    </section>
  );
};

export default Users;
