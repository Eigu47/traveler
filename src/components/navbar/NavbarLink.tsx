import { useAtom } from "jotai";
import Link from "next/link";
import { UrlObject } from "url";

import { showHamburgerAtom } from "@/utils/store";

interface Props {
  children: JSX.Element | string;
  href: UrlObject | string;
  onClick?: () => void;
  className?: string;
}

export function NavbarLink({ children, href, onClick, className }: Props) {
  const [, setShowHamburger] = useAtom(showHamburgerAtom);

  return (
    <Link href={href}>
      <a
        onClick={() => {
          setShowHamburger(false);
          if (onClick) onClick();
        }}
        className={`hover:text-slate-300 ${className}`}
      >
        {children}
      </a>
    </Link>
  );
}
