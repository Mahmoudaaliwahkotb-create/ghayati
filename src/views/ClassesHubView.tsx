import React, { useState } from 'react';
import { ActiveTab, Teacher } from '../types';
import { CALENDAR_SESSIONS, ENROLLED_CLASSES, SUBJECT_CATALOG, TEACHERS_LIST } from '../data/mockData';
import { InteractiveCalendar } from '../components/InteractiveCalendar';

interface ClassesHubViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedTeacher: (teacher: Teacher) => void;
  onOpenBookingModal: (teacher?: Teacher) => void;
  onOpenClassroom?: (topic?: string, teacher?: string) => void;
  onTriggerFifteenMinAlert?: () => void;
}

export const ClassesHubView: React.FC<ClassesHubViewProps> = ({
  setActiveTab,
  setSelectedTeacher,
  onOpenBookingModal,
  onOpenClassroom,
  onTriggerFifteenMinAlert
}) => {
  const [scheduleViewMode, setScheduleViewMode] = useState<'calendar' | 'cards'>('calendar');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Subject filter options with live counts from data
  const subjectFilterOptions = [
    {
      id: 'all',
      label: 'جميع المواد',
      icon: 'category',
      classesCount: ENROLLED_CLASSES.length,
      sessionsCount: CALENDAR_SESSIONS.length,
      dotColor: undefined,
    },
    {
      id: 'math',
      label: 'الرياضيات',
      icon: 'calculate',
      classesCount: ENROLLED_CLASSES.filter(c => c.subject.includes('الرياضيات')).length,
      sessionsCount: CALENDAR_SESSIONS.filter(s => s.subject.includes('الرياضيات')).length,
      dotColor: '#1e40af',
    },
    {
      id: 'arabic',
      label: 'اللغة العربية',
      icon: 'auto_stories',
      classesCount: ENROLLED_CLASSES.filter(c => c.subject.includes('العربية')).length,
      sessionsCount: CALENDAR_SESSIONS.filter(s => s.subject.includes('العربية')).length,
      dotColor: '#dc2626',
    },
    {
      id: 'science',
      label: 'العلوم المتكاملة',
      icon: 'science',
      classesCount: ENROLLED_CLASSES.filter(c => c.subject.includes('العلوم')).length,
      sessionsCount: CALENDAR_SESSIONS.filter(s => s.subject.includes('العلوم')).length,
      dotColor: '#9333ea',
    },
  ];

  // Filtered enrolled classes for Cards view
  const filteredEnrolledClasses = ENROLLED_CLASSES.filter(course => {
    if (selectedSubject === 'all') return true;
    if (selectedSubject === 'math') return course.subject.includes('الرياضيات');
    if (selectedSubject === 'arabic') return course.subject.includes('العربية');
    if (selectedSubject === 'science') return course.subject.includes('العلوم');
    return true;
  });

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-margin py-8 md:py-12 space-y-16 md:space-y-20 text-right">
      {/* ================= HEADER: WELCOME & CURRENT TERM ================= */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-headline-lg text-on-surface tracking-tight font-bold">
            أهلاً بك، أحمد 👋
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
            لديك اليوم حصة دراسية مجدولة، استعد وتأكد من تجهيز دفاتر مراجعتك.
          </p>
        </div>

        <div className="self-start md:self-auto shrink-0">
          <span className="inline-flex items-center gap-2 bg-surface-container-low text-on-surface-variant text-xs font-semibold px-3.5 py-2 rounded-full">
            <span className="material-symbols-outlined text-base text-primary">calendar_today</span>
            <span>الفصل الدراسي الثاني • الأسبوع السابع</span>
          </span>
        </div>
      </header>

      {/* ================= 1. FEATURE SECTION: UPCOMING LESSON (CONSOLIDATED CARD) ================= */}
      <section aria-labelledby="upcoming-lesson-title">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
            <h2 className="text-xl md:text-2xl font-headline-sm text-on-surface font-bold tracking-tight" id="upcoming-lesson-title">
              الحصة القادمة
            </h2>
          </div>
          <span className="text-xs font-medium text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full">
            مباشر اليوم
          </span>
        </div>

        {/* Single Unified Upcoming Lesson Card with Generous Internal Spacing */}
        <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6 sm:p-8 md:p-10 space-y-8">
            {/* Top row: Subject & Time Info */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                {/* Secondary Meta Tags (visually quieter, neutral styling) */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-on-surface-variant">
                  <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary font-bold px-3 py-1 rounded-full">
                    <span className="material-symbols-outlined text-sm">calculate</span>
                    <span>الرياضيات • جبر وهندسة</span>
                  </span>
                  <span className="inline-flex items-center gap-1 bg-surface-container text-on-surface-variant px-2.5 py-1 rounded-full font-medium">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span>اليوم 05:30 م (60 دقيقة)</span>
                  </span>
                </div>

                {/* DOMINANT ELEMENT: Large, High-Contrast Lesson Headline */}
                <h3 className="text-2xl sm:text-3xl font-headline-sm text-on-surface font-bold leading-snug">
                  حل معادلات الدرجة الثانية وتطبيقاتها الحياتية
                </h3>

                {/* Tutor Info (visually quieter) */}
                <div className="flex items-center gap-3 pt-1">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUsy9WyJZVlgaHdIpBmViL47B5u2Is50dCZvlJqcQ9x0-Hq74uBeo4Jov6_GyGLiEn6NAHy31s6gCUjOundidI9AbPNCiwGTBgFefKls67LcnYGMl47zi9yJQC_qaZ4Otz2TL8i_fF0BEeznfHRtOoIaTCK27gxdi0AAqONhsAMXos2_nlqOIhGPPuXVlIT9maYzYQyugnRVkTxNi7CMSUfdl2G5WLCrJ9pnqBELIVz76B2fJu3Y8GMA"
                    alt="أ. محمود الكردي"
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-surface-container"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-on-surface text-sm sm:text-base">أ. محمود الكردي</span>
                      <span className="material-symbols-outlined text-primary text-base" title="معلم موثق">
                        verified
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant">
                      معلم خبير رياضيات • تقييم 4.9 ★ (180+ درس)
                    </p>
                  </div>
                </div>
              </div>

              {/* Countdown & PRIMARY ACTION (Accent green used exclusively for joining lesson) */}
              <div className="lg:w-72 flex flex-col gap-3.5 shrink-0 bg-surface-container-low/60 rounded-2xl p-5">
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span>يبدأ البث خلال:</span>
                  </span>
                  <span className="font-mono font-bold text-on-surface text-sm dir-ltr">
                    45 : 18 دقيقة
                  </span>
                </div>

                {/* PRIMARY ACTION: Accent Green ONLY */}
                <button
                  onClick={() => {
                    if (onOpenClassroom) {
                      onOpenClassroom('الرياضيات - جبر وهندسة (حل معادلات الدرجة الثانية)', 'أ. محمود الكردي');
                    } else {
                      alert('مرحباً بك! جاري الاتصال بالقاعة الافتراضية عالية الجودة...');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary px-5 py-3.5 rounded-xl text-base font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">
                    video_camera_front
                  </span>
                  <span>انضمام للحصة الآن</span>
                </button>

                {/* Secondary Actions Row */}
                <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1 px-1">
                  <a
                    href="#download"
                    onClick={(e) => { e.preventDefault(); alert('جارٍ تنزيل ورقة التمارين المرفقة (PDF 2.4MB)'); }}
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span>ورقة التمارين (PDF)</span>
                  </a>

                  <button
                    onClick={() => setActiveTab('reports')}
                    className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">analytics</span>
                    <span>تقرير الأداء</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Integrated Status Footer (Grouped inside the card instead of a separate competing box) */}
          <div className="bg-surface-container-low/40 border-t border-outline-variant/40 px-6 sm:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-on-surface-variant">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-lg">notifications</span>
              <span>
                <strong>نظام الإشعارات الذكي مفعّل:</strong> يصلك تنبيه تلقائي قبل الحصة بـ 15 دقيقة مع رابط الدخول المباشر.
              </span>
            </div>

            {onTriggerFifteenMinAlert && (
              <button
                onClick={onTriggerFifteenMinAlert}
                className="self-start sm:self-auto text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>معاينة التنبيه</span>
                <span className="material-symbols-outlined text-sm">arrow_back</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ================= 2. INTERACTIVE CALENDAR & ENROLLED CLASSES ================= */}
      <section aria-labelledby="enrolled-classes-title" className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
            <h2 className="text-xl md:text-2xl font-headline-sm text-on-surface font-bold tracking-tight" id="enrolled-classes-title">
              جدول المواعيد وفصولي الدراسية
            </h2>
            <span className="bg-surface-container text-on-surface-variant text-xs px-2.5 py-0.5 rounded-full font-semibold">
              {selectedSubject === 'all'
                ? '3 مواد مسجلة'
                : `${filteredEnrolledClasses.length} فصل دراسي مسجل`}
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* View Mode Toggle: Interactive Calendar vs Cards */}
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
              <button
                onClick={() => setScheduleViewMode('calendar')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  scheduleViewMode === 'calendar'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="عرض التقويم التفاعلي"
              >
                <span className="material-symbols-outlined text-base">calendar_month</span>
                <span>التقويم التفاعلي</span>
              </button>

              <button
                onClick={() => setScheduleViewMode('cards')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  scheduleViewMode === 'cards'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="عرض بطاقات الفصول"
              >
                <span className="material-symbols-outlined text-base">grid_view</span>
                <span>بطاقات الفصول</span>
              </button>
            </div>

            <button
              onClick={() => setActiveTab('booking_confirmed')}
              className="text-xs text-on-surface-variant hover:text-primary font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>تفاصيل آخر حجز</span>
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </button>
          </div>
        </div>

        {/* ================= SUBJECT FILTER (نظام تصنيف المواد الدراسية) ================= */}
        <div className="bg-surface-container-low/70 border border-outline-variant/60 rounded-2xl p-3 sm:p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-on-surface flex items-center gap-1.5 ml-1">
                <span className="material-symbols-outlined text-base text-primary">filter_alt</span>
                <span>تصنيف المواد:</span>
              </span>

              <div className="flex items-center gap-1.5 flex-wrap">
                {subjectFilterOptions.map((option) => {
                  const isSelected = selectedSubject === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelectedSubject(option.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-outline-variant/60 hover:border-primary/40'
                      }`}
                    >
                      {option.dotColor && (
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: option.dotColor }}
                        />
                      )}
                      <span className="material-symbols-outlined text-sm">{option.icon}</span>
                      <span>{option.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {scheduleViewMode === 'cards' ? `${option.classesCount} فصول` : `${option.sessionsCount} حصص`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick status & clear action */}
            {selectedSubject !== 'all' && (
              <div className="flex items-center justify-between md:justify-end gap-3 text-xs pt-2 md:pt-0 border-t md:border-t-0 border-outline-variant/40">
                <span className="text-on-surface-variant">
                  تصفية نشطة:{' '}
                  <strong className="text-on-surface">
                    {subjectFilterOptions.find((o) => o.id === selectedSubject)?.label}
                  </strong>
                </span>
                <button
                  onClick={() => setSelectedSubject('all')}
                  className="text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">restart_alt</span>
                  <span>إلغاء التصفية</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Display: Interactive Calendar OR Cards Grid */}
        {scheduleViewMode === 'calendar' ? (
          <div className="space-y-4">
            <InteractiveCalendar
              setActiveTab={setActiveTab}
              setSelectedTeacher={setSelectedTeacher}
              onOpenBookingModal={onOpenBookingModal}
              onOpenClassroom={onOpenClassroom}
              subjectFilter={selectedSubject}
              onSubjectFilterChange={setSelectedSubject}
            />

            {/* Quick access row integrated cleanly with soft pills */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-2 pt-1 text-xs text-on-surface-variant">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-on-surface">فصولك الحالية:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {ENROLLED_CLASSES.map((course) => {
                    const isSubjectActive =
                      (selectedSubject === 'math' && course.subject.includes('الرياضيات')) ||
                      (selectedSubject === 'arabic' && course.subject.includes('العربية')) ||
                      (selectedSubject === 'science' && course.subject.includes('العلوم'));

                    return (
                      <button
                        key={course.id}
                        onClick={() => {
                          if (course.subject.includes('الرياضيات')) {
                            setSelectedSubject(selectedSubject === 'math' ? 'all' : 'math');
                          } else if (course.subject.includes('العربية')) {
                            setSelectedSubject(selectedSubject === 'arabic' ? 'all' : 'arabic');
                          } else if (course.subject.includes('العلوم')) {
                            setSelectedSubject(selectedSubject === 'science' ? 'all' : 'science');
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                          isSubjectActive
                            ? 'bg-primary text-on-primary font-bold shadow-xs'
                            : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                        }`}
                        title={`تصفية الحصص لمادة ${course.subject}`}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: isSubjectActive ? '#ffffff' : course.accentColor }}
                        ></span>
                        <span className="font-semibold">{course.subject}</span>
                        <span className={isSubjectActive ? 'text-white/80' : 'text-outline'}>
                          ({course.completedLessons}/{course.totalLessons})
                        </span>
                      </button>
                    );
                  })}
                  {selectedSubject !== 'all' && (
                    <button
                      onClick={() => setSelectedSubject('all')}
                      className="text-xs text-primary hover:underline font-semibold mr-1 cursor-pointer"
                    >
                      إلغاء التصفية
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={() => setScheduleViewMode('cards')}
                className="text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>عرض بطاقات الفصول كاملة</span>
                <span className="material-symbols-outlined text-sm">view_agenda</span>
              </button>
            </div>
          </div>
        ) : (
          /* Grid of Enrolled Classes (Refined with softer borders and clearer focal points) */
          filteredEnrolledClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEnrolledClasses.map((course) => (
                <div
                  key={course.id}
                  className="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div className="space-y-4">
                    {/* Top Tag & Options */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-surface-container-low text-on-surface">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: course.accentColor }}></span>
                        <span>{course.subject}</span>
                      </span>
                      <button aria-label="خيارات المادة" className="text-outline hover:text-on-surface p-1 rounded-md">
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    </div>

                    {/* DOMINANT TITLE */}
                    <h3 className="text-lg font-title text-on-surface font-bold group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>

                    {/* Tutor Snippet */}
                    <div className="flex items-center gap-3 py-1">
                      <img
                        src={course.teacherAvatar}
                        alt={course.teacherName}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-outline-variant/50"
                      />
                      <div>
                        <p className="text-sm text-on-surface font-semibold">{course.teacherName}</p>
                        <p className="text-xs text-on-surface-variant">{course.teacherTitle}</p>
                      </div>
                    </div>

                    {/* Schedule details */}
                    <div className="bg-surface-container-low/60 rounded-xl p-3 text-xs text-on-surface-variant space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-outline text-base">calendar_month</span>
                        <span>المواعيد: <strong className="text-on-surface">{course.days}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-outline text-base">schedule</span>
                        <span>الساعة: <strong className="text-on-surface">{course.time}</strong></span>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs text-on-surface-variant">
                        <span>الإنجاز الدراسي</span>
                        <span className="font-semibold text-on-surface">
                          {course.completedLessons} من {course.totalLessons} حصة ({course.progressPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${course.progressPercent}%`, backgroundColor: course.accentColor }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Actions (Secondary style, not green) */}
                  <div className="pt-4 mt-4 border-t border-outline-variant/40 flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (course.id === 'math-prep3') {
                          setActiveTab('reports');
                        } else if (course.id === 'arabic-prep3') {
                          const ibrahim = TEACHERS_LIST.find(t => t.id === 'ibrahim-desouky');
                          if (ibrahim) {
                            setSelectedTeacher(ibrahim);
                            setActiveTab('teacher_profile');
                          }
                        } else {
                          setActiveTab('teachers');
                        }
                      }}
                      className="flex-1 bg-surface-container-low hover:bg-surface-container text-primary text-xs py-2.5 rounded-xl transition-colors font-bold cursor-pointer text-center"
                    >
                      {course.nextSessionText}
                    </button>
                    <button
                      onClick={() => {
                        if (course.id === 'math-prep3') {
                          setActiveTab('reports');
                        } else {
                          alert(`عرض الواجبات والتطبيقات لمادة ${course.subject}`);
                        }
                      }}
                      className="p-2.5 text-on-surface-variant hover:text-primary rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer"
                      title="الواجبات والتقارير"
                    >
                      <span className="material-symbols-outlined text-lg">assignment</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-8 text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
              <h3 className="text-base font-bold text-on-surface">لا توجد فصول دراسية مسجلة في هذا التصنيف</h3>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                يمكنك حجز حصة تجريبية أو استعراض نخبة المعلمين المتاحين لهذه المادة.
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={() => setSelectedSubject('all')}
                  className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold cursor-pointer"
                >
                  عرض جميع المواد
                </button>
                <button
                  onClick={() => setActiveTab('teachers')}
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold cursor-pointer"
                >
                  استعراض المعلمين
                </button>
              </div>
            </div>
          )
        )}
      </section>

      {/* ================= 3. BROWSE MORE SUBJECTS / CATALOG ================= */}
      <section aria-labelledby="browse-catalog-title" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/50 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              <h2 className="text-xl md:text-2xl font-headline-sm text-on-surface font-bold tracking-tight" id="browse-catalog-title">
                الاطلاع على المزيد من المواد
              </h2>
            </div>
            <p className="text-sm text-on-surface-variant">
              استكشف المواد المتاحة وفق مناهج وزارة التربية والتعليم - الفصل الدراسي الثاني.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button className="h-8 px-3.5 rounded-full text-xs font-bold bg-primary text-on-primary whitespace-nowrap cursor-pointer">
              الكل (12)
            </button>
            <button className="h-8 px-3.5 rounded-full text-xs font-medium bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap cursor-pointer">
              المرحلة الابتدائية
            </button>
            <button className="h-8 px-3.5 rounded-full text-xs font-medium bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap cursor-pointer">
              المرحلة الإعدادية
            </button>
            <button className="h-8 px-3.5 rounded-full text-xs font-medium bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap cursor-pointer">
              المرحلة الثانوية
            </button>
          </div>
        </div>

        {/* Catalog Grid: 6 Clean Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUBJECT_CATALOG.map((subj) => (
            <div
              key={subj.id}
              className="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">
                      {subj.icon}
                    </span>
                  </div>
                  <span className="text-xs text-on-surface-variant font-medium">
                    {subj.teachersCount} معلماً متاحاً
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-title text-on-surface font-bold group-hover:text-primary transition-colors">
                    {subj.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                    {subj.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {subj.tags.map((tag, idx) => (
                    <span key={idx} className="text-[11px] bg-surface-container-low px-2 py-0.5 rounded text-on-surface-variant">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab('teachers');
                }}
                className="w-full mt-5 inline-flex items-center justify-between bg-surface-container-low hover:bg-surface-container text-primary font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                <span>استعراض المعلمين</span>
                <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">
                  arrow_back
                </span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 4. GUARANTEE RIBBON & PRIMARY BOOKING CTA ================= */}
      <div className="bg-surface-container-low/70 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-on-surface">ضمان غايتي الأكاديمي للدروس</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              جميع معلمينا مجازون ومفحوصون جنائياً وأكاديمياً لضمان أعلى معايير الجودة لأبنائكم.
            </p>
          </div>
        </div>

        {/* PRIMARY ACTION: Accent Green for Booking a Lesson */}
        <button
          onClick={() => onOpenBookingModal()}
          className="bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          احجز حصة تجريبية الآن
        </button>
      </div>
    </main>
  );
};
