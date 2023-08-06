"use client";

import clsx from "clsx";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { clearStorage } from "../lib/storage";
import useUserStore from "../lib/user-store";
import { sleep } from "../lib/utils";
import { logout } from "../lib/api";

const LogoutButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const userStore = useUserStore();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      // TODO remove this
      await sleep(1000);

      const res = await logout();
      const response = res?.data;

      toast(`Logout successfull ${response.name}!`, {
        type: "success",
        position: "top-center",
      });
    } catch (error) {
      toast(`Logout failed! ${error?.response?.data?.message}`, {
        type: "error",
        position: "top-center",
      });
    } finally {
      setLoading(false);

      clearStorage();
      userStore.setUser(undefined);

      if (pathname !== "/") {
        router.push("/");
      }
      router.refresh();
    }
  };

  const btn = (
    <button className="btn-outline btn" onClick={handleLogout}>
      Logout
    </button>
  );
  const btnLoading = (
    <button className="btn-outline btn">
      <span className="loading loading-spinner"></span>
      Logout
    </button>
  );

  return loading ? btnLoading : btn;
};

export default LogoutButton;
