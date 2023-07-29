"use client";

import clsx from "clsx";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { clearStorage } from "../lib/storage";
import useUserStore from "../lib/user-store";
import { sleep } from "../lib/utils";

const LogoutButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const userStore = useUserStore();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) {
      return;
    }
    
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
      userStore.setUser(null);

      if (pathname !== "/") {
        router.push("/");
      }
      router.refresh();
    } else {
      if (res.status === 401) {
        clearStorage();
        userStore.setUser(null);
      }

      toast("Logout failed!", {
        type: "error",
        position: "top-center",
      });
    }

    setLoading(false);
  };

  const btnClass = clsx("btn-outline btn", `${loading ? "loading btn-disabled" : ""}`);

  return (
    <button className={btnClass} onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
