//components/DrawerLayout.tsx
import { useDrawerOpen } from "@/lib/DrawerOpenContext";
import Link from "next/link";
import { useRouter } from "next/router";
import useUserStore from "../lib/user-store";
import { isAdmin } from "../lib/util";
import LogoutButton from "./LogoutButton";
import Navbar from "./Navbar";

const DrawerLayout = ({ children }) => {
  const router = useRouter();
  const userStore = useUserStore();
  const user = userStore.user;
  //initialize state here. we use a key and a default state
  const { open, setOpen } = useDrawerOpen();
  const toggleDrawer = () => setOpen(!open);

  const handleLogin = () => {
    router.push("/login");
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
        <Navbar />
        {children}
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
    </div>
  );
};

export default DrawerLayout;
