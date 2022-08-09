export default function Navbar() {
  return (
    <nav className="fixed z-10 flex w-screen flex-row items-center border-b-2 border-white/75 bg-indigo-800/50 backdrop-blur-md">
      <p className="flex-1 px-6 text-3xl text-white">Traveler.</p>
      <p className="p-6 text-white">Home</p>
      <p className="p-6 text-white">Search</p>
      <p className="p-6 pr-12 text-white">Log In</p>
    </nav>
  );
}
