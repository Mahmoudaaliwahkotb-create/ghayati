import React from 'react';
import { ActiveTab } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface StudentReportViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenBookingModal: () => void;
}

export const StudentReportView: React.FC<StudentReportViewProps> = ({
  setActiveTab,
  onOpenBookingModal
}) => {
  return (
    <div className="w-full text-right">
      {/* Breadcrumbs Trail */}
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
            label: 'تقارير المتابعة',
            onClick: () => setActiveTab('reports')
          },
          {
            label: 'تقرير أداء الرياضيات (أميرة محمد)',
            isCurrent: true
          }
        ]}
      />

      <main className="w-full max-w-7xl mx-auto px-margin py-space-lg flex-1 text-right">

      {/* 1. Student & Subject Header Banner */}
      <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-space-lg shadow-sm mb-space-lg relative overflow-hidden">
        {/* Decorative subtle background accents */}
        <div className="absolute -left-12 -top-12 w-64 h-64 bg-surface-container-low rounded-full opacity-60 pointer-events-none"></div>
        <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-secondary-fixed/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
          {/* Right in RTL: Student Identity & Details */}
          <div className="flex items-start gap-space-md">
            <div className="relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ9vjPCRfjrWkar1u01jENLpoWp4Yo1R4T6ZbyPhpKQqumedMssdoeH4CBxGdSQVJlzwwTckE5TKorUnqfZI-GDM704BIBW1EFJ4V7joqm4YxUVoeoJ3j8Hq3RTFLZ1adNCrhmKKRHPxdS8wH-6yZrm-I_nNkijv2U5R-JcCFdhGtR6qNLg0Q-ph4J2UNww1T9MZMyI9tAinbsjKg_oCJ_q_hT9M10Etn_up7_ag9RgdXyy_ZhEJjTxg"
                alt="صورة الطالبة أميرة"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-primary/20 shadow-sm"
              />
              <div className="absolute -bottom-2 -left-2 bg-secondary text-on-secondary w-7 h-7 rounded-full flex items-center justify-center ring-2 ring-surface-container-lowest" title="مستوى متقدم">
                <span className="material-symbols-outlined text-[16px]">verified</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-space-sm">
                <h1 className="text-headline-sm font-headline-sm text-on-surface font-bold">أميرة أحمد محمد</h1>
                <span className="text-label-sm font-label-sm px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-semibold">
                  الصف الثالث الإعدادي
                </span>
                <span className="text-label-sm font-label-sm px-3 py-1 rounded-full bg-secondary-container/60 text-secondary font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  <span>المستوى الحالي: جيد جداً (متقدم)</span>
                </span>
              </div>

              {/* Subject with distinctive blue badge */}
              <div className="flex items-center gap-space-sm mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary-container text-on-primary font-body-sm text-body-sm font-semibold">
                  <span className="material-symbols-outlined text-[18px]">calculate</span>
                  <span>الرياضيات (الجبر والهندسة التحليلية)</span>
                </span>
                <span className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                  <span>تقرير التقييم الشهري - مارس 2025 (بعد إتمام 8 حصص)</span>
                </span>
              </div>

              {/* Assigned Teacher Micro Card */}
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-outline-variant/40 flex-wrap">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6amutMk01CVtPJ8MRvcKmxdaiQySRmj8_xbf3ZpTE-wN4WEJpnllpM9ibwepPywnxGIsjvQApsT0sg45FdK0b3CfdubM4U6Zhf4Jy01bTxtXEhhbs3TzCS0FNQd4taTA8snddHEOKFAr3lCosg9g6DwFm7vb-iXPmzuknkt8oaS31BFvBB_uzjBKmnIfO1mPlal43_0vHH_C76Xb5rKcUQfyUTK7U1kDok3H10pXoD1Lse5rwlDF68Q"
                  alt="أ. محمود الكردي"
                  className="w-10 h-10 rounded-full object-cover border border-outline-variant"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-body-md text-body-md font-bold text-on-surface">أ. محمود الكردي</span>
                    <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }} title="معلم موثق">
                      verified
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">كبير معلمي الرياضيات بالوزارة</span>
                </div>

                <button
                  onClick={() => alert('فتح نافذة المحادثة الفورية مع الأستاذ محمود الكردي')}
                  className="mr-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-body-sm text-body-sm font-bold transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>مراسلة المعلم</span>
                </button>
              </div>
            </div>
          </div>

          {/* Left in RTL: Action Bar Buttons */}
          <div className="flex flex-row lg:flex-col items-stretch justify-center gap-space-sm shrink-0 border-t lg:border-t-0 pt-space-sm lg:pt-0">
            <button
              onClick={() => alert('جاري تجهيز وتحميل تقرير الأداء الشامل بصيغة PDF عالية الجودة')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-title text-body-md hover:bg-primary/90 transition-colors shadow-sm cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              <span>تحميل التقرير (PDF)</span>
            </button>
            <button
              onClick={() => alert('تم إرسال نسخة الملاحظات إلى حساب المعلم المشرف بنجاح')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-title text-body-md transition-colors cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
              <span>مشاركة مع المعلم</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Key Performance & Progress Summary (Visual Metrics Bento) */}
      <section className="mb-space-lg">
        <div className="flex items-center justify-between mb-space-sm">
          <h2 className="text-title font-title text-on-surface flex items-center gap-2 font-bold">
            <span className="material-symbols-outlined text-primary">insights</span>
            <span>مؤشرات الأداء ومعدل التطور المعرفي</span>
          </h2>
          <span className="text-label-md font-label-md text-on-surface-variant font-medium">آخر تحديث: 14 مارس 2025</span>
        </div>

        {/* Bento Grid Metric Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* Large Card: Improvement Leap */}
          <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-space-lg shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-body-md text-body-md text-on-surface-variant font-bold">
                  التقدم العام في وحدة الكسور والمعادلات
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-md font-label-md font-bold">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span>+26% تحسن ملحوظ</span>
                </span>
              </div>
              <div className="flex items-baseline gap-3 my-2">
                <span className="text-display font-display text-primary font-bold">68%</span>
                <span className="text-headline-sm font-headline-sm text-outline font-medium line-through">42%</span>
                <span className="font-body-sm text-body-sm text-secondary font-bold">قفزة بمقدار مستوى كامل خلال 4 أسابيع</span>
              </div>
            </div>

            {/* Comparative Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-surface-container-high h-3.5 rounded-full overflow-hidden p-0.5 flex">
                <div className="bg-secondary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '68%' }}></div>
              </div>
              <div className="flex justify-between items-center mt-2 text-label-sm font-label-sm text-on-surface-variant">
                <span>نقطة البداية (42% استيعاب أولي)</span>
                <span className="font-bold text-secondary">الهدف الشهري القادم: 85%</span>
              </div>
            </div>
          </div>

          {/* Metric Card 1: Attendance */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-space-md shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-label-md font-label-md text-on-surface-variant font-bold">الحضور والالتزام</span>
              <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">event_available</span>
              </div>
            </div>
            <div className="my-3">
              <div className="text-headline-md font-headline-md text-on-surface font-bold">8 من 8 حصص</div>
              <span className="text-label-md font-label-md text-secondary font-bold">100% حضور كامل دون تأخير</span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>

          {/* Metric Card 2: Assignments */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-space-md shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-label-md font-label-md text-on-surface-variant font-bold">تسليم الواجبات</span>
              <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
              </div>
            </div>
            <div className="my-3">
              <div className="text-headline-md font-headline-md text-on-surface font-bold">7 من 8 واجبات</div>
              <span className="text-label-md font-label-md text-primary font-bold">87.5% دقة وجودة التسليم</span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '87.5%' }}></div>
            </div>
          </div>

          {/* Metric Card 3: Quick Quiz Average */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-space-md shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-label-md font-label-md text-on-surface-variant font-bold">متوسط الاختبارات السريعة</span>
              <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">quiz</span>
              </div>
            </div>
            <div className="my-3">
              <div className="text-headline-md font-headline-md text-on-surface font-bold">
                9.2 <span className="text-headline-sm text-outline-variant font-normal">/ 10</span>
              </div>
              <span className="text-label-md font-label-md text-secondary font-bold">معدل تراكمي ممتاز</span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>

          {/* Metric Card 4: Classroom Interaction */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-space-md shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-label-md font-label-md text-on-surface-variant font-bold">التفاعل أثناء الحصة</span>
              <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">forum</span>
              </div>
            </div>
            <div className="my-3">
              <div className="text-headline-md font-headline-md text-on-surface font-bold">ممتاز</div>
              <span className="text-label-md font-label-md text-secondary font-bold">مشاركة مستمرة وحلول استباقية</span>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '95%' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Detailed Analysis Grid: Strengths vs Areas to Improve */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg mb-space-lg">
        {/* Right Card (Strengths) */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-space-lg shadow-sm hover:border-outline-variant transition-colors">
          <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-outline-variant/40">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-secondary-fixed/50 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[24px]">task_alt</span>
              </div>
              <div>
                <h3 className="text-title font-title text-on-surface font-bold">نقاط القوة والإتقان الأكاديمي</h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant">المهارات التي أظهرت فيها أميرة تميزاً كبيراً</p>
              </div>
            </div>
            <span className="text-label-sm font-label-sm px-2.5 py-1 rounded-md bg-secondary/10 text-secondary font-bold">
              3 ركائز متقنة
            </span>
          </div>

          <ul className="space-y-space-md">
            <li className="flex items-start gap-space-sm p-3 rounded-xl bg-surface-container-low/50">
              <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <div className="flex flex-col">
                <span className="font-body-md text-body-md font-bold text-on-surface">معادلات الدرجة الثانية</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  استيعاب متميز لقواعد حل معادلات الدرجة الثانية جبرياً وبيانياً بدون أخطاء في التعويض.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-space-sm p-3 rounded-xl bg-surface-container-low/50">
              <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <div className="flex flex-col">
                <span className="font-body-md text-body-md font-bold text-on-surface">سرعة ودقة حل التمارين</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  دقة عالية في إنجاز التمارين الفردية أثناء البث المباشر في وقت قياسي وبثقة ذاتية واضحة.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-space-sm p-3 rounded-xl bg-surface-container-low/50">
              <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <div className="flex flex-col">
                <span className="font-body-md text-body-md font-bold text-on-surface">الاستفسارات التحليلية العميقة</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  الالتزام بحل الأسئلة التراكمية وتقديم استفسارات ذكية تعكس فهماً عميقاً لأبعاد المادة.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Left Card (Areas for Improvement) */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-space-lg shadow-sm hover:border-outline-variant transition-colors">
          <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-outline-variant/40">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[24px]">lightbulb</span>
              </div>
              <div>
                <h3 className="text-title font-title text-on-surface font-bold">مجالات التحسين والتطوير المستمر</h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant">النقاط المستهدفة للوصول للدرجة النهائية</p>
              </div>
            </div>
            <span className="text-label-sm font-label-sm px-2.5 py-1 rounded-md bg-tertiary/10 text-tertiary font-bold">
              خطة دعم مقترحة
            </span>
          </div>

          <ul className="space-y-space-md">
            <li className="flex items-start gap-space-sm p-3 rounded-xl bg-surface-container-low/50">
              <span className="material-symbols-outlined text-tertiary text-[22px] shrink-0 mt-0.5">change_circle</span>
              <div className="flex flex-col">
                <span className="font-body-md text-body-md font-bold text-on-surface">براهين ميل المستقيم</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  التردد أحياناً في تطبيق براهين الهندسة التحليلية المعقدة الخاصة بميل المستقيم وعلاقته بالتوازي.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-space-sm p-3 rounded-xl bg-surface-container-low/50">
              <span className="material-symbols-outlined text-tertiary text-[22px] shrink-0 mt-0.5">warning</span>
              <div className="flex flex-col">
                <span className="font-body-md text-body-md font-bold text-on-surface">إشارات الأقواس الرياضية</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  الحاجة لمراجعة إشارات الجمع والطرح عند فك الأقواس بسرعة لتفادي خسارة درجات بسيطة.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-space-sm p-3 rounded-xl bg-surface-container-low/50">
              <span className="material-symbols-outlined text-tertiary text-[22px] shrink-0 mt-0.5">timer</span>
              <div className="flex flex-col">
                <span className="font-body-md text-body-md font-bold text-on-surface">التدريب الزمني</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  التوصية بحل نموذج الاختبار التجريبي رقم 3 لتثبيت مهارة إدارة الوقت قبل اختبار نصف الفصل.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* 4. Teacher's Note */}
      <section className="bg-surface-container-low border border-primary/20 rounded-2xl p-space-lg mb-space-lg relative overflow-hidden">
        <div className="absolute -top-6 -right-6 text-primary/10 select-none pointer-events-none">
          <span className="material-symbols-outlined text-[130px]">format_quote</span>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-space-sm mb-3">
            <span className="material-symbols-outlined text-primary text-[22px]">rate_review</span>
            <h3 className="text-title font-title text-primary font-bold">ملاحظة المعلم الأكاديمي التوجيهية</h3>
          </div>
          <blockquote className="text-body-lg font-body-lg text-on-surface leading-loose pr-2 italic my-3">
            "أميرة طالبة ذكية وتظهر شغفاً حقيقياً بالرياضيات. قفزتها من 42% إلى 68% في استيعاب التفكير الجبري تدل على مجهود استثنائي ورغبة حقيقية في التفوق. سنركز في الحصص القادمة على تمكينها من براهين الهندسة لتصل للعلامة الكاملة بإذن الله."
          </blockquote>
          <div className="flex items-center justify-between pt-3 border-t border-outline-variant/40 mt-4 text-body-sm font-body-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-on-surface">أ. محمود الكردي</span>
              <span className="text-on-surface-variant">— كبير معلمي الرياضيات</span>
            </div>
            <span className="text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
              <span>14 مارس 2025</span>
            </span>
          </div>
        </div>
      </section>

      {/* 5. Next Steps & Recommended Plan */}
      <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-space-lg shadow-sm mb-space-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-sm mb-space-md border-b border-outline-variant/40 gap-2">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">alt_route</span>
            </div>
            <div>
              <h3 className="text-title font-title text-on-surface font-bold">الخطة الأكاديمية والخطوات القادمة المقترحة</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">المسار التدريسي المحدد للأسبوعين القادمين</p>
            </div>
          </div>
          <span className="text-label-md font-label-md px-3 py-1 rounded-full bg-surface-container text-primary font-bold self-start sm:self-auto">
            المرحلة الثانية
          </span>
        </div>

        {/* Roadmap Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {/* Step 1 */}
          <div className="p-space-md rounded-xl border border-outline-variant/50 bg-surface-container-low/40 relative flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-label-sm font-label-sm px-2.5 py-1 rounded-md bg-primary text-on-primary font-bold">
                الحصة 9 (القادمة)
              </span>
              <span className="text-primary font-bold text-headline-sm">01</span>
            </div>
            <h4 className="font-title text-body-lg text-on-surface mb-2 font-bold">مراجعة مركزة على الهندسة</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-4">
              تثبيت معادلة الخط المستقيم وتطبيقات ميل المستقيم مع إعطاء نماذج براهين متدرجة الصعوبة.
            </p>
            <div className="flex items-center gap-1 text-label-sm font-label-sm text-secondary font-bold">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>الأحد القادم: 5:00 مساءً</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-space-md rounded-xl border border-outline-variant/50 bg-surface-container-low/40 relative flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-label-sm font-label-sm px-2.5 py-1 rounded-md bg-secondary text-on-secondary font-bold">
                اختبار تشخيصي
              </span>
              <span className="text-secondary font-bold text-headline-sm">02</span>
            </div>
            <h4 className="font-title text-body-lg text-on-surface mb-2 font-bold">قياس ثبات المستوى</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-4">
              اختبار مصغر مدته (15 دقيقة) للتأكد من زوال التردد عند فك الأقواس الجبرية والتحكم في الإشارات.
            </p>
            <div className="flex items-center gap-1 text-label-sm font-label-sm text-primary font-bold">
              <span className="material-symbols-outlined text-[16px]">timer</span>
              <span>مدة الاختبار: 15 دقيقة تفاعلية</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-space-md rounded-xl border border-outline-variant/50 bg-surface-container-low/40 relative flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-label-sm font-label-sm px-2.5 py-1 rounded-md bg-outline-variant text-on-surface-variant font-bold">
                الوحدة الثالثة
              </span>
              <span className="text-on-surface-variant font-bold text-headline-sm">03</span>
            </div>
            <h4 className="font-title text-body-lg text-on-surface mb-2 font-bold">حساب المثلثات التفاعلي</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-4">
              الانتقال التدريجي لمفاهيم النسب المثلثية للزاوية الحادة مع حل مسائل بنك الأسئلة الذكي.
            </p>
            <div className="flex items-center gap-1 text-label-sm font-label-sm text-on-surface-variant font-bold">
              <span className="material-symbols-outlined text-[16px]">auto_stories</span>
              <span>مقرر الأسبوع القادم</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bottom Action Footer / Buttons */}
      <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-space-lg shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md mb-space-xl">
        <div className="flex flex-col text-center sm:text-right">
          <h4 className="text-title font-title text-on-surface font-bold">مستعد لحجز الحصة التدريبية التالية لأميرة؟</h4>
          <p className="text-body-sm font-body-sm text-on-surface-variant">الاستمرارية تضمن تثبيت نسبة التحسن ورفع المعدل الدراسي</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-space-sm w-full sm:w-auto">
          <button
            onClick={() => alert('تم حجز موعد استشارة هاتفية سريعة مع المعلم، سيتواصل معكم خلال ساعات العمل.')}
            className="text-body-sm font-body-sm text-primary hover:underline px-3 py-2 flex items-center gap-1 font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
            <span>طلب استشارة هاتفية مع المعلم</span>
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className="px-5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-title text-body-md transition-colors cursor-pointer font-bold"
          >
            عرض كل تقارير الطالبة
          </button>
          <button
            onClick={() => onOpenBookingModal()}
            className="px-6 py-2.5 rounded-xl bg-secondary text-on-secondary font-title text-body-md hover:bg-secondary/90 transition-colors shadow-sm flex items-center gap-2 cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-[20px]">calendar_add_on</span>
            <span>حجز الحصة القادمة ومتابعة الخطة</span>
          </button>
        </div>
      </section>
    </main>
    </div>
  );
};
