import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DevJobs Nepal | Every IT Job in Nepal",
  description: "Aggregating career pages, LinkedIn, and top portals for the Nepalese tech ecosystem.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container bg-surface text-on-surface">
        {/* Top Navigation Bar */}
        <header className="full-width top-0 sticky z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm transition-all duration-300">
          <div className="flex justify-between items-center h-16 px-md max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-xs">
              <Link href="/" className="font-sans text-2xl font-bold text-on-surface">
                DevJobs Nepal
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-lg">
              <Link
                href="/jobs"
                className="text-primary relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full font-mono text-sm"
              >
                Job Board
              </Link>
              <Link href="/companies" className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-mono text-sm">
                Companies
              </Link>
              <Link href="/sources" className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-mono text-sm">
                Sources
              </Link>
              <Link href="/about" className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-mono text-sm">
                About
              </Link>
            </nav>
            <div className="flex items-center gap-md">
              <button className="hidden lg:block bg-primary text-on-primary px-6 py-2 rounded-full font-mono text-sm hover:opacity-90 active:scale-95 transition-all">
                Post a Job
              </button>
            </div>
          </div>
        </header>

        <main className="grow">{children}</main>

        <footer className="full-width py-xl bg-surface-container-lowest border-t border-outline-variant/10 shadow-none mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center px-md max-w-7xl mx-auto gap-md">
            <div className="text-center md:text-left">
              <p className="font-sans text-2xl font-bold text-on-surface mb-2">DevJobs Nepal</p>
              <p className="font-sans text-base text-on-surface-variant opacity-80">
                © {new Date().getFullYear()} DevJobs Nepal. Open Source.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-md">
              <Link href="/about" className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-mono text-sm">
                Open Source
              </Link>
              <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-mono text-sm">
                Github
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
