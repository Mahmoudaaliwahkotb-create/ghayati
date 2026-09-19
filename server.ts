import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client with required User-Agent header
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// System instructions for different educational roles
const SYSTEM_ROLES: Record<string, string> = {
  tutor: `أنت "غايتي AI" - المعلم الخصوصي الذكي لمنصة "غايتي" التعليمية المعتمدة.
مهمتك:
- مساعدة الطلاب في فهم الدروس الأكاديمية (الرياضيات، العلوم، اللغة العربية، الإنجليزية، الفيزياء، إلخ).
- شرح المفاهيم بأسلوب مشجع، تربوي، وواضح باللغة العربية الفصحى السلسة.
- حل المسائل خطوة بخطوة مع توضيح القاعدة الرياضية أو العلمية المتبعة.
- تشجيع التفكير النقدي عبر طرح أسئلة تحققية موجزة للتأكد من فهم الطالب.
- التحدث بنبرة ودودة ومحفزة وإيجابية.`,

  advisor: `أنت "المستشار الأكاديمي لمنصة غايتي".
مهمتك:
- مساعدة الطالب وولي الأمر في تنظيم جداول المذاكرة اليومية والأسبوعية.
- تقديم نصائح واستراتيجيات فعالة لإدارة وقت الامتحانات ومكافحة التشتت.
- تحليل تقارير التحصيل الدراسي وتقديم خطط علاجية وتطويرية مخصصة.
- التحدث بأسلوب مرشد خبير، متفهم، وعملي باللغة العربية الفصحى.`,

  platform: `أنت "مساعد منصة غايتي لخدمة الطلاب وأولياء الأمور".
مهمتك:
- الإجابة عن كل ما يخص منصة غايتي: حجز الحصص التجريبية المجانية، شحن المحفظة، استعراض قائمة المعلمين المعتمدين، الدخول إلى الفصول الافتراضية، ونظام الإشعارات الذكي (قبل الحصة بـ 15 دقيقة).
- توضيح المزايا والرد على الاستفسارات بلباقة وإيجاز باللغة العربية.`,
};

// API Route for multi-turn Gemini Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, role = 'tutor', model = 'gemini-3.8-flash' } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'قائمة الرسائل مطلوبة ويجب أن تحتوي على رسالة واحدة على الأقل.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        reply: 'مرحباً بك في منصة غايتي! لم يتم العثور على مفتاح GEMINI_API_KEY في إعدادات البيئة حالياً. يرجى تزويد المفتاح في لوحة Settings > Secrets لتفعيل المحادثة الحية بالذكاء الاصطناعي.',
        fallback: true
      });
    }

    const ai = getGeminiClient();

    // Map message history to Gemini contents format
    const contents = messages.map((m: { role: 'user' | 'assistant' | 'model'; text: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const systemInstruction = SYSTEM_ROLES[role] || SYSTEM_ROLES.tutor;

    // Supported models as per guidelines:
    // 'gemini-3.8-flash' (default), 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.1-pro-preview'
    const allowedModels = [
      'gemini-3.8-flash',
      'gemini-3.5-flash',
      'gemini-3.1-flash-lite',
      'gemini-3.1-pro-preview',
    ];

    const selectedModel = allowedModels.includes(model) ? model : 'gemini-3.8-flash';

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'عذراً، لم أتمكن من تكوين إجابة في الوقت الحالي. حاول مجدداً.';

    return res.json({
      reply: replyText,
      modelUsed: selectedModel,
      roleUsed: role
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    const errorMessage = error?.message || 'حدث خطأ أثناء معالجة الطلب.';
    return res.status(500).json({
      error: 'فشل الاتصال بنموذج Gemini',
      details: errorMessage,
      reply: 'عذراً، واجهنا صعوبة تقنية مؤقتة في التواصل مع روبوت غايتي AI. يرجى إعادة المحاولة بعد قليل.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ghayati-server' });
});

// Vite Middleware for Development / Static serving for Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
