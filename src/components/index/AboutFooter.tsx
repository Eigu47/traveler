import { SiGithub } from "react-icons/si";

interface Props {}

export default function AboutFooter({}: Props) {
  return (
    <footer className="mt-10 flex items-center justify-center bg-slate-400">
      <a
        className="flex items-center space-x-2 py-6 text-xl duration-100 hover:text-blue-700"
        href="https://github.com/Eigu47/traveler"
        rel="noreferrer"
        target="_blank"
      >
        <p>About</p>
        <SiGithub />
      </a>
    </footer>
  );
}
