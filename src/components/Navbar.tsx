//components/Navbar.tsx

import { logout } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { useDrawerOpen } from "@/lib/DrawerOpenContext";
import { clearStorage } from "@/lib/storage";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import logo from "../../public/next.svg";

const Navbar = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
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
      toast("Logout failed!", {
        type: "error",
        position: "top-center",
      });
    }
  };

  // https://reacthustle.com/blog/how-to-create-a-responsive-navbar-in-react-with-tailwindcss-daisyui
  // toggle our drawer using useSessionStorage global state
  const { open, setOpen } = useDrawerOpen();
  const toggleDrawer = () => setOpen(!open);

  return (
    <div className="navbar">
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
            <Image src={logo} height="20" alt="Logo" placeholder="empty" />
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
        <ul className="menu rounded-box menu-horizontal p-2">
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
                <Link href="/users" className="text-neutral">
                  Users
                </Link>
              </li>
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

export default Navbar;
