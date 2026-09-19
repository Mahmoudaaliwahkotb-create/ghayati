import React, { useState, useEffect, useCallback } from 'react';
import { ActiveTab, Teacher } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { fetchApprovedTeachers } from '../lib/supabase';

interface TeachersDirectoryViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedTeacher: (teacher: Teacher) => void;
  onOpenBookingModal: (teacher?: Teacher) => void;
}

export const TeachersDirectoryView: React.FC<TeachersDirectoryViewProps> = ({
  setActiveTab,
  setSelectedTeacher,
  onOpenBookingModal
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('highest_rated');
  const [teachersList, setTeachersList] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadTeachers = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // Live query to the Supabase "teachers" table
      const data = await fetchApprovedTeachers();
      // Strictly only show teachers where status = 'approved', never 'pending'
      const approvedOnly = (data || []).filter((t) => t.status === 'approved');
      setTeachersList(approvedOnly);
    } catch (err: any) {
      console.error('Error fetching teachers from Supabase:', err);
      setErrorMsg('تعذر الاتصال بقاعدة بيانات Supabase لجلب المعلمين.');
      setTeachersList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  const daysList = [
    { label: 'جميع الأيام', value: 'all' },
    { label: 'السبت', value: 'السبت' },
    { label: 'الأحد', value: 'الأحد' },
    { label: 'الإثنين', value: 'الإثنين' },
    { label: 'الثلاثاء', value: 'الثلاثاء' },
    { label: 'الأربعاء', value: 'الأربعاء' },
    { label: 'الخميس', value: 'الخميس' },
    { label: 'الجمعة', value: 'الجمعة' }
  ];

  // Strictly filter out any pending teachers - only show status === 'approved'
  const filteredTeachers = teachersList.filter((teacher) => {
    // Explicit safety condition: Do not show teachers with status "pending"
    if (teacher.status !== 'approved') return false;
    if (selectedDay === 'all') return true;
    return teacher.scheduleDays?.includes(selectedDay);
  }).sort((a, b) => {
    if (sortBy === 'highest_rated') return b.rating - a.rating;
    if (sortBy === 'price_asc') return a.monthlyPrice - b.monthlyPrice;
    if (sortBy === 'price_desc') return b.monthlyPrice - a.monthlyPrice;
    if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
    return 0;
  });

  return (
    <div className="w-full text-right">
      {/* Unified Breadcrumbs Navigation */}
      <Breadcrumbs
        onBack={() => setActiveTab('classes')}
        backLabel="العودة لشاشة فصولي"
        items={[
          {
            label: 'فصولي (الرئيسية)',
            icon: 'home',
            onClick: () => setActiveTab('classes')
          },
          {
            label: 'دليل المعلمين المعتمدين',
            isCurrent: true
          }
        ]}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-margin py-space-lg flex flex-col gap-space-xl text-right">

        {/* HERO / SUBJECT BANNER */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-space-lg md:p-space-xl shadow-sm relative overflow-hidden">
          {/* Decorative Backdrop Geometry */}
          <div className="absolute -left-12 -top-12 w-64 h-64 rounded-full bg-surface-container opacity-40 blur-3xl pointer-events-none"></div>
          <div className="absolute right-1/3 -bottom-16 w-80 h-32 rounded-full bg-secondary-fixed opacity-30 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
            <div className="flex items-start md:items-center gap-space-md">
              {/* Subject Icon Box */}
              <div className="w-16 h-16 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-tertiary shadow-inner shrink-0">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  school
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-space-sm flex-wrap">
                  <h1 className="text-headline-lg font-headline-lg text-on-surface font-bold tracking-tight">
                    دليل المعلمين المعتمدين
                  </h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-label-sm font-label-sm bg-secondary-fixed text-on-secondary-fixed font-bold">
                    قاعدة بيانات Supabase المباشرة
                  </span>
                </div>
                <p className="text-body-md font-body-md text-on-surface-variant flex items-center gap-2 flex-wrap pt-0.5">
                  <span>المعلمون المعتمدون رسمياً لدى المنصة</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-outline"></span>
                  <span>فصول افتراضية تفاعلية مباشرة</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-outline"></span>
                  <span className="text-primary font-medium">مراجعة أمنية وتربوية شاملة</span>
                </p>
              </div>
            </div>

            {/* Quick Summary Counter Pill & Register CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm self-start md:self-auto shrink-0">
              <div className="flex items-center gap-space-md bg-surface-container-low border border-surface-variant px-space-md py-space-sm rounded-xl">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  <span className="font-title text-title text-on-surface">
                    {isLoading ? '...' : `${teachersList.length} معلماً معتمداً`}
                  </span>
                </div>
                <div className="w-px h-6 bg-outline-variant"></div>
                <div className="flex items-center gap-1 text-tertiary">
                  <span className="material-symbols-outlined text-amber-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="font-title text-title text-on-surface">4.9 / 5</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('teacher_register')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-on-primary text-label-md font-bold shadow-sm hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">how_to_reg</span>
                <span>تسجيل كمعلم جديد</span>
              </button>
            </div>
          </div>
        </section>

        {/* FILTER BAR & DAY SELECTOR */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-space-md md:p-space-lg shadow-sm flex flex-col gap-space-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            {/* Label & Days Rail */}
            <div className="flex flex-col md:flex-row md:items-center gap-space-md">
              <div className="flex items-center gap-2 text-on-surface font-title text-body-lg shrink-0">
                <span className="material-symbols-outlined text-primary text-xl">calendar_month</span>
                <span>تصفية حسب الأيام المتاحة:</span>
              </div>

              {/* Day Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 md:pb-0 no-scrollbar">
                {daysList.map((day) => {
                  const isActive = selectedDay === day.value;
                  return (
                    <button
                      key={day.value}
                      onClick={() => setSelectedDay(day.value)}
                      className={`h-9 px-4 rounded-full text-label-md font-label-md transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-primary text-on-primary font-bold shadow-sm'
                          : 'border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary hover:text-primary'
                      }`}
                    >
                      {isActive && <span className="material-symbols-outlined text-base">check</span>}
                      <span>{day.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Secondary Sorting Dropdown & Refresh Button */}
            <div className="flex items-center gap-space-sm self-end lg:self-auto shrink-0">
              <button
                onClick={loadTeachers}
                disabled={isLoading}
                title="تحديث البيانات من Supabase"
                className="h-9 px-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary hover:text-primary text-label-md font-label-md flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-base ${isLoading ? 'animate-spin' : ''}`}>refresh</span>
                <span className="hidden sm:inline">تحديث</span>
              </button>

              <span className="text-label-md font-label-md text-on-surface-variant hidden sm:inline">ترتيب:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none h-9 pr-8 pl-8 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-label-md font-label-md focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer text-right"
                >
                  <option value="highest_rated">الأعلى تقييماً</option>
                  <option value="price_asc">السعر: من الأقل للأعلى</option>
                  <option value="price_desc">السعر: من الأعلى للأقل</option>
                  <option value="experience">الأكثر خبرة</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-2 text-outline pointer-events-none text-lg">sort</span>
                <span className="material-symbols-outlined absolute left-2 top-2 text-outline pointer-events-none text-base">expand_more</span>
              </div>
            </div>
          </div>
        </section>

        {/* ERROR STATE */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-error-container text-on-error-container flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">error</span>
              <span className="text-body-sm font-semibold">{errorMsg}</span>
            </div>
            <button
              onClick={loadTeachers}
              className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-bold text-label-sm hover:bg-surface-container transition-all cursor-pointer"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* LOADING STATE - PULSE SKELETONS */}
        {isLoading && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-center gap-3 py-8 text-primary">
              <span className="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
              <span className="text-title font-bold">جارٍ جلب المعلمين المعتمدين من قاعدة بيانات Supabase...</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-space-lg shadow-sm flex flex-col justify-between animate-pulse"
                >
                  <div>
                    <div className="flex items-center justify-between pb-space-md border-b border-surface-container">
                      <div className="h-6 w-24 bg-surface-container rounded-md"></div>
                      <div className="h-5 w-16 bg-surface-container rounded-full"></div>
                    </div>
                    <div className="flex items-start gap-space-md pt-space-md">
                      <div className="w-16 h-16 rounded-2xl bg-surface-container shrink-0"></div>
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="h-5 w-32 bg-surface-container rounded"></div>
                        <div className="h-4 w-24 bg-surface-container rounded"></div>
                        <div className="h-3 w-40 bg-surface-container rounded"></div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <div className="h-6 w-20 bg-surface-container rounded-lg"></div>
                      <div className="h-6 w-20 bg-surface-container rounded-lg"></div>
                    </div>
                    <div className="mt-4 h-12 bg-surface-container rounded-xl"></div>
                  </div>
                  <div className="mt-6 flex flex-col gap-2">
                    <div className="h-10 bg-surface-container rounded-xl"></div>
                    <div className="h-9 bg-surface-container rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EMPTY STATE - NO TEACHERS FOUND */}
        {!isLoading && filteredTeachers.length === 0 && (
          <section className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-2xl p-space-xl flex flex-col items-center justify-center text-center gap-space-md py-16 shadow-xs">
            <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-outline">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">person_off</span>
            </div>
            <div className="flex flex-col gap-1.5 max-w-md">
              <h3 className="text-headline-sm font-headline-sm font-bold text-on-surface">
                لا يوجد معلمون متاحون حاليًا
              </h3>
              <p className="text-body-md font-body-md text-on-surface-variant">
                {selectedDay !== 'all'
                  ? `لا يوجد معلمون معتمدون متاحون لجدول يوم (${selectedDay}). يمكنك اختيار يوم آخر أو عرض جميع الأيام.`
                  : 'لم يتم العثور على أي معلمين معتمدين (status = approved) في جدول teachers بقاعدة البيانات حاليًا.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              {selectedDay !== 'all' && (
                <button
                  onClick={() => setSelectedDay('all')}
                  className="px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low text-body-sm font-bold transition-all cursor-pointer"
                >
                  عرض جميع الأيام
                </button>
              )}
              <button
                onClick={loadTeachers}
                className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high text-body-sm font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">refresh</span>
                <span>تحديث البيانات من Supabase</span>
              </button>
              <button
                onClick={() => setActiveTab('teacher_register')}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-body-sm font-bold hover:bg-primary/90 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">how_to_reg</span>
                <span>تسجيل كمعلم جديد</span>
              </button>
            </div>
          </section>
        )}

        {/* TEACHER DIRECTORY CATALOG GRID */}
        {!isLoading && filteredTeachers.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {filteredTeachers.map((teacher) => (
              <article
                key={teacher.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-space-lg shadow-sm hover:shadow-md hover:border-outline transition-all duration-200 flex flex-col justify-between relative group"
              >
                <div>
                  {/* Top Row: Price & Discount Pill */}
                  <div className="flex items-center justify-between pb-space-md border-b border-surface-container">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-headline-sm font-headline-sm text-primary font-bold">{teacher.monthlyPrice}</span>
                      <span className="text-body-sm font-body-sm text-on-surface-variant">ج.م / شهرياً</span>
                      {teacher.originalPrice > teacher.monthlyPrice && (
                        <span className="text-label-sm font-label-sm line-through text-outline mr-1">{teacher.originalPrice} ج.م</span>
                      )}
                    </div>
                    {teacher.discountPercentage > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label-sm bg-secondary-fixed text-on-secondary-fixed font-bold">
                        -{teacher.discountPercentage}% خصم
                      </span>
                    )}
                  </div>

                  {/* Teacher Profile Info Row */}
                  <div className="flex items-start gap-space-md pt-space-md">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-outline-variant shadow-sm bg-surface-container">
                        <img
                          src={teacher.avatar}
                          alt={teacher.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).setAttribute(
                              'src',
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
                            );
                          }}
                        />
                      </div>
                      {teacher.isOnline && (
                        <span className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-secondary border-2 border-surface-container-lowest" title="متصل الآن"></span>
                      )}
                    </div>

                    <div className="flex flex-col gap-0.5 text-right flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h2
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setActiveTab('teacher_profile');
                          }}
                          className="text-title font-title text-on-surface font-bold hover:text-primary transition-colors cursor-pointer truncate"
                        >
                          {teacher.name}
                        </h2>
                        {teacher.isVerified && (
                          <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }} title="معلم معتمد ومفحوص أمنياً">
                            verified
                          </span>
                        )}
                      </div>
                      <span className="text-label-md font-label-md text-primary font-semibold">{teacher.title}</span>
                      <span className="text-label-sm font-label-sm text-on-surface-variant truncate">{teacher.school}</span>
                    </div>
                  </div>

                  {/* Badges Micro-Grid */}
                  <div className="flex flex-wrap gap-1.5 pt-space-md">
                    {teacher.badges && teacher.badges.map((badge, bIdx) => (
                      <span key={bIdx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-label-sm font-label-sm bg-surface-container-low text-on-surface-variant border border-surface-variant">
                        <span className="material-symbols-outlined text-xs text-primary">school</span>
                        <span>{badge}</span>
                      </span>
                    ))}
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-label-sm font-label-sm bg-primary/10 text-primary font-semibold">
                      <span className="material-symbols-outlined text-xs">grade</span>
                      <span>خبرة {teacher.experienceYears} سنوات</span>
                    </span>
                  </div>

                  {/* Parent Satisfaction & Rating */}
                  <div className="flex items-center gap-1.5 pt-space-sm text-body-sm font-body-sm">
                    <div className="flex items-center text-amber-500">
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-bold text-on-surface mr-1">{teacher.rating}</span>
                    </div>
                    <span className="text-on-surface-variant text-label-sm font-label-sm">
                      • 98% رضاء أولياء الأمور ({teacher.reviewsCount || 1} تقييم)
                    </span>
                  </div>

                  {/* Teacher Bio / نبذة تعريفية من قاعدة البيانات */}
                  {teacher.bio && (
                    <div className="mt-space-sm p-space-sm rounded-xl bg-surface-container-low/80 border border-surface-container flex items-start gap-2 text-body-sm text-on-surface-variant leading-relaxed">
                      <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">format_quote</span>
                      <p className="line-clamp-2 text-right flex-1 text-on-surface text-body-sm" title={teacher.bio}>
                        {teacher.bio}
                      </p>
                    </div>
                  )}

                  {/* Schedule Line */}
                  <div className="mt-space-md p-space-sm rounded-xl bg-surface-container-low border border-surface-container flex items-center gap-2 text-body-sm font-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-primary text-lg">event_available</span>
                    <div className="flex flex-col">
                      <span className="font-bold">{teacher.scheduleDays} • {teacher.scheduleTime}</span>
                      <span className="text-label-sm font-label-sm text-on-surface-variant">{teacher.groupSize}</span>
                    </div>
                  </div>

                  {/* Remaining Seats Indicator */}
                  <div className="flex items-center justify-between pt-space-sm">
                    <span className="inline-flex items-center gap-1 text-label-sm font-label-sm px-2.5 py-1 rounded-md bg-error-container text-on-error-container font-bold">
                      <span className="material-symbols-outlined text-xs">group</span>
                      <span>متبقي {teacher.remainingSeats} مقاعد فقط ({teacher.remainingSeats}/{teacher.totalSeats})</span>
                    </span>
                    <span className="text-label-sm font-label-sm text-secondary font-medium flex items-center gap-0.5">
                      <span className="w-2 h-2 rounded-full bg-secondary inline-block animate-pulse"></span>
                      <span>{teacher.nextLessonText}</span>
                    </span>
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="flex flex-col gap-2 pt-space-lg">
                  <button
                    onClick={() => onOpenBookingModal(teacher)}
                    className="w-full h-11 rounded-xl bg-secondary hover:bg-on-secondary-container text-on-secondary font-title text-body-md font-bold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xl">play_lesson</span>
                    <span>سجل مجاناً (حصة تجريبية)</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTeacher(teacher);
                      setActiveTab('teacher_profile');
                    }}
                    className="w-full h-10 rounded-xl border border-primary text-primary hover:bg-surface-container-low font-title text-body-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>تفاصيل المنهج والمعلم</span>
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* DIRECTORY PAGINATION (shown when results exist) */}
        {!isLoading && filteredTeachers.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-md pb-space-lg">
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              عرض {filteredTeachers.length} من إجمالي {teachersList.length} معلماً معتمداً
            </p>
            <div className="flex items-center gap-2">
              <button className="h-10 px-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary hover:text-primary transition-all flex items-center gap-1 text-label-md font-label-md disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-base">chevron_right</span>
                السابق
              </button>
              <div className="flex items-center gap-1">
                <button className="w-10 h-10 rounded-xl bg-primary text-on-primary font-title text-body-sm font-bold">1</button>
              </div>
              <button className="h-10 px-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary hover:text-primary transition-all flex items-center gap-1 text-label-md font-label-md disabled:opacity-50" disabled>
                التالي
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </button>
            </div>
          </div>
        )}

        {/* TEACHER INVITATION / RECRUITMENT BANNER */}
        <section className="bg-surface-container-lowest border border-primary/20 rounded-2xl p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-lg shadow-sm">
          <div className="flex items-center gap-space-md">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-3xl">school</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-title font-title text-on-surface font-bold">
                هل أنت معلم متميز وترغب في التدريس عبر منصة غايتي؟
              </h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                انضم إلى آلاف المعلمين المؤهلين، حدد أسعارك وجدولك التدريسي الخاص، وابدأ استقبال الطلاب فور اعتماد ومراجعة طلبك.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-md shrink-0">
            <button
              onClick={() => setActiveTab('teacher_register')}
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-title text-body-sm font-bold hover:bg-primary/90 active:scale-95 shadow transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-lg">how_to_reg</span>
              <span>تقديم طلب انضمام كمعلم</span>
            </button>
          </div>
        </section>

        {/* TRUST & PARENT GUARANTEE BANNER */}
        <section className="bg-surface-container-low border border-surface-variant rounded-2xl p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-lg">
          <div className="flex items-center gap-space-md">
            <div className="w-14 h-14 rounded-2xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-title font-title text-on-surface font-bold">
                ضمان غايتي للتميز والأمان التعليمي لأولياء الأمور
              </h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                جميع المعلمين تم التحقق من هوياتهم وسجلاتهم الجنائية واعتماد مؤهلاتهم التربوية رسمياً • إمكانية استبدال المعلم أو استرجاع الرسوم بالكامل في أي وقت.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-md shrink-0">
            <button
              onClick={() => onOpenBookingModal()}
              className="px-space-md py-2.5 rounded-xl border border-primary text-primary font-title text-body-sm font-bold hover:bg-surface-container transition-all cursor-pointer"
            >
              احجز حصة مجانية الآن
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
