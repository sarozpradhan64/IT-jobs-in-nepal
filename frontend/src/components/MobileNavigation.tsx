"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, BriefcaseBusiness, Building2, Info } from "lucide-react";

export default function MobileNavigation() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home", icon: House },
    { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
    { href: "/companies", label: "Companies", icon: Building2 },
    { href: "/about", label: "About", icon: Info },
  ];

  return (
    <nav
      className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 w-full items-center justify-around bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.6)]"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {navLinks.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname === link.href || pathname.startsWith(link.href + "/");

        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative flex flex-1 flex-col items-center justify-center h-full text-center transition-all duration-200 select-none ${
              isActive
                ? "text-secondary font-semibold"
                : "text-slate-400 hover:text-slate-200 font-medium"
            }`}
          >
            {isActive && (
              <span className="bg-secondary rounded-full absolute top-0 w-8 h-[2px]" />
            )}
            <div
              className={`transition-transform duration-200 ${
                isActive ? "scale-110" : ""
              }`}
            >
              <Icon
                size={20}
                className={
                  isActive
                    ? "stroke-secondary stroke-[2.25px]"
                    : "stroke-slate-400 stroke-2"
                }
              />
            </div>
            <span className="text-[10px] leading-3 tracking-wider uppercase font-sans mt-1">
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
