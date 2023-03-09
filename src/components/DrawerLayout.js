//components/DrawerLayout.tsx
import { useAuth } from "@/lib/AuthContext";
import { useDrawerOpen } from "@/lib/DrawerOpenContext";
import { clearToken } from "@/lib/storage";
import Link from "next/link";
import Navbar from "./Navbar";

const DrawerLayout = ({ children }) => {
  const { user, setUser } = useAuth();
  //initialize state here. we use a key and a default state
  const { open, setOpen } = useDrawerOpen();
  const toggleDrawer = () => setOpen(!open);

  const handleLogout = () => {
    // TODO logout api
    console.log("logout");
    // logoutUser();
    clearToken();
    setUser(null);
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
        <ul className="menu w-80 overflow-y-auto bg-secondary p-4">
          {!user && (
            <>
              <li onClick={toggleDrawer}>
                <Link href="/register" className="text-neutral">
                  Register
                </Link>
              </li>
              <li onClick={toggleDrawer}>
                <Link href="/login" className="text-neutral">
                  Login
                </Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li onClick={toggleDrawer}>
                <Link href="/profile" className="text-neutral">
                  Profile
                </Link>
              </li>
              <li onClick={toggleDrawer}>
                <button className="btn btn-outline" onClick={handleLogout}>
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
