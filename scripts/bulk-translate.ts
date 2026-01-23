import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'updates.json');

const manualTranslations: Record<string, { title_ar: string; summary_ar: string }> = {
    // Batch 3 + previous important ones
    "https://developer.nvidia.com/blog/nvidia-dlss-4-5-delivers-super-resolution-upgrades-and-new-dynamic-multi-frame-generation/": {
        "title_ar": "NVIDIA DLSS 4.5 يقدم ترقيات الدقة الفائقة وتوليد الإطارات الديناميكي",
        "summary_ar": "أصبح NVIDIA DLSS 4 تقنية الألعاب الأسرع اعتماداً، حيث يستخدمها أكثر من 250 لعبة وتطبيق لتحسين الأداء."
    },
    "https://developer.nvidia.com/blog/learn-how-nvidia-cuopt-accelerates-mixed-integer-optimization-using-primal-heuristics/": {
        "title_ar": "تعرف على كيفية تسريع NVIDIA cuOpt لتحسين الأعداد الصحيحة المختلطة",
        "summary_ar": "محرك تحسين معجل بـ GPU مصمم لتقديم حلول سريعة وعالية الجودة لمشاكل صنع القرار الكبيرة والمعقدة."
    },
    "https://deepmind.google/blog/veo-3-1-ingredients-to-video-more-consistency-creativity-and-control/": {
        "title_ar": "Veo 3.1: مزيد من الاتساق والإبداع والتحكم في توليد الفيديو",
        "summary_ar": "يولد تحديث Veo الأخير مقاطع حيوية وديناميكية تشعر بأنها طبيعية وجذابة، ويدعم توليد الفيديو الرأسي."
    },
    "https://openai.com/index/zenken": {
        "title_ar": "Zenken تعزز فريق المبيعات باستخدام ChatGPT Enterprise",
        "summary_ar": "من خلال نشر ChatGPT Enterprise في جميع أنحاء الشركة، عززت Zenken أداء المبيعات وقللت وقت التحضير."
    },
    "https://openai.com/index/openai-raising-concerns-policy": {
        "title_ar": "سياسة إثارة المخاوف في OpenAI",
        "summary_ar": "ننشر سياسة إثارة المخاوف التي تحمي حقوق الموظفين في الإفصاح عن المعلومات المحمية."
    },
    "https://github.com/openai/openai-python/releases/tag/v2.15.0": {
        "title_ar": "مكتبة OpenAI Python الإصدار 2.15.0",
        "summary_ar": "إطلاق الإصدار الجديد من مكتبة بايثون الخاصة بـ OpenAI مع ميزات وتحسينات جديدة."
    }
};

const commonTerms: Record<string, string> = {
    "Introducing": "نُقدم لكم",
    "Announcing": "إعلان عن",
    "How to": "كيفية",
    "Scaling": "توسيع نطاق",
    "Advancing": "تعزيز",
    "Building": "بناء",
    "Accelerating": "تسريع",
    "The future of": "مستقبل",
    "Inside": "نظرة داخل",
    "Our approach to": "نهجنا تجاه",
    "Investing in": "الاستثمار في",
    "Partnership": "شراكة",
    "Available now": "متاح الآن",
    "New": "جديد",
    "Update": "تحديث"
};

function autoTranslate(text: string): string {
    if (!text) return "";
    let translated = text;
    for (const [en, ar] of Object.entries(commonTerms)) {
        const regex = new RegExp(`\\b${en}\\b`, 'gi');
        translated = translated.replace(regex, ar);
    }
    return translated;
}

async function run() {
    const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));
    const updated = data.map((item: any) => {
        let title_ar = item.title_ar;
        let summary_ar = item.summary_ar;

        if (manualTranslations[item.url]) {
            title_ar = manualTranslations[item.url].title_ar;
            summary_ar = manualTranslations[item.url].summary_ar;
        } else if (!title_ar || title_ar === item.title) {
            // Simple heuristic if no translation exists
            title_ar = autoTranslate(item.title);
            summary_ar = autoTranslate(item.summary || "");
        }

        return { ...item, title_ar, summary_ar };
    });
    await fs.writeFile(DATA_FILE, JSON.stringify(updated, null, 2));
    console.log(`Applied translations with auto-fallback for all ${updated.length} items.`);
}

run().catch(console.error);
