import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Official.ai | Only Official Updates",
  description: "Official announcements from the world's leading AI labs. Zero noise, verified sources.",
  other: {
    // Preconnect for Google Fonts
    'link-preconnect-1': 'https://fonts.googleapis.com',
    'link-preconnect-2': 'https://fonts.gstatic.com',
  },
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet" />
      </head>
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
