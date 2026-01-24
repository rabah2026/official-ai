
import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { UpdateCard } from '@/components/UpdateCard';
import { FeaturedCard } from '@/components/FeaturedCard';
import { GroupedUpdateCard } from '@/components/GroupedUpdateCard';
import { UpdateItem, Tag } from '@/lib/types';
import { groupUpdates } from '@/lib/grouping';
import { HomePageContent } from '@/components/HomePageContent';

export const revalidate = 60;

async function getUpdates(): Promise<UpdateItem[]> {
  const filePath = path.join(process.cwd(), 'data', 'updates.json');
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const updates = JSON.parse(fileContents);
    // Sort by date desc
    return updates.sort((a: UpdateItem, b: UpdateItem) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.warn("Could not read data/updates.json", error);
    return [];
  }
}

type Props = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { tag } = await searchParams;
  const updates = await getUpdates();

  return <HomePageContent updates={updates} tag={tag} />;
}
