import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'updates.json');

const corrections: Record<string, { title_ar: string; summary_ar: string }> = {
    // Fix for GPT-5.2 Codex items seen in screenshot
    "https://openai.com/index/gpt-5-2-codex": {
        "title_ar": "نُقدم لكم GPT-5.2-Codex",
        "summary_ar": "نموذج GPT-5.2-Codex هو أكثر نماذج OpenAI تقدماً، حيث يوفر استدلالاً طويل الأمد، وبرمجة، وتوليد كود على نطاق واسع."
    },
    "https://openai.com/index/chatgpt-go": {
        "title_ar": "تقديم ChatGPT Go، متاح الآن في جميع أنحاء العالم",
        "summary_ar": "خدمة ChatGPT Go متوفرة الآن عالمياً، وتوفر وصولاً موسعاً لـ GPT-5.2 Instant، وحدود استخدام أعلى، وذاكرة أطول."
    }
};

async function run() {
    const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));
    const updated = data.map((item: any) => {
        // Match by title substring as ID might vary or just be safe
        if (item.title.includes("GPT-5.2-Codex") || item.url.includes("chatgpt-go")) {
            // Find matching correction
            if (item.url.includes("chatgpt-go") && corrections["https://openai.com/index/chatgpt-go"]) {
                return { ...item, ...corrections["https://openai.com/index/chatgpt-go"] };
            }
            if (item.title.includes("GPT-5.2-Codex") && corrections["https://openai.com/index/gpt-5-2-codex"]) {
                return { ...item, ...corrections["https://openai.com/index/gpt-5-2-codex"] };
            }
        }
        return item;
    });
    await fs.writeFile(DATA_FILE, JSON.stringify(updated, null, 2));
    console.log('Applied featured translations repair.');
}

run().catch(console.error);
