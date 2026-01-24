
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Load API key from env or use a placeholder if testing
// Note: In a real deploy, ensure GENOME_API_KEY or GOOGLE_API_KEY is set
const API_KEY = process.env.GOOGLE_API_KEY || process.env.GENOME_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY || '');

export async function translateText(text: string): Promise<string> {
    if (!API_KEY) {
        console.warn('No GOOGLE_API_KEY found. Skipping AI translation.');
        return text; // Fallback to original
    }
    if (!text) return "";

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Translate the following tech news headline or summary into professional Arabic. Keep technical terms (like GPT-4, API, Python) in English if common in industry usage. Output ONLY the translation.

Text: "${text}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error('Translation failed:', error);
        return text;
    }
}

export async function batchTranslate(items: any[]) {
    if (!API_KEY) return items;

    console.log(`🤖 Starting AI translation for ${items.length} items...`);

    // Process in chunks to avoid rate limits
    const CHUNK_SIZE = 3;
    const results = [];

    for (let i = 0; i < items.length; i += CHUNK_SIZE) {
        const chunk = items.slice(i, i + CHUNK_SIZE);
        const chunkPromises = chunk.map(async (item) => {
            if (item.title_ar && item.summary_ar && item.title_ar !== item.title) {
                return item; // Already translated
            }

            console.log(`   Translating: ${item.title.substring(0, 30)}...`);

            const titleAr = await translateText(item.title);
            // Small delay between calls
            await new Promise(r => setTimeout(r, 500));
            const summaryAr = await translateText(item.summary || "");

            return {
                ...item,
                title_ar: titleAr,
                summary_ar: summaryAr
            };
        });

        const processedChunk = await Promise.all(chunkPromises);
        results.push(...processedChunk);

        // Delay between chunks
        if (i + CHUNK_SIZE < items.length) {
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    return results;
}
