import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'updates.json');

const corrections: Record<string, { title_ar: string; summary_ar: string }> = {
    "https://developer.nvidia.com/blog/scaling-nvfp4-inference-for-flux-2-on-nvidia-blackwell-data-center-gpus/": {
        "title_ar": "توسيع نطاق استنتاج NVFP4 لنموذج FLUX.2 على وحدات معالجة الرسوميات بمراكز بيانات نفيديا بلاكويل",
        "summary_ar": "في عام 2025، دخلت نفيديا في شراكة مع Black Forest Labs لتحسين سلسلة نماذج تحويل النص إلى صورة FLUX.1، مما أطلق العنان لأداء توليد الصور بدقة FP4."
    }
};

async function run() {
    const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));
    const updated = data.map((item: any) => {
        if (corrections[item.url]) {
            return { ...item, ...corrections[item.url] };
        }
        return item;
    });
    await fs.writeFile(DATA_FILE, JSON.stringify(updated, null, 2));
    console.log('Applied specific featured card corrections.');
}

run().catch(console.error);
