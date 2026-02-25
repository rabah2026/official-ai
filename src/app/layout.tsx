import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Official.ai | Only Official Updates",
  description: "Official announcements from the world's leading AI labs. Zero noise, verified sources.",
};

import { promises as fs } from "fs";
import path from "path";

// Force dynamic rendering to ensure we always read the latest metadata from disk
export const dynamic = 'force-dynamic';

import { Providers } from "@/components/Providers";
import { MainLayout } from "@/components/MainLayout";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const meta = await getMetadata();
  const lastUpdated = meta.lastUpdated;

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <MainLayout lastUpdated={lastUpdated}>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  );
}
