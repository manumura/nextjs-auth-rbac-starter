//components/Navbar.tsx

import { useAuth } from "@/lib/AuthContext";
import { useDrawerOpen } from "@/lib/DrawerOpenContext";
import { clearToken } from "@/lib/storage";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/next.svg";

const Navbar = () => {
  // TODO test
  const { user, setUser } = useAuth();
  console.log("user ", user);

  const handleLogout = () => {
    // TODO logout api
    // logoutUser();
    clearToken();
    setUser(null);
  };

  // https://reacthustle.com/blog/how-to-create-a-responsive-navbar-in-react-with-tailwindcss-daisyui
  // toggle our drawer using useSessionStorage global state
  const { open, setOpen } = useDrawerOpen();
  const toggleDrawer = () => setOpen(!open);
  console.log('open ', open);

  return (
    <div className="navbar w-full bg-secondary">
      {/* Mobile menu button only shows for lg and below devices */}
      <div className="flex-none lg:hidden">
        <label className="btn-ghost btn-square btn" onClick={toggleDrawer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-6 w-6 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
      </div>
      {/* Website logo */}
      <div className="mx-2 flex-1 px-2">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src={logo}
              height="20"
              alt="Picture of the author"
              placeholder="empty"
            />
          </Link>
          <Link href="/">
            <span className="pl-5 text-2xl font-semibold text-neutral">
              MyApp
            </span>
          </Link>
        </div>
      </div>
      {/* Desktop menu only shows for lg and up devices */}
      <div className="hidden flex-none lg:block">
        <ul className="menu menu-horizontal rounded-box p-2">
          {!user && (
            <>
              <li>
                <Link href="/register" className="text-neutral">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-neutral">
                  Login
                </Link>
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

export default Navbar;