"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/jobs", label: "JOB BOARD" },
    { href: "/companies", label: "COMPANIES" },
    { href: "/about", label: "ABOUT" },
  ];

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {navLinks.map((link) => {
        const isActive =
          link.href === "/jobs"
            ? pathname === "/jobs" || pathname.startsWith("/jobs/") || pathname === "/"
            : pathname === link.href || pathname.startsWith(link.href + "/");

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              relative py-2 text-sm font-semibold tracking-wider uppercase transition-all duration-300
              ${isActive ? "text-secondary" : "text-slate-300 hover:text-white"}
              after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] 
              after:bg-secondary after:transform after:transition-transform after:duration-300
              ${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}
            `}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
