import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUser } from "../../lib/api";
import { clearStorage } from "../../lib/storage";

const EditUser = () => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  const doGetUser = async (id, signal) => {
    try {
      setLoading(true);
      // TODO remove this
      await sleep(1000);
      const res = await getUser(id, signal);
      if (res?.data) {
        const user = res.data;
        setUser(user);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error(error.message);
        /* Logic for non-aborted error handling goes here. */
        if (error.response?.data?.statusCode === 404) {
          router.push("/users");
          toast("User not found!", {
            type: "error",
            position: "top-center",
          });
        }

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

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const abortController = new AbortController();
    doGetUser(router.query.id, abortController.signal);

    /* 
      Abort the request as it isn't needed anymore, the component being 
      unmounted. It helps avoid, among other things, the well-known "can't
      perform a React state update on an unmounted component" warning.
    */
    return () => abortController.abort();
  }, [router.isReady, router.query.id]);

  const handleEdit = () => {
    router.push("/edit-profile");
  };

  return (
    <section className="h-[calc(100vh-72px)] bg-slate-200">
      <div className="flex flex-col items-center py-20">
        <div className="card m-5 w-3/4 max-w-screen-lg bg-slate-50 shadow-xl">
          <div className="card-body">
            <div className="card-title">
              <h1>My Profile</h1>
            </div>
            <div className="grid auto-cols-auto grid-cols-5 gap-4">
              <div className="text-right">
                <h2>Full Name:</h2>
              </div>
              <div className="col-span-4">
                <h2>{user?.name}</h2>
              </div>
              <div className="text-right">Email:</div>
              <div className="col-span-4">{user?.email}</div>
              <div className="text-right">
                <h3>Role:</h3>
              </div>
              <div className="col-span-4">
                <h3>{user?.role}</h3>
              </div>
            </div>
            <div className="card-actions justify-end">
              <button className="btn" onClick={handleEdit}>
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditUser;
