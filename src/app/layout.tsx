import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Official.ai | Only Official Updates",
  description: "Official announcements from the world's leading AI labs. Zero noise, verified sources.",
};

import { promises as fs } from "fs";
import path from "path";

// Function to get last updated metadata
async function getMetadata() {
  const filePath = path.join(process.cwd(), 'data', 'metadata.json');
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    return { lastUpdated: new Date().toISOString() };
  }
}

import { Providers } from "@/components/Providers";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const meta = await getMetadata();
  const lastUpdated = new Date(meta.lastUpdated).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {/* Header */}
          <header className="site-header">
            <div className="header-inner">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Link href="/" className="site-logo">
                  Official.ai
                </Link>
                <span style={{
                  fontSize: '0.65rem',
                  color: '#737373',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginTop: '0.25rem'
                }}>
                  Last Updated: {lastUpdated}
                </span>
              </div>
              <nav className="site-nav" style={{ alignItems: 'center' }}>
                <Link href="/companies">Companies</Link>
                <Link href="/digest">Weekly Digest</Link>
                <ThemeToggle />
              </nav>
            </div>
          </header>

          <main>
            {children}
          </main>

          {/* Footer */}
          <footer className="site-footer">
            <div className="container-max footer-content">
              <p className="footer-tagline">Signal over noise</p>
              <div className="footer-links">
                <Link href="/companies">All Companies</Link>
                <Link href="/digest">Subscribe</Link>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
