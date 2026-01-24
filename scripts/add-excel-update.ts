
import fs from 'fs';
import path from 'path';

const updatesPath = path.join(process.cwd(), 'data/updates.json');

const newArticle = {
    "id": "https://claude.com/claude-in-excel",
    "company": "Anthropic",
    "title": "Claude in Excel",
    "date": "2026-01-24T12:00:00.000Z",
    "url": "https://claude.com/claude-in-excel",
    "tag": "Release",
    "summary": "Claude in Excel helps you navigate complex models, test scenarios without breaking formulas, and debug errors. It works within your existing compliance framework.",
    "title_ar": "Claude في Excel",
    "summary_ar": "تحديث رسمي: يساعدك Claude في Excel على التنقل في النماذج المعقدة، واختبار السيناريوهات دون كسر الصيغ، وتصحيح الأخطاء."
};

try {
    const rawData = fs.readFileSync(updatesPath, 'utf8');
    const updates = JSON.parse(rawData);

    // Check if it already exists to avoid duplicates (just in case)
    const exists = updates.some((u: any) => u.url === newArticle.url);

    if (!exists) {
        updates.unshift(newArticle); // Add to the beginning
        fs.writeFileSync(updatesPath, JSON.stringify(updates, null, 2));
        console.log('Successfully added "Claude in Excel" to updates.json');
    } else {
        console.log('Article already exists in updates.json');
    }
} catch (error) {
    console.error('Error updating file:', error);
}
