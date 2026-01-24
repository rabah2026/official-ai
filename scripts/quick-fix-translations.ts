
import fs from 'fs';
import path from 'path';

const updatesPath = path.join(process.cwd(), 'data/updates.json');
const rawData = fs.readFileSync(updatesPath, 'utf8');
const updates = JSON.parse(rawData);

// Manual translations for the missing top items
const translations: Record<string, { title_ar: string, summary_ar: string }> = {
    // OpenAI Codex
    "https://openai.com/index/unrolling-the-codex-agent-loop": {
        title_ar: "فك شفرة حلقة وكيل Codex",
        summary_ar: "غوص تقني عميق في كيفية عمل وكيل Codex، يشرح كيف يقوم Codex CLI بتنسيق النماذج والأدوات والمطالبات والأداء باستخدام واجهة برمجة التطبيقات Responses."
    },
    // NVIDIA Flux.2
    "https://developer.nvidia.com/blog/scaling-nvfp4-inference-for-flux-2-on-nvidia-blackwell-data-center-gpus/": {
        title_ar: "توسيع نطاق استدلال NVFP4 لنموذج FLUX.2 على وحدات معالجة الرسومات NVIDIA Blackwell",
        summary_ar: "في عام 2025، دخلت NVIDIA في شراكة مع Black Forest Labs لتحسين سلسلة نماذج تحويل النص إلى صورة FLUX.1، مما يفتح المجال لأداء توليد صور بدقة FP4."
    },
    // OpenAI Scaling PostgreSQL
    "https://openai.com/index/scaling-postgresql": {
        title_ar: "توسيع نطاق PostgreSQL لدعم 800 مليون مستخدم لـ ChatGPT",
        summary_ar: "نظرة داخلية على كيفية قيام OpenAI بتوسيع نطاق PostgreSQL لمعالجة ملايين الاستعلامات في الثانية باستخدام النسخ المتماثلة والتخزين المؤقت وتحديد المعدل وعزل أحمال العمل."
    },
    // OpenAI Praktika
    "https://openai.com/index/praktika": {
        title_ar: "داخل نهج Praktika التخاطبي لتعلم اللغات",
        summary_ar: "كيف تستخدم Praktika نماذج GPT-4.1 و GPT-5.2 لبناء معلمي ذكاء اصطناعي متكيفين يخصصون الدروس ويتتبعون التقدم ويساعدون المتعلمين على تحقيق الطلاقة اللغوية."
    },
    // OpenAI GPT-5 for Work
    "https://openai.com/business/guides-and-resources/chatgpt-usage-and-adoption-patterns-at-work": {
        title_ar: "داخل GPT-5 للأعمال: كيف تستخدم الشركات GPT-5",
        summary_ar: "تقرير يستند إلى البيانات حول كيفية استخدام الموظفين في مختلف الصناعات لـ ChatGPT - يغطي اتجاهات التبني، والمهام الرئيسية، وأنماط الأقسام."
    }
};

let updatedCount = 0;

const newUpdates = updates.map((u: any) => {
    if (translations[u.id]) {
        console.log(`Translating: ${u.title}`);
        updatedCount++;
        return {
            ...u,
            ...translations[u.id]
        };
    }
    return u;
});

fs.writeFileSync(updatesPath, JSON.stringify(newUpdates, null, 2));
console.log(`\n✅ Successfully updated ${updatedCount} articles with Arabic translations.`);
