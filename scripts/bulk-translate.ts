import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'updates.json');

import { batchTranslate } from './translate-service';

async function run() {
    const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));

    // Only process items that are missing translations (top 50 to save quota)
    // Filter for ones needing translation first
    const itemsToTranslate = data.slice(0, 20).filter((item: any) =>
        !item.title_ar || item.title_ar === item.title
    );

    if (itemsToTranslate.length === 0) {
        console.log("No new items need translation.");
        return;
    }

    // Merge translated items back into full list
    const translatedItems = await batchTranslate(itemsToTranslate);

    // Create map for easy lookup
    const translatedMap = new Map(translatedItems.map((i: any) => [i.id, i]));

    const finalData = data.map((item: any) =>
        translatedMap.get(item.id) || item
    );

    await fs.writeFile(DATA_FILE, JSON.stringify(finalData, null, 2));
    console.log(`Updated data file with AI translations.`);
}

run().catch(console.error);
