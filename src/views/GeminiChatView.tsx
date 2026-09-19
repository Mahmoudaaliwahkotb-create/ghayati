import React from 'react';
import { ActiveTab } from '../types';
import { GeminiChatbot } from '../components/GeminiChatbot';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface GeminiChatViewProps {
  setActiveTab?: (tab: ActiveTab) => void;
}

export const GeminiChatView: React.FC<GeminiChatViewProps> = ({ setActiveTab }) => {
  return (
    <div className="w-full text-right">
      {/* Breadcrumbs Navigation */}
      {setActiveTab && (
        <Breadcrumbs
          onBack={() => setActiveTab('classes')}
          backLabel="العودة إلى فصولي"
          items={[
            {
              label: 'فصولي (الرئيسية)',
              icon: 'home',
              onClick: () => setActiveTab('classes')
            },
            {
              label: 'الأدوات التعليمية الذكية',
              onClick: () => setActiveTab('classes')
            },
            {
              label: 'غايتي AI (Gemini)',
              isCurrent: true
            }
          ]}
        />
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto px-margin py-space-xl space-y-space-lg text-right">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-label-md font-bold text-primary bg-primary/10 px-3 py-0.5 rounded-full">
              مدعوم بنماذج Google Gemini
            </span>
          </div>
          <h1 className="text-headline-lg font-headline-lg text-on-surface tracking-tight font-bold">
            غايتي AI • المساعد التعليمي الذكي
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1 max-w-2xl">
            روبوت محادثة متعدد الأدوار متصل بأحدث نماذج Gemini (3.8 Flash و 3.5 Flash و 3.1 Flash-Lite و 3.1 Pro Preview). يساعدك في فهم الدروس، حل المسائل، إعداد جداول المذاكرة، والإجابة عن استفسارات المنصة.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-2xl">psychology</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-outline">حالة الاتصال</p>
              <p className="text-sm font-bold text-on-surface">خادم Gemini متصل</p>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Chatbot Component */}
      <div className="w-full flex justify-center">
        <GeminiChatbot isOpen={true} onClose={() => {}} isFloating={false} />
      </div>

      {/* Feature Explanations Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <h4 className="font-bold text-on-surface text-title">المعلم الخصوصي</h4>
          <p className="text-body-sm text-on-surface-variant">
            شرح مبسط لقواعد اللغة العربية، حل معادلات الجبر والهندسة، وتوضيح المفاهيم العلمية بطرق تفاعلية معززة بأمثلة.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">event_upcoming</span>
          </div>
          <h4 className="font-bold text-on-surface text-title">تنظيم المذاكرة</h4>
          <p className="text-body-sm text-on-surface-variant">
            إنشاء خطط مراجعة مخصصة قبل الاختبارات، تحليل أوقات الفراغ، وتقديم نصائح علمية للتغلب على صعوبات التعلم.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">bolt</span>
          </div>
          <h4 className="font-bold text-on-surface text-title">تعدد النماذج</h4>
          <p className="text-body-sm text-on-surface-variant">
            إمكانية التبديل بين نماذج Gemini السريعة أو النماذج التحليلية المتقدمة وفقاً لعمق وصعوبة السؤال المطلوب.
          </p>
        </div>
      </div>
    </main>
    </div>
  );
};
