
import fs from 'fs';
import path from 'path';

interface Article {
    id: string;
    url: string;
    title: string;
    [key: string]: any;
}

const updatesPath = path.join(process.cwd(), 'data/updates.json');

function deduplicateUpdates() {
    console.log('Reading updates.json...');
    try {
        const rawData = fs.readFileSync(updatesPath, 'utf8');
        const updates: Article[] = JSON.parse(rawData);

        console.log(`Total articles before deduplication: ${updates.length}`);

        const uniqueUpdates = new Map<string, Article>();
        let duplicateCount = 0;

        updates.forEach(article => {
            // Normalize URL to remove potential trailing slashes or query params if strictness varies
            // For now, we'll use strict URL matching as IDs seem properly formed
            const key = article.url.trim();

            if (uniqueUpdates.has(key)) {
                duplicateCount++;
                // Optional: Keep the one with more complete data if needed, 
                // but typically the latest one or first one is fine. 
                // Here we keep the first one found.
                console.log(`Found duplicate: ${article.title} (${article.url})`);
            } else {
                uniqueUpdates.set(key, article);
            }
        });

        const cleanedUpdates = Array.from(uniqueUpdates.values());

        console.log(`Total articles after deduplication: ${cleanedUpdates.length}`);
        console.log(`Removed ${duplicateCount} duplicates.`);

        if (duplicateCount > 0) {
            fs.writeFileSync(updatesPath, JSON.stringify(cleanedUpdates, null, 2));
            console.log('updates.json updated successfully.');
        } else {
            console.log('No duplicates found. No changes made.');
        }

    } catch (error) {
        console.error('Error processing updates.json:', error);
    }
}

deduplicateUpdates();
