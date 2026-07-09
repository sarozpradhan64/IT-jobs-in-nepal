"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/jobs", label: "Job Board" },
    { href: "/companies", label: "Companies" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="hidden md:flex items-center gap-lg">
      {navLinks.map((link) => {
        const isActive = pathname === link.href || (pathname === '/' && link.href === '/jobs');

        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              isActive
                ? "text-primary relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full font-mono text-sm transition-colors duration-200"
                : "text-on-surface-variant hover:text-primary transition-colors duration-200 font-mono text-sm"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
