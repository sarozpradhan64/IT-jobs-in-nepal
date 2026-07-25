"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Building2, Info } from "lucide-react";

export default function MobileNavigation() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
    { href: "/companies", label: "Companies", icon: Building2 },
    // { href: "/about", label: "About", icon: Info },
  ];

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/20 grid grid-cols-3 h-16 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {navLinks.map((link) => {
        const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');

        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200 ${
              isActive
                ? "text-primary scale-105"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <Icon 
              size={20} 
              className={`transition-all duration-200 ${isActive ? "fill-primary/20 stroke-primary stroke-[2.5px]" : "stroke-2"}`} 
            />
            <span className={`text-[10px] font-sans ${isActive ? 'font-bold' : 'font-medium'}`}>
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
