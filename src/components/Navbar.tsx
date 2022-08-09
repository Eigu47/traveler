import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed z-10 flex h-14 w-screen flex-row items-center justify-between border-b-2 border-white/75 bg-indigo-800/50 backdrop-blur-md">
      <Link href="/">
        <a className="mx-6 text-3xl text-white">Traveler</a>
      </Link>
      <div>
        <Link href="/">
          <a className="mx-6 text-white">Home</a>
        </Link>
        <a className="mx-6 text-white">Search</a>
        <a className="mx-6 text-white">Log In</a>
      </div>
    </nav>
  );
}
