
import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { COMPANIES } from '@/lib/config';
import { UpdateItem, Tag } from '@/lib/types';
import { UpdateCard } from '@/components/UpdateCard';
import { GroupedUpdateCard } from '@/components/GroupedUpdateCard';
import { groupUpdates } from '@/lib/grouping';
import { CompanyPageContent } from '@/components/CompanyPageContent';

export const revalidate = 60;

async function getUpdates(companyName: string): Promise<UpdateItem[]> {
    const filePath = path.join(process.cwd(), 'data', 'updates.json');
    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        const all: UpdateItem[] = JSON.parse(fileContents);
        return all.filter(u => u.company === companyName);
    } catch (error) {
        return [];
    }
}

type Props = {
    params: Promise<{ companyId: string }>;
    searchParams: Promise<{ tag?: string }>;
};

export default async function CompanyPage({ params, searchParams }: Props) {
    const { companyId } = await params;
    const { tag } = await searchParams;

    const companyConfig = COMPANIES.find(c => c.id === companyId);
    if (!companyConfig) return notFound();

    const updates = await getUpdates(companyConfig.name);

    return (
        <CompanyPageContent
            companyName={companyConfig.name}
            companyUrl={companyConfig.url}
            companyId={companyId}
            updates={updates}
            tag={tag}
        />
    );
}
