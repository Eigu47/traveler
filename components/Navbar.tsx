import { useAtom } from "jotai";
import Link from "next/link";
import { showHamburgerAtom } from "../utils/store";
import { useSession, signIn, signOut } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function Navbar() {
  const [showHamburger, setShowHamburger] = useAtom(showHamburgerAtom);
  const { data: session } = useSession();

  return (
    <nav
      className={`fixed z-20 h-fit w-screen flex-row items-center justify-between border-b-2 border-black/10 bg-gradient-to-r from-indigo-800 via-blue-800 to-indigo-800 text-slate-100 shadow-md duration-200 sm:flex sm:h-14 sm:translate-y-0 sm:px-8 sm:transition-none ${
        showHamburger ? "" : "-translate-y-full"
      }`}
    >
      <div className="hidden text-3xl sm:block">
        <Link href="/">traveler</Link>
      </div>
      <div
        className={`flex flex-col items-center justify-center space-y-4 py-4 pt-8 sm:flex sm:flex-row sm:space-y-0 sm:space-x-16 sm:py-0 ${
          showHamburger ? "" : ""
        }`}
      >
        {LINKS.map((link) => (
          <Link href={link.link} key={link.id}>
            <a
              onClick={() => setShowHamburger(false)}
              className="hover:text-slate-300"
            >
              {link.id}
            </a>
          </Link>
        ))}
        {session ? (
          <Link href="/">
            <a
              onClick={() => {
                setShowHamburger(false);
                signOut({ redirect: false });
              }}
              className="hover:text-slate-300"
            >
              Account
            </a>
          </Link>
        ) : (
          <button
            className="flex items-center space-x-1 hover:text-slate-300"
            onClick={() => signIn("google")}
          >
            <span>Sign with</span>
            <FcGoogle />
          </button>
        )}
      </div>
    </nav>
  );
}

const LINKS = [
  {
    id: "Home",
    link: "/",
  },
  {
    id: "Search",
    link: "/map",
  },
  {
    id: "About",
    link: "/",
  },
];
