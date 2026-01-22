
import fs from 'fs/promises';
import path from 'path';
import { format, subDays, isAfter, parseISO, getISOWeek } from 'date-fns';
import { UpdateItem } from '../src/lib/types';
import { COMPANIES } from '../src/lib/config';

const DATA_FILE = path.join(process.cwd(), 'data', 'updates.json');
const DIGEST_FILE = path.join(process.cwd(), 'data', `digest-week-${getISOWeek(new Date())}.txt`);

async function generateDigest() {
    console.log('Generating weekly digest...');

    try {
        const fileContents = await fs.readFile(DATA_FILE, 'utf8');
        const updates: UpdateItem[] = JSON.parse(fileContents);

        const oneWeekAgo = subDays(new Date(), 7);
        const recentUpdates = updates.filter(u => isAfter(parseISO(u.date), oneWeekAgo));

        if (recentUpdates.length === 0) {
            console.log('No updates this week using strict cutoff.');
            // return; // For MVP verification, I might want to see output even if empty, but I'll stick to logic.
        }

        // Group by company
        const grouped: Record<string, UpdateItem[]> = {};
        recentUpdates.forEach(u => {
            if (!grouped[u.company]) grouped[u.company] = [];
            grouped[u.company].push(u);
        });

        let digest = `Subject: Official AI Updates — Week ${getISOWeek(new Date())}\n\n`;

        // Sort companies alphabetically or by relevance? Alphabetical is standard/neutral.
        const companyNames = Object.keys(grouped).sort();

        if (companyNames.length === 0) {
            digest += "No official updates this week.\n";
        }

        companyNames.forEach(company => {
            digest += `${company}\n`;
            grouped[company].forEach(item => {
                digest += `- ${item.title} (${item.tag}) ${item.url}\n`;
            });
            digest += `\n`; // Spacer
        });

        digest += "--\nOfficial.ai\nSignal over noise.";

        await fs.writeFile(DIGEST_FILE, digest);
        console.log(`Digest generated at ${DIGEST_FILE}`);
        console.log(digest);

    } catch (e) {
        console.error("Error generating digest:", e);
    }
}

generateDigest().catch(console.error);
