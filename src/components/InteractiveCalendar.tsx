import React, { useState } from 'react';
import { CalendarSession, Teacher, ActiveTab } from '../types';
import { CALENDAR_SESSIONS, TEACHERS_LIST } from '../data/mockData';

interface InteractiveCalendarProps {
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedTeacher: (teacher: Teacher) => void;
  onOpenBookingModal: (teacher?: Teacher) => void;
  onOpenClassroom?: (topic?: string, teacher?: string) => void;
  subjectFilter?: string;
  onSubjectFilterChange?: (filter: string) => void;
}

export const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  setActiveTab,
  setSelectedTeacher,
  onOpenBookingModal,
  onOpenClassroom,
  subjectFilter: externalSubjectFilter,
  onSubjectFilterChange
}) => {
  // Current calendar view state (Default March 2025, Day 16 selected - matching the app scenario)
  const [selectedDay, setSelectedDay] = useState<number>(16);
  const [internalSubjectFilter, setInternalSubjectFilter] = useState<string>('all');
  const subjectFilter = externalSubjectFilter ?? internalSubjectFilter;
  const setSubjectFilter = (sub: string) => {
    if (onSubjectFilterChange) {
      onSubjectFilterChange(sub);
    } else {
      setInternalSubjectFilter(sub);
    }
  };
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(2); // 2 = March (0-indexed: Jan=0, Feb=1, Mar=2)
  const currentYear = 2025;

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  // Arabic days starting with Saturday (السبت)
  const weekDays = [
    { key: 'sat', name: 'السبت', short: 'سبت' },
    { key: 'sun', name: 'الأحد', short: 'أحد' },
    { key: 'mon', name: 'الإثنين', short: 'إثنين' },
    { key: 'tue', name: 'الثلاثاء', short: 'ثلاثاء' },
    { key: 'wed', name: 'الأربعاء', short: 'أربعاء' },
    { key: 'thu', name: 'الخميس', short: 'خميس' },
    { key: 'fri', name: 'الجمعة', short: 'جمعة' },
  ];

  // March 2025 starts on Saturday (March 1, 2025 is Saturday! Exactly 0 leading padding days in Sat-Fri week!)
  // March has 31 days.
  const daysInMonth = 31;
  const startDayOffset = 0; // Saturday = 0 offset

  // Filter sessions by subject
  const filteredSessions = CALENDAR_SESSIONS.filter(session => {
    if (subjectFilter === 'all') return true;
    if (subjectFilter === 'math') return session.subject.includes('الرياضيات');
    if (subjectFilter === 'arabic') return session.subject.includes('العربية');
    if (subjectFilter === 'science') return session.subject.includes('العلوم');
    return true;
  });

  // Get sessions for a specific day
  const getSessionsForDay = (day: number) => {
    return filteredSessions.filter(s => s.dayNumber === day);
  };

  // Sessions for currently selected day
  const selectedDaySessions = getSessionsForDay(selectedDay);

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonthIndex(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex < 11) {
      setCurrentMonthIndex(prev => prev + 1);
    }
  };

  const handleGoToToday = () => {
    setCurrentMonthIndex(2); // March
    setSelectedDay(16);
  };

  // Days of the current active week (for week view): Day 15 (Sat) to Day 21 (Fri)
  const weekViewDays = [15, 16, 17, 18, 19, 20, 21];

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-space-lg shadow-sm space-y-space-lg">
      {/* Calendar Header & Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border-b border-outline-variant pb-space-md">
        {/* Title & Month Picker */}
        <div className="flex items-center gap-space-md flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-2xl">calendar_month</span>
            </div>
            <div>
              <h3 className="text-title font-title text-on-surface font-bold flex items-center gap-2">
                <span>جدول الحصص ومواعيد البث المباشر</span>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold">
                  {filteredSessions.length} حصص هذا الشهر
                </span>
              </h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                تتبع مواعيد دروسك التفاعلية واختبارات التقييم الشهرية
              </p>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-outline-variant/60">
            <button
              onClick={handleNextMonth}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
              title="الشهر القادم"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
            <span className="font-title text-body-md font-bold px-3 text-on-surface min-w-[110px] text-center">
              {monthNames[currentMonthIndex]} {currentYear}
            </span>
            <button
              onClick={handlePrevMonth}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
              title="الشهر السابق"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button
              onClick={handleGoToToday}
              className="px-2.5 py-1 text-label-sm font-bold bg-surface-container-lowest border border-outline-variant rounded-lg text-primary hover:bg-primary hover:text-on-primary transition-all cursor-pointer mr-1"
            >
              اليوم
            </button>
          </div>
        </div>

        {/* View Mode & Subject Filters */}
        <div className="flex flex-wrap items-center gap-space-sm">
          {/* Subject Filter Pills */}
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/60">
            <button
              onClick={() => setSubjectFilter('all')}
              className={`px-3 py-1 rounded-lg text-label-sm font-bold transition-all cursor-pointer ${
                subjectFilter === 'all'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              الكل ({CALENDAR_SESSIONS.length})
            </button>
            <button
              onClick={() => setSubjectFilter('math')}
              className={`px-3 py-1 rounded-lg text-label-sm font-bold transition-all cursor-pointer flex items-center gap-1 ${
                subjectFilter === 'math'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>الرياضيات</span>
            </button>
            <button
              onClick={() => setSubjectFilter('arabic')}
              className={`px-3 py-1 rounded-lg text-label-sm font-bold transition-all cursor-pointer flex items-center gap-1 ${
                subjectFilter === 'arabic'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>اللغة العربية</span>
            </button>
            <button
              onClick={() => setSubjectFilter('science')}
              className={`px-3 py-1 rounded-lg text-label-sm font-bold transition-all cursor-pointer flex items-center gap-1 ${
                subjectFilter === 'science'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              <span>العلوم</span>
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/60">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg text-label-sm font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/50'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="عرض التقويم الشهري"
            >
              <span className="material-symbols-outlined text-base">calendar_view_month</span>
              <span>شهري</span>
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg text-label-sm font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/50'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="عرض الجدول الأسبوعي"
            >
              <span className="material-symbols-outlined text-base">calendar_view_week</span>
              <span>أسبوعي</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Calendar Body: Grid + Selected Day Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Calendar Visual Matrix (8 Cols on desktop) */}
        <div className="lg:col-span-8 bg-surface-container-low/40 rounded-2xl p-space-md border border-outline-variant/60">
          {viewMode === 'month' ? (
            /* ================= MONTHLY GRID VIEW ================= */
            <div>
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1.5 mb-2 text-center">
                {weekDays.map(day => (
                  <div key={day.key} className="py-2 text-label-sm font-bold text-on-surface-variant bg-surface-container-lowest rounded-lg border border-outline-variant/40">
                    <span className="hidden sm:inline">{day.name}</span>
                    <span className="sm:hidden">{day.short}</span>
                  </div>
                ))}
              </div>

              {/* Month Days Grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {/* Empty cells if month starts on later day */}
                {Array.from({ length: startDayOffset }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-16 md:h-20 rounded-xl bg-surface-container-lowest/30 border border-dashed border-outline-variant/30 opacity-40"></div>
                ))}

                {/* Day Cells 1 to 31 */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNumber = idx + 1;
                  const daySessions = getSessionsForDay(dayNumber);
                  const isToday = dayNumber === 16;
                  const isSelected = dayNumber === selectedDay;
                  const hasSessions = daySessions.length > 0;

                  return (
                    <button
                      key={dayNumber}
                      onClick={() => setSelectedDay(dayNumber)}
                      className={`h-16 md:h-20 p-1.5 rounded-xl border transition-all text-right flex flex-col justify-between cursor-pointer relative group ${
                        isSelected
                          ? 'bg-surface-container-lowest border-primary ring-2 ring-primary/40 shadow-sm'
                          : isToday
                          ? 'bg-primary/5 border-primary/40'
                          : hasSessions
                          ? 'bg-surface-container-lowest border-outline-variant hover:border-primary/60 hover:shadow-xs'
                          : 'bg-surface-container-lowest/70 border-outline-variant/40 hover:bg-surface-container-lowest'
                      }`}
                    >
                      {/* Day Number Header */}
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-label-sm font-bold ${
                            isToday
                              ? 'bg-primary text-on-primary shadow-xs'
                              : isSelected
                              ? 'bg-surface-container-highest text-primary font-bold'
                              : 'text-on-surface'
                          }`}
                        >
                          {dayNumber}
                        </span>

                        {isToday && (
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.2 rounded hidden md:inline">
                            اليوم
                          </span>
                        )}

                        {daySessions.length > 1 && (
                          <span className="w-4 h-4 rounded-full bg-surface-container-high text-on-surface text-[10px] font-bold flex items-center justify-center">
                            {daySessions.length}
                          </span>
                        )}
                      </div>

                      {/* Session Badges / Dots */}
                      <div className="w-full space-y-1 mt-1 overflow-hidden">
                        {daySessions.slice(0, 2).map((ses) => (
                          <div
                            key={ses.id}
                            className={`text-[10px] truncate px-1.5 py-0.5 rounded font-semibold flex items-center gap-1 ${
                              ses.subject.includes('الرياضيات')
                                ? 'bg-blue-100 text-blue-900'
                                : ses.subject.includes('العربية')
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-purple-100 text-purple-900'
                            }`}
                            title={`${ses.subject}: ${ses.time}`}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: ses.accentColor }}
                            ></span>
                            <span className="truncate hidden md:inline">{ses.subject.split(':')[0]}</span>
                            <span className="md:hidden text-[9px]">{ses.time.split(' - ')[0]}</span>
                          </div>
                        ))}
                        {daySessions.length > 2 && (
                          <span className="text-[9px] text-outline block text-center">
                            +{daySessions.length - 2} المزيد
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ================= WEEKLY TIMELINE VIEW ================= */
            <div className="space-y-3">
              <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/60 flex items-center justify-between text-body-sm">
                <span className="font-bold text-on-surface">الأسبوع الثالث: من السبت ١٥ إلى الجمعة ٢١ مارس ٢٠٢٥</span>
                <span className="text-primary font-bold text-xs bg-primary/10 px-2.5 py-1 rounded-full">الأسبوع الجاري</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {weekViewDays.map((dayNum) => {
                  const daySessions = getSessionsForDay(dayNum);
                  const isToday = dayNum === 16;
                  const isSelected = dayNum === selectedDay;
                  // Map day number to day name
                  const dayInfo = weekDays[(dayNum - 1) % 7];

                  return (
                    <div
                      key={dayNum}
                      onClick={() => setSelectedDay(dayNum)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-surface-container-lowest border-primary ring-2 ring-primary/30 shadow-xs'
                          : isToday
                          ? 'bg-primary/5 border-primary/40'
                          : 'bg-surface-container-lowest border-outline-variant/60 hover:border-outline'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        {/* Day indicator */}
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-bold ${
                            isToday ? 'bg-primary text-on-primary' : isSelected ? 'bg-surface-container-highest text-primary' : 'bg-surface-container-low text-on-surface'
                          }`}>
                            <span className="text-xs">{dayInfo.short}</span>
                            <span className="text-sm leading-none">{dayNum}</span>
                          </div>
                          <div>
                            <span className="font-title font-bold text-on-surface text-body-md">
                              {dayInfo.name}، {dayNum} مارس ٢٠٢٥
                            </span>
                            {isToday && (
                              <span className="mr-2 text-label-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                اليوم
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Sessions for this day */}
                        <div className="flex-1 sm:mr-4">
                          {daySessions.length > 0 ? (
                            <div className="flex flex-wrap items-center gap-2">
                              {daySessions.map((ses) => (
                                <div
                                  key={ses.id}
                                  className={`px-3 py-1.5 rounded-lg border text-label-sm font-semibold flex items-center gap-2 ${ses.subjectBadgeColor}`}
                                >
                                  <span className="material-symbols-outlined text-sm">schedule</span>
                                  <span>{ses.time}</span>
                                  <span>•</span>
                                  <strong>{ses.subject.split(':')[0]}</strong>
                                  <span className="text-xs text-on-surface-variant">({ses.teacherName.split(' ')[1]})</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-body-sm text-outline">لا توجد حصص مجدولة</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Calendar Color Legend */}
          <div className="mt-4 pt-3 border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-3 text-label-sm font-label-sm text-on-surface-variant">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-700"></span>
                <span>الرياضيات</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span>
                <span>اللغة العربية</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-700"></span>
                <span>العلوم</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <span>اليوم الحالي</span>
              </span>
            </div>

            <span className="text-outline text-xs">
              * اضغط على أي يوم لعرض تفاصيل الحصص وروابط الدخول المباشر
            </span>
          </div>
        </div>

        {/* Selected Day Detail Inspector (4 Cols on desktop) */}
        <div className="lg:col-span-4 flex flex-col space-y-space-md">
          {/* Inspector Header */}
          <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/60 flex items-center justify-between">
            <div>
              <span className="text-label-sm text-outline block">تفاصيل اليوم المحدد:</span>
              <h4 className="text-title font-title text-on-surface font-bold">
                الأحد، {selectedDay} مارس ٢٠٢٥
              </h4>
            </div>
            <div className="w-9 h-9 rounded-xl bg-surface-container-lowest border border-outline-variant flex items-center justify-center font-bold text-primary">
              {selectedDay}
            </div>
          </div>

          {/* Selected Day Sessions Cards List */}
          {selectedDaySessions.length > 0 ? (
            <div className="space-y-3">
              {selectedDaySessions.map((ses) => (
                <div
                  key={ses.id}
                  className="bg-surface-container-lowest border border-outline-variant hover:border-primary rounded-xl p-4 shadow-xs transition-all space-y-3"
                >
                  {/* Top Type & Status */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-label-sm font-bold border ${ses.subjectBadgeColor}`}>
                      {ses.subject}
                    </span>

                    {ses.status === 'in_progress' ? (
                      <span className="inline-flex items-center gap-1 text-label-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                        <span>مباشر الآن</span>
                      </span>
                    ) : ses.type === 'trial' ? (
                      <span className="text-label-sm font-bold text-on-surface bg-surface-container-high px-2 py-0.5 rounded-full">
                        حصة تجريبية مجانية
                      </span>
                    ) : ses.type === 'exam' ? (
                      <span className="text-label-sm font-bold text-on-surface bg-surface-container-high px-2 py-0.5 rounded-full">
                        اختبار دوري
                      </span>
                    ) : (
                      <span className="text-label-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        حصة دورية
                      </span>
                    )}
                  </div>

                  {/* Lesson Topic */}
                  <div>
                    <h5 className="font-title text-body-md font-bold text-on-surface leading-snug">
                      {ses.topic}
                    </h5>
                  </div>

                  {/* Teacher & Time Info */}
                  <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/40">
                    <img
                      src={ses.teacherAvatar}
                      alt={ses.teacherName}
                      className="w-10 h-10 rounded-full object-cover border border-outline-variant"
                    />
                    <div className="flex-1">
                      <p className="font-title text-body-sm font-bold text-on-surface">{ses.teacherName}</p>
                      <p className="text-label-sm text-outline flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        <span>{ses.time}</span>
                      </p>
                    </div>
                  </div>

                  {/* Room Status */}
                  <div className="bg-surface-container-low px-3 py-1.5 rounded-lg text-label-sm font-semibold text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-primary">videocam</span>
                    <span className="truncate">{ses.meetingRoom}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    {ses.status === 'in_progress' ? (
                      <button
                        onClick={() => {
                          if (onOpenClassroom) {
                            onOpenClassroom(ses.subject, ses.teacherName);
                          } else {
                            alert('مرحباً بك! جاري الاتصال بالقاعة الافتراضية عالية الجودة...');
                          }
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-title text-label-md font-bold shadow-xs flex items-center justify-center gap-1 transition-transform active:scale-95 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">
                          video_camera_front
                        </span>
                        <span>دخول القاعة الآن</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (ses.subject.includes('العربية')) {
                            const ibrahim = TEACHERS_LIST.find(t => t.id === 'ibrahim-desouky');
                            if (ibrahim) setSelectedTeacher(ibrahim);
                            setActiveTab('teacher_profile');
                          } else {
                            setActiveTab('booking_confirmed');
                          }
                        }}
                        className="flex-1 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-title text-label-md font-bold border border-outline-variant/60 transition-colors text-center cursor-pointer"
                      >
                        تفاصيل ومذكرة الدرس
                      </button>
                    )}

                    {ses.subject.includes('الرياضيات') && (
                      <button
                        onClick={() => setActiveTab('reports')}
                        className="p-2 rounded-xl border border-outline-variant hover:border-primary text-primary transition-colors cursor-pointer"
                        title="عرض تقرير أداء المادة"
                      >
                        <span className="material-symbols-outlined text-lg">insights</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State for Day with No Sessions */
            <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-surface-container mx-auto flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-2xl">event_busy</span>
              </div>
              <h5 className="font-title text-body-md font-bold text-on-surface">لا توجد حصص مجدولة لهذا اليوم</h5>
              <p className="text-body-sm font-body-sm text-outline leading-relaxed">
                هذا اليوم متاح للاستذكار والمراجعة الذاتية، أو لحجز حصة تقوية جديدة.
              </p>
              <button
                onClick={() => onOpenBookingModal()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary font-title text-label-md font-bold hover:bg-primary-container shadow-xs transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">add_circle</span>
                <span>حجز حصة تجريبية</span>
              </button>
            </div>
          )}

          {/* Quick Calendar Tools Box */}
          <div className="bg-surface-container-low rounded-xl p-3.5 border border-outline-variant/50 space-y-2 text-body-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-base">sync</span>
                <span>مزامنة التقويم</span>
              </span>
              <button
                onClick={() => alert('تم تجهيز رابط المزامنة مع تقويم Google و Apple Calendar بنجاح!')}
                className="text-primary text-label-sm font-bold hover:underline cursor-pointer"
              >
                تصدير (iCal)
              </button>
            </div>
            <p className="text-outline text-xs leading-normal">
              اربط مواعيد فصولك الدراسية مع تقويم هاتفك لتصلك إشعارات وتنبيهات فورية قبل كل درس.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
