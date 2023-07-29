"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { ToastContainer } from "react-toastify";
import useDrawerOpenStore from "../lib/drawer-open-store";
import { isAdmin } from "../lib/utils";
import LogoutButton from "./LogoutButton";
import Navbar from "./Navbar";

const DrawerLayout = ({ user, children }) => {
  //initialize state here. we use a key and a default state
  const { open, setOpen } = useDrawerOpenStore();
  const toggleDrawer = () => setOpen(!open);

  const handleLogin = () => {
    redirect("/login");
  };

  return (
    <div className="drawer">
      <input
        id="app-drawer"
        type="checkbox"
        className="drawer-toggle"
        // checked property will now reflect our open state
        checked={open}
        onChange={toggleDrawer}
      />

      <div className="drawer-content flex flex-col">
        <Navbar user={user} />
        {/* <Suspense fallback={<LoadingOverlay />}> */}
          {children}
        {/* </Suspense> */}
      </div>

      <div className="drawer-side">
        <label htmlFor="app-drawer" className="drawer-overlay"></label>
        <ul
          className="menu w-80 overflow-y-auto bg-slate-50 p-4"
          onClick={toggleDrawer}
        >
          {!user && (
            <>
              <li>
                <Link href="/register" className="text-neutral">
                  Register
                </Link>
              </li>
              <li>
                <button className="btn-outline btn" onClick={handleLogin}>
                  Login
                </button>
              </li>
            </>
          )}
          {user && (
            <>
              {isAdmin(user) && (
                <li>
                  <Link href="/users" className="text-neutral">
                    Users
                  </Link>
                </li>
              )}
              <li>
                <Link href="/profile" className="text-neutral">
                  Profile
                </Link>
              </li>
              <li>
                <LogoutButton />
              </li>
            </>
          )}
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DrawerLayout;
