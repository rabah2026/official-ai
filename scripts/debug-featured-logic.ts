
import fs from 'fs';
import path from 'path';

const updatesPath = path.join(process.cwd(), 'data/updates.json');

try {
    const rawData = fs.readFileSync(updatesPath, 'utf8');
    const updates = JSON.parse(rawData);

    const modelKeywords = ['GPT', 'Claude', 'Gemini', 'Llama', 'Mistral', 'Sora', 'introducing', 'launch', 'announcing', 'new model', 'release'];

    // Exact logic from HomePageContent.tsx
    const featured = updates
        .filter((u: any) => {
            const titleLower = u.title.toLowerCase();
            return modelKeywords.some(kw => titleLower.includes(kw.toLowerCase())) && u.tag === 'Release';
        })
        .slice(0, 3);

    console.log(`Total updates: ${updates.length}`);
    console.log(`Found ${featured.length} featured items:`);

    featured.forEach((item: any, index: number) => {
        console.log(`\n[${index + 1}] ID: ${item.id}`);
        console.log(`    Title: ${item.title}`);
        console.log(`    URL:   ${item.url}`);
        console.log(`    Date:  ${item.date}`);
    });

    // Check for ID/URL equality
    const uniqueIds = new Set(featured.map((f: any) => f.id));
    if (uniqueIds.size !== featured.length) {
        console.log('\n⚠️  DUPLICATE IDs DETECTED in featured selection!');
    } else {
        console.log('\n✅ No exact ID duplicates in selection.');
    }

} catch (error) {
    console.error('Error:', error);
}
