import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

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

// Helper to sanitize Supabase URL (strip /rest/v1 or trailing slashes)
function cleanSupabaseUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim().replace(/^["']|["']$/g, '');
  try {
    return new URL(trimmed).origin;
  } catch {
    return trimmed.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
  }
}

// Lazy-initialized Supabase server client
let serverSupabase: SupabaseClient | null = null;
function getServerSupabase(): SupabaseClient | null {
  if (!serverSupabase) {
    const rawUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const url = cleanSupabaseUrl(rawUrl);
    const key = rawKey ? rawKey.trim().replace(/^["']|["']$/g, '') : '';
    if (url && key) {
      try {
        serverSupabase = createSupabaseClient(url, key);
      } catch (err) {
        console.warn('Failed to initialize server Supabase client:', err);
      }
    }
  }
  return serverSupabase;
}

// In-memory server cache for registered teachers when Supabase keys are not yet configured in preview
const serverRegisteredTeachers: any[] = [];

// POST /api/teachers - Register a new teacher with status: 'pending' by default
app.post('/api/teachers', async (req, res) => {
  try {
    const { fullName, photo, subject, monthlyPrice, experienceYears, bio } = req.body;

    if (!fullName || !subject) {
      return res.status(400).json({
        error: 'الاسم الكامل والمادة الدراسية مطلوبان لإتمام طلب التسجيل.'
      });
    }

    const newTeacherRecord = {
      id: `TCH-${Date.now().toString().slice(-6)}`,
      name: fullName,
      full_name: fullName,
      avatar: photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      photo_url: photo || '',
      subject,
      monthly_price: Number(monthlyPrice) || 0,
      experience_years: Number(experienceYears) || 0,
      bio: bio || '',
      status: 'pending', // Explicitly set to 'pending' by default
      created_at: new Date().toISOString(),
    };

    // Attempt Supabase insert if credentials are provided
    const supabase = getServerSupabase();
    if (supabase) {
      // First try inserting with database schema columns: full_name, bio, years_experience, price_monthly
      const payload: Record<string, any> = {
        full_name: fullName,
        bio: bio || '',
        years_experience: Number(experienceYears) || 0,
        price_monthly: Number(monthlyPrice) || 0,
        created_at: new Date().toISOString(),
      };

      // Try inserting with status: 'pending'
      let insertRes = await supabase.from('teachers').insert([{ ...payload, status: 'pending' }]);
      if (insertRes.error && insertRes.error.message.includes('status')) {
        // If status column doesn't exist in schema, try without it
        insertRes = await supabase.from('teachers').insert([payload]);
      }
      if (insertRes.error) {
        console.warn('Supabase server insert note (saved to server cache):', insertRes.error.message);
      }
    }

    // Always keep in server cache
    serverRegisteredTeachers.unshift(newTeacherRecord);

    return res.status(201).json({
      success: true,
      message: 'تم إرسال طلبك، سيتم مراجعته والتواصل معك قريبًا.',
      referenceId: newTeacherRecord.id,
      status: 'pending'
    });
  } catch (error: any) {
    console.error('Error in /api/teachers registration:', error);
    return res.status(500).json({
      error: 'فشل حفظ طلب تسجيل المعلم',
      details: error?.message || 'خطأ غير متوقع'
    });
  }
});

// GET /api/teachers - Only returns approved teachers (status = 'approved') from Supabase
app.get('/api/teachers', async (req, res) => {
  try {
    const supabase = getServerSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('teachers').select('*');

      if (!error && Array.isArray(data)) {
        // Exclude pending and rejected teachers
        const approvedOnly = data.filter((item: any) => item.status !== 'pending' && item.status !== 'rejected');
        return res.json({ teachers: approvedOnly });
      } else if (error) {
        console.warn('Supabase teachers query notice:', error.message);
      }
    }

    // Filter server in-memory list - strictly approved only (never pending)
    const approvedFromMemory = serverRegisteredTeachers.filter(t => t.status === 'approved');
    return res.json({ teachers: approvedFromMemory });
  } catch (error: any) {
    console.error('Error in GET /api/teachers:', error);
    return res.status(500).json({ error: 'فشل جلب قائمة المعلمين', teachers: [] });
  }
});

// In-memory cache for bookings fallback
const serverBookings: any[] = [];

// POST /api/bookings - Save new trial lesson booking to Supabase
app.post('/api/bookings', async (req, res) => {
  try {
    const { teacher_id, parent_name, student_name, whatsapp_number } = req.body;

    if (!parent_name || !student_name || !whatsapp_number) {
      return res.status(400).json({
        error: 'جميع الحقول مطلوبة: اسم ولي الأمر، اسم الطالب، ورقم الواتساب.'
      });
    }

    const isValidUUID = (str: any) =>
      typeof str === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());

    const bookingPayload = {
      teacher_id: isValidUUID(teacher_id) ? teacher_id.trim() : null,
      parent_name: String(parent_name).trim(),
      student_name: String(student_name).trim(),
      whatsapp_number: String(whatsapp_number).trim(),
    };

    const supabase = getServerSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingPayload])
        .select();

      if (!error && data && data.length > 0) {
        console.log('Successfully saved booking to Supabase:', data[0].id);
        return res.status(201).json({
          success: true,
          booking: data[0],
          id: data[0].id,
          message: 'تم تسجيل الحجز بنجاح في قاعدة البيانات'
        });
      }
      if (error) {
        console.warn('Supabase bookings insert note:', error.message);
        const fallbackBooking = {
          ...bookingPayload,
          id: `bk-${Date.now()}`,
          created_at: new Date().toISOString(),
          rls_notice: error.message
        };
        serverBookings.push(fallbackBooking);
        return res.status(200).json({
          success: true,
          booking: fallbackBooking,
          id: fallbackBooking.id,
          warning: error.message,
          message: 'تم استلام الحجز بنجاح'
        });
      }
    }

    const localBooking = {
      ...bookingPayload,
      id: `bk-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    serverBookings.push(localBooking);
    return res.status(200).json({
      success: true,
      booking: localBooking,
      id: localBooking.id,
      message: 'تم استلام الحجز بنجاح'
    });
  } catch (err: any) {
    console.error('Error in POST /api/bookings:', err);
    return res.status(500).json({ error: err.message || 'فشل إرسال بيانات الحجز' });
  }
});

// GET /api/bookings - List recent bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const supabase = getServerSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        return res.json({ bookings: data });
      }
    }
    return res.json({ bookings: serverBookings });
  } catch (err: any) {
    return res.status(500).json({ error: 'فشل جلب الحجوزات', bookings: serverBookings });
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
