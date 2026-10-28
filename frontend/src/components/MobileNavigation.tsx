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
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.6)]"
      style={{
        display: "flex",
        width: "100%",
        height: "64px",
        alignItems: "center",
        justifyContent: "space-around",
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
            className={`relative flex flex-col items-center justify-center h-full transition-all duration-200 select-none ${
              isActive
                ? "text-secondary font-semibold"
                : "text-slate-400 hover:text-slate-200 font-medium"
            }`}
            style={{
              flex: "1 1 0%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              textAlign: "center",
            }}
          >
            {isActive && (
              <span
                className="bg-secondary rounded-full"
                style={{
                  position: "absolute",
                  top: 0,
                  width: "32px",
                  height: "2px",
                }}
              />
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
            <span
              className="text-[10px] tracking-wider uppercase font-sans mt-1"
              style={{ fontSize: "10px", lineHeight: "12px" }}
            >
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
