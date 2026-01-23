import { promises as fs } from 'fs';
import path from 'path';
import { UpdateItem } from '@/lib/types';
import { CompaniesPageContent } from '@/components/CompaniesPageContent';

async function getUpdates(): Promise<UpdateItem[]> {
    const filePath = path.join(process.cwd(), 'data', 'updates.json');
    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        return [];
    }
}

export default async function CompaniesPage() {
    const updates = await getUpdates();
    return <CompaniesPageContent updates={updates} />;
}
