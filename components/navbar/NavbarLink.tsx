import { useAtom } from "jotai";
import Link from "next/link";
import { UrlObject } from "url";
import { showHamburgerAtom } from "../../utils/store";

interface Props {
  name: string;
  href: UrlObject | string;
  onClick?: () => void;
}

export function NavbarLink({ name, href, onClick }: Props) {
  const [, setShowHamburger] = useAtom(showHamburgerAtom);

  return (
    <Link href={href}>
      <a
        onClick={() => {
          setShowHamburger(false);
          if (onClick) onClick();
        }}
        className="hover:text-slate-300"
      >
        {name}
      </a>
    </Link>
  );
}
