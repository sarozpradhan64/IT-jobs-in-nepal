import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import { Star } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";

export const metadata: Metadata = {
  title: "IT Jobs Nepal | Every IT Job in Nepal",
  description:
    "Aggregating career pages, LinkedIn, and top portals for the Nepalese tech ecosystem.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const res = await fetch(
    "https://api.github.com/repos/sarozpradhan64/IT-jobs-in-nepal",
    { next: { revalidate: 3600 } },
  ).catch(() => null);
  const data = res?.ok ? await res.json() : null;
  const stars = data?.stargazers_count ?? null;

  return (
    <html lang="en" className="dark">
      <head>
        <title>IT Jobs Nepal</title>
      </head>
      <body className="min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container bg-surface text-on-surface">
        {/* Top Navigation Bar */}
        <header className="full-width top-0 sticky z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm transition-all duration-300">
          <div className="flex justify-between items-center h-16 px-md max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-xs">
              <Link
                href="/"
                className="flex items-center gap-3"
              >
                <Image src="/logo.png" alt="IT Jobs Nepal Logo" width={32} height={32} className="rounded-md" />
                <span className="font-sans text-2xl font-bold text-on-surface">IT Jobs Nepal</span>
              </Link>
            </div>
            <Navigation />
            <div className="flex items-center gap-md">
              <Link
                href="https://github.com/sarozpradhan64/IT-jobs-in-nepal"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 text-on-surface px-4 py-2 rounded-full font-mono text-sm transition-all"
              >
                <SiGithub size={16} />
                Star on GitHub
                {stars !== null && (
                  <>
                    <span className="w-px h-4 bg-outline-variant/50 mx-1"></span>
                    <span className="flex items-center gap-1 font-bold">
                      <Star size={14} className="fill-current" /> {stars}
                    </span>
                  </>
                )}
              </Link>
            </div>
          </div>
        </header>

        <main className="grow">{children}</main>

        <footer className="full-width py-xl bg-surface-container-lowest border-t border-outline-variant/10 shadow-none mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center px-md max-w-7xl mx-auto gap-md">
            <div className="text-center md:text-left">
              <p className="font-sans text-2xl font-bold text-on-surface mb-2">
                IT Jobs Nepal
              </p>
              <p className="font-sans text-base text-on-surface-variant opacity-80">
                © {new Date().getFullYear()} IT Jobs Nepal. Open Source.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-md">
              <Link
                href="/about"
                className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-mono text-sm"
              >
                Open Source
              </Link>
              <Link
                href="#"
                className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-mono text-sm"
              >
                Github
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
