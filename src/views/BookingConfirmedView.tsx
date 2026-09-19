import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface BookingConfirmedViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenBookingModal: () => void;
}

export const BookingConfirmedView: React.FC<BookingConfirmedViewProps> = ({
  setActiveTab,
  onOpenBookingModal
}) => {
  const [checklistCompleted, setChecklistCompleted] = useState<{ [key: number]: boolean }>({
    1: true,
    2: false,
    3: false
  });

  const toggleChecklist = (step: number) => {
    setChecklistCompleted(prev => ({
      ...prev,
      [step]: !prev[step]
    }));
  };

  const completedCount = Object.values(checklistCompleted).filter(Boolean).length;

  return (
    <div className="w-full text-right">
      {/* Breadcrumbs Navigation */}
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
            label: 'حجوزات الحصص',
            onClick: () => setActiveTab('teachers')
          },
          {
            label: 'تأكيد الحجز ومتابعة الموعد (#GH-84920)',
            isCurrent: true
          }
        ]}
      />

      <main className="flex-grow w-full max-w-7xl mx-auto px-margin py-8 text-right">
      {/* 1. CELEBRATORY SUCCESS BANNER */}
      <section className="mb-8 rounded-2xl bg-surface-container-lowest border border-secondary/30 shadow-sm overflow-hidden relative">
        <div className="absolute inset-y-0 right-0 w-2.5 bg-secondary"></div>
        <div className="p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center shrink-0 shadow-inner">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <span className="text-headline-sm font-headline-sm text-on-surface font-bold">
                  تم تأكيد حجز الحصة التجريبية بنجاح! 🎉
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-label-md text-label-md font-semibold border border-primary-fixed-dim">
                  <span className="material-symbols-outlined text-base">tag</span>
                  <span>المرجع: #GH-84920</span>
                </span>
              </div>
              <p className="text-body-md font-body-md text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-lg">schedule</span>
                <span>سيبدأ الدرس المباشر بعد ٣ أيام. لقد أرسلنا تذكرة الحجز وتأكيد الموعد إلى بريدك الإلكتروني وهاتفك المسجل.</span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons on Banner */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto self-end lg:self-center">
            <button
              onClick={() => alert('تمت إضافة موعد الحصة إلى تقويم Google التقويم المحلي!')}
              className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-surface-container-low border border-outline-variant hover:bg-surface-container text-on-surface font-label-md text-label-md transition-all active:scale-95 cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-primary text-xl">event</span>
              <span>إضافة إلى التقويم</span>
            </button>
            <button
              onClick={() => alert('تم تجهيز بطاقة الموعد ورابط القاعة للمشاركة عبر تطبيق WhatsApp.')}
              className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-surface-container-low border border-outline-variant hover:bg-surface-container text-on-surface font-label-md text-label-md transition-all active:scale-95 cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-secondary text-xl">share</span>
              <span>مشاركة عبر واتساب</span>
            </button>
          </div>
        </div>

        {/* Micro-notification Strip */}
        <div className="bg-surface-container-low/70 px-6 md:px-8 py-3 border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-3 text-body-sm font-body-sm text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-lg">mark_chat_unread</span>
            <span>تنبيه آلي: سيصلك رابط الانضمام المباشر للقاعة الافتراضية عبر رسائل واتساب والمنصة قبل بدء الحصة بـ ١٥ دقيقة.</span>
          </div>
          <button
            onClick={() => setActiveTab('classes')}
            className="text-primary font-label-md text-label-md hover:underline flex items-center gap-1 cursor-pointer font-bold"
          >
            <span>الانتقال إلى جدول فصولي</span>
            <span className="material-symbols-outlined text-base">arrow_back</span>
          </button>
        </div>
      </section>

      {/* 2. BENTO MAIN CONTENT: FEATURED LESSON + PREP CHECKLIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* FEATURED NEXT LESSON CARD (Spans 8 columns) */}
        <section className="lg:col-span-8 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">event_upcoming</span>
              <h2 className="text-title font-title text-on-surface font-bold">الحصة القادمة المؤكدة</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-label-sm font-label-sm font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
              <span>حصة تجريبية مجانية مؤكدة</span>
            </span>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/70 p-6 md:p-8 shadow-sm hover:border-outline transition-all flex flex-col justify-between flex-grow">
            <div>
              {/* Subject Header & Countdown Badge */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-outline-variant/40">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold text-lg shadow-sm">
                    ض
                  </div>
                  <div>
                    <span className="text-label-sm font-label-sm text-tertiary-container font-semibold tracking-wide">
                      المرحلة الإعدادية • الصف الثالث الإعدادي
                    </span>
                    <h3 className="text-headline-sm font-headline-sm text-on-surface font-bold">اللغة العربية: القواعد والبلاغة</h3>
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-surface-container-low border border-primary-fixed-dim">
                  <span className="material-symbols-outlined text-primary text-xl">timelapse</span>
                  <div>
                    <p className="text-label-sm font-label-sm text-outline">يبدأ البث خلال:</p>
                    <p className="text-label-md font-label-md text-primary font-bold">٣ أيام و ٤ ساعات</p>
                  </div>
                </div>
              </div>

              {/* Lesson Title & Curriculum Context */}
              <div className="py-5">
                <div className="flex items-center gap-2 text-label-md font-label-md text-primary mb-1 font-bold">
                  <span className="material-symbols-outlined text-base">menu_book</span>
                  <span>موضوع الجلسة التفاعلية:</span>
                </div>
                <h4 className="text-title font-title text-on-surface text-lg md:text-xl font-bold">
                  "مدخل المشتقات وصياغة اسم الفاعل وإعماله في النحو العربي والتطبيقات البلاغية"
                </h4>
                <p className="text-body-md font-body-md text-on-surface-variant mt-2 leading-relaxed">
                  جلسة تشخيصية تأسيسية تقيس المستوى الفعلي للطالبة، وتضع خطة متكاملة لمراجعة الفصل الدراسي، متضمنة تدريبات حل نموذجية على أسئلة الامتحانات التراكمية.
                </p>
              </div>

              {/* Teacher Profile Ribbon */}
              <div className="bg-surface-container-low rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 border border-outline-variant/50">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-VDF-COfHHi6OeAHTETJ0ZYbveKD0u6Sg88XqKbSYIr24nHHkjVcGQVQJXeOu5ddQkvkOH-5dI-1gVHITsGvrO2_cM6AJy-3XvuhPyTGHSV2reKL4YwrAKVvn2sDiXtjcd-hbzPkw28inWAB9xCVrmlZDvS8b56mKuXLWyvrBqiSLk7rpAknRPoQCe4BLouhydzH9p1HS999if9inVvdgDHs_yxW3eJMzTOGgF-xhCmeGxWCe0UXQeQ"
                      alt="أ. إبراهيم فؤاد الدسوقي"
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-primary"
                    />
                    <span className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shadow" title="معلم موثق">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-title font-title text-on-surface font-bold">أ. إبراهيم فؤاد الدسوقي</h5>
                      <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant text-label-sm font-label-sm font-semibold">
                        معلم معتمد
                      </span>
                    </div>
                    <p className="text-body-sm font-body-sm text-outline">كبير معلمي اللغة العربية بمدارس المتفوقين • خبرة ١٦ عاماً</p>
                    <div className="flex items-center gap-3 mt-1 text-label-sm font-label-sm text-on-surface-variant">
                      <span className="flex items-center text-tertiary gap-0.5">
                        <span className="material-symbols-outlined text-sm text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <strong className="font-semibold text-on-surface">4.95</strong> (١٤٢ تقييم ولي أمر)
                      </span>
                      <span>•</span>
                      <span>١،٢٨٠ ساعة تعليمية منجزة</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('teacher_profile')}
                  className="px-3.5 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant text-primary hover:bg-surface text-label-md font-label-md flex items-center gap-1.5 transition-all cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-base">account_box</span>
                  <span>ملف المعلم</span>
                </button>
              </div>

              {/* Date & Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/40 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed/50 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">calendar_month</span>
                  </div>
                  <div>
                    <span className="text-label-sm font-label-sm text-outline block">التاريخ واليوم</span>
                    <span className="text-label-md font-label-md text-on-surface font-semibold">الأحد، ١٦ مارس ٢٠٢٥</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/40 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed/50 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <span className="text-label-sm font-label-sm text-outline block">توقيت الحصة</span>
                    <span className="text-label-md font-label-md text-on-surface font-semibold">٠٤:٠٠ م - ٠٥:٣٠ م (٩٠ دقيقة)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/40 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed/50 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">videocam</span>
                  </div>
                  <div>
                    <span className="text-label-sm font-label-sm text-outline block">قاعة الجلسة</span>
                    <span className="text-label-md font-label-md text-on-surface font-semibold">استوديو غايتي الافتراضي HD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Action Buttons */}
            <div className="pt-4 border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => alert('جاري تحميل مذكرة درس المشتقات (PDF 3.8MB)')}
                  className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-surface-container-low border border-outline-variant hover:bg-surface text-on-surface font-label-md text-label-md transition-all cursor-pointer font-semibold"
                >
                  <span className="material-symbols-outlined text-primary">download</span>
                  <span>تحميل مذكرة الدرس (PDF)</span>
                </button>
                <button
                  onClick={() => alert('تم فحص الكاميرا والميكروفون بنجاح! جميع الأجهزة جاهزة للبث المباشر.')}
                  className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-surface-container-low border border-outline-variant hover:bg-surface text-on-surface font-label-md text-label-md transition-all cursor-pointer font-semibold"
                >
                  <span className="material-symbols-outlined text-primary">mic</span>
                  <span>فحص الكاميرا والصوت</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-secondary text-on-secondary opacity-80 cursor-not-allowed font-label-md text-label-md shadow font-bold"
                  title="يُتاح زر دخول القاعة قبل موعد الدرس بـ 15 دقيقة"
                >
                  <span className="material-symbols-outlined">sensors</span>
                  <span>دخول القاعة (يُتاح قبل البدء بـ ١٥ دقيقة)</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* PRE-CLASS CHECKLIST & TIPS (Spans 4 columns) */}
        <aside className="lg:col-span-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">fact_check</span>
              <h2 className="text-title font-title text-on-surface font-bold">خطوات الجاهزية للحصة</h2>
            </div>
            <span className="text-label-sm font-label-sm text-secondary font-bold">
              خطوة {completedCount} من 3 مكتملة
            </span>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/70 p-6 shadow-sm flex flex-col justify-between flex-grow">
            <div className="space-y-4">
              {/* Checklist Item 1 */}
              <div
                onClick={() => toggleChecklist(1)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  checklistCompleted[1]
                    ? 'bg-surface-container-low border-secondary/40'
                    : 'bg-surface-container-lowest border-outline-variant/80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    checklistCompleted[1] ? 'bg-secondary text-on-secondary' : 'border-2 border-outline text-outline'
                  }`}>
                    {checklistCompleted[1] ? (
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    ) : '١'}
                  </div>
                  <div>
                    <h4 className="text-label-md font-label-md text-on-surface font-bold">تجهيز الجهاز والبيئة الهادئة</h4>
                    <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
                      تم التأكد من توفر حاسوب محمول أو جهاز لوحي مع سماعة رأس مريحة لتدوين الملاحظات.
                    </p>
                    <span className="inline-block mt-2 text-label-sm font-label-sm text-secondary font-semibold">
                      {checklistCompleted[1] ? 'تم التحقق بنجاح ✔️' : 'اضغط للتأكيد'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checklist Item 2 */}
              <div
                onClick={() => toggleChecklist(2)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  checklistCompleted[2]
                    ? 'bg-surface-container-low border-secondary/40'
                    : 'bg-surface-container-lowest border-outline-variant/80 hover:border-primary'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    checklistCompleted[2] ? 'bg-secondary text-on-secondary' : 'border-2 border-primary text-primary text-label-sm font-bold'
                  }`}>
                    {checklistCompleted[2] ? (
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    ) : '٢'}
                  </div>
                  <div>
                    <h4 className="text-label-md font-label-md text-on-surface font-bold">مجموعة المتابعة لأولياء الأمور</h4>
                    <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
                      انضم لقناة واتساب الخاصة بفوج مادة اللغة العربية لاستلام التنبيهات المباشرة وملخص أداء الطالب.
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleChecklist(2);
                        alert('مرحباً بك في قناة واتساب لمجموعة مادة اللغة العربية!');
                      }}
                      className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg bg-surface-container text-primary font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-colors cursor-pointer font-bold"
                    >
                      <span className="material-symbols-outlined text-base">forum</span>
                      <span>انضمام فوري لمجموعة الواتساب</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Checklist Item 3 */}
              <div
                onClick={() => toggleChecklist(3)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  checklistCompleted[3]
                    ? 'bg-surface-container-low border-secondary/40'
                    : 'bg-surface-container-lowest border-outline-variant/80 hover:border-primary'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    checklistCompleted[3] ? 'bg-secondary text-on-secondary' : 'border-2 border-outline text-outline text-label-sm font-bold'
                  }`}>
                    {checklistCompleted[3] ? (
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    ) : '٣'}
                  </div>
                  <div>
                    <h4 className="text-label-md font-label-md text-on-surface font-bold">ورقة المفاهيم التمهيدية السريعة</h4>
                    <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
                      نظرة خاطفة مدتها ٥ دقائق على ملخص الأوزان الصرفية قبل موعد البث المباشر.
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleChecklist(3);
                        alert('فتح ورقة المفاهيم التمهيدية...');
                      }}
                      className="inline-flex items-center gap-1.5 mt-3 text-primary hover:underline text-label-md font-label-md font-semibold cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">description</span>
                      <span>معاينة ورقة المفاهيم</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Support Box */}
            <div className="mt-6 p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">support_agent</span>
              <div>
                <p className="text-label-md font-label-md text-on-surface font-semibold">تحتاج مساعدة فنية أو تغيير الموعد؟</p>
                <p className="text-body-sm font-body-sm text-outline">فريق الدعم الأكاديمي متواجد على مدار الساعة</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* 3. OTHER ENROLLED CLASSES */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-headline-sm font-headline-sm text-on-surface font-bold">بقية فصول الطالبة (أميرة) المسجلة</h2>
            <p className="text-body-md font-body-md text-outline">تابع جدول الحصص الأسبوعية وتقدم التحصيل الدراسي في المواد الأخرى</p>
          </div>
          <button
            onClick={() => setActiveTab('classes')}
            className="text-primary font-label-md text-label-md hover:underline flex items-center gap-1 cursor-pointer font-bold"
          >
            <span>عرض الجدول الأسبوعي الكامل</span>
            <span className="material-symbols-outlined text-base">arrow_back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Math */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm flex flex-col justify-between hover:border-primary-fixed-dim transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-label-sm font-label-sm font-semibold">
                  حصة دورية معتمدة
                </span>
                <span className="text-label-md font-label-md text-secondary font-bold">حصة رقم ٨ / ١٢</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high text-primary flex items-center justify-center font-bold">
                  ∑
                </div>
                <div>
                  <h3 className="text-title font-title text-on-surface font-bold">الرياضيات (الجبر والهندسة)</h3>
                  <p className="text-body-sm font-body-sm text-outline">أ. محمود الكردي • الثلاثاء القادم</p>
                </div>
              </div>

              <div className="space-y-2 py-3 border-y border-outline-variant/30 text-body-sm font-body-sm text-on-surface-variant">
                <div className="flex items-center justify-between">
                  <span>الموعد القادم:</span>
                  <span className="font-semibold text-on-surface">الثلاثاء، ١٨ مارس • ٠٦:٠٠ م</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>الواجب المرفق:</span>
                  <span className="text-secondary font-semibold">تم التسليم والتصحيح (٩/١٠)</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('reports')}
                className="text-primary font-label-md text-label-md hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <span>تقرير أداء المادة</span>
                <span className="material-symbols-outlined text-sm">insights</span>
              </button>
              <button
                onClick={() => setActiveTab('classes')}
                className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer font-semibold"
              >
                غرفة الفصل
              </button>
            </div>
          </div>

          {/* Science */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm flex flex-col justify-between hover:border-primary-fixed-dim transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-label-sm font-label-sm font-semibold">
                  حصة دورية معتمدة
                </span>
                <span className="text-label-md font-label-md text-secondary font-bold">حصة رقم ٥ / ١٠</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-xl">biotech</span>
                </div>
                <div>
                  <h3 className="text-title font-title text-on-surface font-bold">العلوم المتكاملة والفيزياء</h3>
                  <p className="text-body-sm font-body-sm text-outline">أ. مريم الشافعي • الخميس القادم</p>
                </div>
              </div>

              <div className="space-y-2 py-3 border-y border-outline-variant/30 text-body-sm font-body-sm text-on-surface-variant">
                <div className="flex items-center justify-between">
                  <span>الموعد القادم:</span>
                  <span className="font-semibold text-on-surface">الخميس، ٢٠ مارس • ٠٥:٠٠ م</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>المشروع المعملي:</span>
                  <span className="text-primary font-semibold">قيد المراجعة</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 flex items-center justify-between">
              <button
                onClick={() => alert('عرض تسجيلات حصص العلوم السابقة')}
                className="text-primary font-label-md text-label-md hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <span>تسجيلات الحصص السابقة</span>
                <span className="material-symbols-outlined text-sm">play_circle</span>
              </button>
              <button
                onClick={() => setActiveTab('classes')}
                className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer font-semibold"
              >
                غرفة الفصل
              </button>
            </div>
          </div>

          {/* Enrolled Class Card 3: Explore / Book New Subject */}
          <div className="bg-gradient-to-br from-surface-container-low to-surface-container-highest/40 rounded-2xl border-2 border-dashed border-outline-variant p-6 flex flex-col justify-between items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest text-primary flex items-center justify-center shadow-sm mb-3">
              <span className="material-symbols-outlined text-3xl">add_card</span>
            </div>
            <div>
              <h3 className="text-title font-title text-on-surface font-bold">هل تود تقوية الطالب في مادة أخرى؟</h3>
              <p className="text-body-sm font-body-sm text-outline mt-1 max-w-xs">
                احجز حصة تجريبية مجانية أخرى في اللغة الإنجليزية أو الدراسات الاجتماعية مع نخبة المعلمين المعتمدين.
              </p>
            </div>
            <button
              onClick={() => onOpenBookingModal()}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container shadow active:scale-95 transition-all font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">explore</span>
              <span>استكشاف معلمي المواد</span>
            </button>
          </div>
        </div>
      </section>
    </main>
    </div>
  );
};
