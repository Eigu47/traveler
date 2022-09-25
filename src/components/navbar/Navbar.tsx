import { useAtom } from "jotai";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";

import { NavbarLink } from "@/components/navbar/NavbarLink";
import NavbarMenuButton from "@/components/navbar/NavbarMenuButton";
import { showHamburgerAtom } from "@/utils/store";

export default function Navbar() {
  const [showHamburger, setShowHamburger] = useAtom(showHamburgerAtom);
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <>
      <nav
        className={`fixed z-20 w-full flex-row items-center border-b-2 border-black/10 bg-gradient-to-r from-indigo-800 via-blue-800 to-indigo-800 text-slate-100 shadow-md duration-200 sm:flex sm:h-14 sm:translate-y-0 sm:transition-none ${
          showHamburger ? "" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex flex-col items-center space-y-4 py-4 px-4 sm:container sm:flex-row sm:space-y-0 sm:space-x-16 2xl:min-w-full 2xl:p-16">
          <NavbarLink href="/" className="hidden grow text-3xl sm:block">
            traveler
          </NavbarLink>
          <NavbarLink href="/"> Home </NavbarLink>
          {router.pathname !== "/map" && (
            <NavbarLink href="/map"> Map </NavbarLink>
          )}
          {session && (
            <NavbarLink
              href={{
                pathname: "/map",
                query: { favs: true },
              }}
            >
              Favorites
            </NavbarLink>
          )}
          {/* <NavbarLink href="/" > About </NavbarLink> */}
          {session && (
            <button
              className="hover:text-slate-300"
              onClick={() => {
                setShowHamburger(false);
                signOut({ redirect: false });
              }}
            >
              Sign out
            </button>
          )}
          {!session && (
            <button
              className="flex items-center space-x-1 hover:text-slate-300"
              onClick={() => signIn("google")}
            >
              <span>Sign in with</span>
              <FcGoogle />
            </button>
          )}
        </div>
      </nav>
      <NavbarMenuButton />
    </>
  );
}
