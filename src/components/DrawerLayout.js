//components/DrawerLayout.tsx
import { logout } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { useDrawerOpen } from "@/lib/DrawerOpenContext";
import { clearStorage } from "@/lib/storage";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

const DrawerLayout = ({ children }) => {
  const router = useRouter();
  const { user, setUser } = useAuth();
  //initialize state here. we use a key and a default state
  const { open, setOpen } = useDrawerOpen();
  const toggleDrawer = () => setOpen(!open);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    try {
      const res = await logout();
      const user = res?.data;
      toast(`Logout successfull ${user?.name}!`, {
        type: "success",
        position: "top-right",
      });

      clearStorage();
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error(err);
    }
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
              <li>
                <Link href="/profile" className="text-neutral">
                  Profile
                </Link>
              </li>
              <li>
                <button className="btn-outline btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DrawerLayout;
