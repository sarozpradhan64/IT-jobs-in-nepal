import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Navigation from "@/components/Navigation";

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
              <Link
                href="/"
                className="font-sans text-2xl font-bold text-on-surface"
              >
                IT Jobs Nepal
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
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Star on GitHub
                {stars !== null && (
                  <>
                    <span className="w-px h-4 bg-outline-variant/50 mx-1"></span>
                    <span className="flex items-center gap-1 font-bold">
                      ★ {stars}
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
