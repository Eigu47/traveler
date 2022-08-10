import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed z-10 flex h-12 w-screen flex-row items-center justify-between border-b-2 border-white/75 bg-indigo-800/50 text-white backdrop-blur-md">
      <Link href="/">
        <a className="mx-6 text-2xl">Traveler</a>
      </Link>
      <div>
        <Link href="/">
          <a className="mx-6">Home</a>
        </Link>
        <a className="mx-6">Search</a>
        <a className="mx-6">Log In</a>
      </div>
    </nav>
  );
}
