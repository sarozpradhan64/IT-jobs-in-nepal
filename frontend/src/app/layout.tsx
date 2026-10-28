import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import MobileNavigation from "@/components/MobileNavigation";
import { Star } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Poppins, Righteous } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const righteous = Righteous({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-righteous",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IT Jobs Nepal | Every IT Job in Nepal",
  description:
    "Aggregating career pages, LinkedIn, and top portals for the Nepalese tech ecosystem.",
  keywords: ["IT jobs Nepal", "tech jobs Nepal", "software developer jobs", "Kathmandu tech jobs"],
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
    <html lang="en" className={`dark ${poppins.variable} ${righteous.variable}`}>
      <head>
        <title>IT Jobs Nepal</title>
      </head>
      <body className="min-h-screen flex flex-col bg-[#020617] text-[#f8fafc] font-sans antialiased selection:bg-[#6244c5]/30 pb-20 md:pb-0">
        {/* Top Sticky Header */}
        <header className="w-full top-0 sticky z-50 bg-[#020617]/85 backdrop-blur-xl border-b border-white/10 transition-colors">
          <div className="flex justify-between items-center h-18 px-6 max-w-7xl mx-auto w-full">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="IT Jobs Nepal Logo"
                  width={36}
                  height={36}
                  className="rounded-xl shadow-md border border-white/10"
                />
                <span className="font-righteous text-2xl tracking-wide text-white group-hover:text-secondary transition-colors">
                  IT<span className="text-secondary">Jobs</span>Nepal
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <Navigation />

            {/* GitHub Star CTA */}
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/sarozpradhan64/IT-jobs-in-nepal"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/40 text-secondary hover:text-white bg-secondary/10 hover:bg-secondary/25 transition-all duration-300 font-semibold text-xs tracking-wider uppercase shadow-sm group hover:-translate-y-0.5"
              >
                <SiGithub size={15} className="transition-transform group-hover:scale-110" />
                <span>Star on GitHub</span>
                {stars !== null && (
                  <>
                    <span className="w-px h-3.5 bg-secondary/30 mx-1"></span>
                    <span className="flex items-center gap-1 font-bold text-amber-300">
                      <Star size={13} className="fill-amber-400 stroke-amber-400" /> {stars}
                    </span>
                  </>
                )}
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="grow">{children}</main>

        {/* Footer */}
        <footer className="w-full py-12 bg-[#020617] border-t border-white/10 mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto gap-6 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2.5 mb-2">
                <Image
                  src="/logo.png"
                  alt="IT Jobs Nepal Logo"
                  width={24}
                  height={24}
                  className="rounded-md"
                />
                <span className="font-righteous text-xl text-white">
                  IT<span className="text-secondary">Jobs</span>Nepal
                </span>
              </div>
              <p className="font-sans text-sm text-slate-400">
                © {new Date().getFullYear()} IT Jobs Nepal. Open source.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
              <Link
                href="/jobs"
                className="text-slate-400 hover:text-secondary transition-colors"
              >
                Job Board
              </Link>
              <Link
                href="/companies"
                className="text-slate-400 hover:text-secondary transition-colors"
              >
                Companies
              </Link>
              <Link
                href="/about"
                className="text-slate-400 hover:text-secondary transition-colors"
              >
                About Project
              </Link>
              <Link
                href="https://github.com/sarozpradhan64/IT-jobs-in-nepal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-secondary transition-colors"
              >
                GitHub Repo
              </Link>
            </div>
          </div>
        </footer>

        {/* Floating Mobile Bottom Navigation */}
        <MobileNavigation />
      </body>
    </html>
  );
}
