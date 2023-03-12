import { getUsers } from "@/lib/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// TODO
const ROWS_PER_PAGE = 5;

const Users = () => {
  const router = useRouter();
  const [page, setPage] = useState(router.query.page || 1);
  const [users, setUsers] = useState([]);

  let role;
  let pageSize;

  useEffect(() => {
    const abortController = new AbortController();

    const doGetUsers = async (role, page, pageSize, signal) => {
      try {
        const res = await getUsers(role, page, pageSize, signal);
        if (res?.data) {
          const users = res.data.elements;
          const totalElements = res.data.totalElements;
          const numberOfPages = Math.ceil(totalElements / ROWS_PER_PAGE);
          // https://www.youtube.com/watch?v=Wzt2uWlUEsI&ab_channel=AmitavRoy
          console.log("users ", users);
          console.log("totalElements ", totalElements);
          console.log("numberOfPages ", numberOfPages);
          setUsers(users);
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
  }, [role, page, pageSize]);

  const cards = users.map((user) => (
    <div
      className="card m-5 w-3/4 max-w-screen-lg bg-secondary shadow-xl"
      key={user.id}
    >
      <div className="card-body">
        <h2 className="card-title">{user.name}</h2>
        <p>{user.email}</p>
        <h3>{user.role}</h3>
        <div className="card-actions justify-end">
          <button className="btn">Edit</button>
        </div>
      </div>
    </div>
  ));

  const noResults = (
    <div className="card m-5 w-3/4 max-w-screen-lg bg-secondary shadow-xl">
      <div className="card-body">
        <h2>No Users found</h2>
      </div>
    </div>
  );

  return (
    <section className="min-h-max bg-primary">
      <div className="flex flex-col items-center justify-center">
        {cards.length > 0 ? cards : noResults}
      </div>
    </section>
  );
};

export default Users;
