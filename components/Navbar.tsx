import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed z-20 flex h-14 w-screen flex-row items-center justify-between border-b-2 border-black/5 bg-gradient-to-r from-indigo-800 via-blue-800 to-indigo-800 px-4 text-white shadow-md sm:px-8">
      <Link href="/">
        <a className="text-3xl">traveler</a>
      </Link>
      <div className="hidden space-x-16 sm:block">
        <Link href="/">Home</Link>
        <Link href="/map">Search</Link>
        <Link href="/">Log In</Link>
      </div>
    </nav>
  );
}
