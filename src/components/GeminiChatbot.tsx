import React, { useState, useRef, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  modelUsed?: string;
}

export type GeminiModelChoice =
  | 'gemini-3.8-flash'
  | 'gemini-3.5-flash'
  | 'gemini-3.1-flash-lite'
  | 'gemini-3.1-pro-preview';

export type ChatRoleChoice = 'tutor' | 'advisor' | 'platform';

interface GeminiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  isFloating?: boolean;
}

const SUGGESTIONS = [
  'اشرح لي قاعدة كان وأخواتها مع إعراب جملة نموذجية',
  'كيف أحل معادلة الدرجة الثانية بالقانون العام خطوة بخطوة؟',
  'ضع لي جدول مراجعة مكثف لمدة ٥ أيام لاختبار الرياضيات',
  'ما هي خطوات حجز الحصة التجريبية المجانية في منصة غايتي؟',
];

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  isOpen,
  onClose,
  isFloating = false,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: 'مرحباً بك! أنا "غايتي AI" - مساعدك التعليمي الذكي المدعوم بنماذج Gemini من Google. 🎓✨\n\nكيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن شرح درس، حل مسألة، تنظيم جدول مذاكرة، أو الاستفسار عن منصة غايتي.',
      timestamp: 'الآن',
      modelUsed: 'gemini-3.8-flash',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<ChatRoleChoice>('tutor');
  const [selectedModel, setSelectedModel] = useState<GeminiModelChoice>('gemini-3.8-flash');
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom whenever messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      // Format payload for /api/chat endpoint
      const payloadMessages = newHistory.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          role: selectedRole,
          model: selectedModel,
        }),
      });

      if (!res.ok) {
        throw new Error(`خطأ في الخادم (${res.status})`);
      }

      const data = await res.json();
      const botReply = data.reply || 'عذراً، لم أستطع تكوين رد مناسب. يرجى المحاولة ثانية.';

      const assistantMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: botReply,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: '⚠️ تعذر الاتصال بنموذج Gemini حالياً. يرجى التأكد من تشغيل الخادم ووجود مفتاح GEMINI_API_KEY في لوحة الإعدادات.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    if (confirm('هل تريد بالتأكيد مسح سجل المحادثة والبدء من جديد؟')) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          text: 'تمت إعادة ضبط المحادثة. أنا جاهز للإجابة على استفساراتك الجديدة! 📚',
          timestamp: 'الآن',
          modelUsed: selectedModel,
        },
      ]);
    }
  };

  const roleLabels: Record<ChatRoleChoice, { title: string; desc: string; icon: string }> = {
    tutor: {
      title: 'المعلم الخصوصي التفاعلي',
      desc: 'شرح الدروس وحل المسائل وتبسيط المفاهيم الصعبة',
      icon: 'school',
    },
    advisor: {
      title: 'المرشد الأكاديمي وجدولة المذاكرة',
      desc: 'تنظيم أوقات الاستذكار ونصائح الاستعداد للامتحانات',
      icon: 'psychology',
    },
    platform: {
      title: 'مساعد منصة غايتي',
      desc: 'إرشادات المنصة، حجز الحصص، والمحفظة الأكاديمية',
      icon: 'support_agent',
    },
  };

  const modelLabels: Record<GeminiModelChoice, { name: string; tag: string; desc: string }> = {
    'gemini-3.8-flash': {
      name: 'Gemini 3.8 Flash',
      tag: 'الموصى به (افتراضي)',
      desc: 'توازن مثالي بين الدقة والسرعة والتفكير العام',
    },
    'gemini-3.5-flash': {
      name: 'Gemini 3.5 Flash',
      tag: 'عام ومرن',
      desc: 'مثالي للشروحات النصية والدروس اليومية',
    },
    'gemini-3.1-flash-lite': {
      name: 'Gemini 3.1 Flash-Lite',
      tag: 'استجابة فائقة السرعة',
      desc: 'إجابات فورية مختصرة للأسئلة السريعة',
    },
    'gemini-3.1-pro-preview': {
      name: 'Gemini 3.1 Pro Preview',
      tag: 'تفكير متقدم ومعقد',
      desc: 'أقوى نموذج للمسائل المعقدة والاستدلال الرياضي',
    },
  };

  if (!isOpen) return null;

  return (
    <div
      dir="rtl"
      className={
        isFloating
          ? 'fixed bottom-24 left-4 sm:left-8 z-50 w-[95vw] sm:w-[460px] h-[640px] max-h-[85vh] bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300'
          : 'w-full max-w-4xl mx-auto h-[740px] max-h-[85vh] bg-surface-container-lowest rounded-3xl shadow-lg border border-outline-variant flex flex-col overflow-hidden my-4'
      }
    >
      {/* Header */}
      <header className="p-4 bg-gradient-to-l from-primary/10 via-surface-container-low to-surface-container border-b border-outline-variant/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-2xl">smart_toy</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-title font-title font-bold text-on-surface">غايتي AI</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/15 text-primary">
                Gemini
              </span>
            </div>
            <p className="text-xs text-on-surface-variant flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>{roleLabels[selectedRole].title}</span>
              <span>•</span>
              <span className="font-mono text-[11px] text-outline">{selectedModel.replace('gemini-', '')}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl transition-colors ${
              showSettings ? 'bg-primary text-on-primary' : 'hover:bg-surface-container text-on-surface-variant'
            }`}
            title="تغيير النموذج والدور الأكاديمي"
          >
            <span className="material-symbols-outlined text-xl">tune</span>
          </button>

          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-red-500 transition-colors"
            title="مسح المحادثة"
          >
            <span className="material-symbols-outlined text-xl">delete_sweep</span>
          </button>

          {isFloating && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-surface-container text-on-surface-variant transition-colors"
              title="إغلاق المحادثة"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          )}
        </div>
      </header>

      {/* Settings Panel (Toggleable) */}
      {showSettings && (
        <div className="bg-surface-container-low border-b border-outline-variant p-4 space-y-4 shrink-0 animate-in slide-in-from-top-2 duration-200">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-primary">badge</span>
              <span>الدور التخصصي للروبوت (System Instruction):</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(Object.keys(roleLabels) as ChatRoleChoice[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setSelectedRole(r);
                    setShowSettings(false);
                  }}
                  className={`p-2.5 rounded-xl border text-right transition-all text-xs cursor-pointer ${
                    selectedRole === r
                      ? 'bg-primary/10 border-primary text-primary font-bold shadow-xs'
                      : 'bg-surface-container-lowest border-outline-variant/60 text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="material-symbols-outlined text-base">{roleLabels[r].icon}</span>
                    <span className="truncate">{roleLabels[r].title}</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant line-clamp-1">{roleLabels[r].desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-secondary">memory</span>
              <span>طراز Gemini المستخدم (Model Selection):</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(modelLabels) as GeminiModelChoice[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setSelectedModel(m);
                    setShowSettings(false);
                  }}
                  className={`p-2 rounded-xl border text-right transition-all text-xs cursor-pointer ${
                    selectedModel === m
                      ? 'bg-secondary/15 border-secondary text-secondary font-bold shadow-xs'
                      : 'bg-surface-container-lowest border-outline-variant/60 text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="block font-bold text-[11px] truncate">{modelLabels[m].name}</span>
                  <span className="block text-[9px] text-on-surface-variant truncate">{modelLabels[m].tag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Message Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-right bg-gradient-to-b from-surface-container-lowest via-background to-surface-container-low/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-start' : 'items-end'} space-y-1`}
          >
            <div className="flex items-center gap-2 text-[11px] text-outline px-1">
              <span>{msg.role === 'user' ? 'أنت' : 'غايتي AI'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
              {msg.modelUsed && (
                <span className="px-1.5 py-0.2 bg-surface-container rounded text-[9px] text-outline font-mono">
                  {msg.modelUsed}
                </span>
              )}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-primary text-on-primary rounded-tl-none shadow-sm'
                  : 'bg-surface-container-low border border-outline-variant text-on-surface rounded-tr-none shadow-xs'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-outline px-1">
              <span>غايتي AI يكتب الإجابة...</span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded-2xl rounded-tr-none p-3.5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-bounce"></div>
              <div
                className="w-2 h-2 rounded-full bg-secondary animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-secondary animate-bounce"
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-2 bg-surface-container-low/50 border-t border-outline-variant/40 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[11px] font-bold text-outline shrink-0 flex items-center gap-1">
          <span className="material-symbols-outlined text-xs text-primary">lightbulb</span>
          <span>مقترحات:</span>
        </span>
        {SUGGESTIONS.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(suggestion)}
            className="px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-primary/10 border border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary text-xs whitespace-nowrap transition-all shrink-0 cursor-pointer"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <footer className="p-3 bg-surface-container-lowest border-t border-outline-variant shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end gap-2"
        >
          <div className="flex-1 relative bg-surface-container-low rounded-2xl border border-outline-variant focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اسأل غايتي AI عن أي درس، مسألة، أو استفسار... (Enter للإرسال)"
              rows={2}
              className="w-full p-3 bg-transparent border-none outline-none resize-none text-sm text-on-surface placeholder:text-outline"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              inputText.trim() && !isLoading
                ? 'bg-primary hover:bg-on-primary-fixed-variant text-on-primary shadow-md hover:scale-105 active:scale-95'
                : 'bg-surface-container text-outline cursor-not-allowed'
            }`}
            title="إرسال"
          >
            <span className="material-symbols-outlined text-2xl">send</span>
          </button>
        </form>
      </footer>
    </div>
  );
};
