import clsx from "clsx";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../lib/AuthContext";
import { clearStorage } from "../lib/storage";
import { sleep } from "../lib/util";

const LogoutButton = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    // TODO remove this
    await sleep(1000);

    const res = await fetch("/api/logout", {
      method: "POST",
      // body: JSON.stringify(data),
    });

    if (res.ok) {
      const user = await res.json();
      toast(`Logout successfull ${user.name}!`, {
        type: "success",
        position: "top-center",
      });

      clearStorage();
      setUser(null);
      router.push("/");
    } else {
      if (res.status === 401) {
        clearStorage();
        setUser(null);
      }

      toast("Logout failed!", {
        type: "error",
        position: "top-center",
      });
    }

    setLoading(false);
  };

  const btnClass = clsx("btn-outline btn", `${loading ? "loading" : ""}`);

  return (
    <button className={btnClass} onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
