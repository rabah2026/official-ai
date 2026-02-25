
import fs from 'fs/promises';
import path from 'path';

async function verifySources() {
    const dataPath = path.join(process.cwd(), 'data', 'updates.json');
    const logsDir = path.join(process.cwd(), 'logs');

    try {
        await fs.mkdir(logsDir, { recursive: true });
        const data = JSON.parse(await fs.readFile(dataPath, 'utf-8'));

        console.log(`Verifying ${Math.min(data.length, 50)} sources...`);

        const results = [];
        const subset = data.slice(0, 50); // Smaller subset for quicker feedback

        for (const item of subset) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);

                const response = await fetch(item.url, {
                    method: 'GET', // Some sites block HEAD
                    signal: controller.signal,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                        'Accept': '*/*',
                    }
                });

                clearTimeout(timeoutId);

                results.push({
                    title: item.title,
                    company: item.company,
                    url: item.url,
                    status: response.status,
                    ok: response.ok
                });

                console.log(`[${response.status}] ${item.url}`);
            } catch (error: any) {
                results.push({
                    title: item.title,
                    company: item.company,
                    url: item.url,
                    status: 'FETCH_ERROR',
                    error: error.message
                });
                console.error(`[ERROR] ${item.url}: ${error.message}`);
            }
        }

        const brokenLinks = results.filter(r => !r.ok);
        const reportPath = path.join(logsDir, 'source-verification-report.json');
        await fs.writeFile(reportPath, JSON.stringify({
            timestamp: new Date().toISOString(),
            totalChecked: subset.length,
            brokenCount: brokenLinks.length,
            results
        }, null, 2));

        console.log(`\nVerification complete. Found ${brokenLinks.length} issues in the sample of 50.`);
        console.log(`Full report saved to ${reportPath}`);

    } catch (error) {
        console.error('Fatal error during verification:', error);
    }
}

verifySources();
