import React, { useState } from 'react';
import { ActiveTab, Teacher } from '../types';
import { TEACHERS_LIST } from '../data/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface TeacherProfileViewProps {
  teacher: Teacher | null;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenBookingModal: (teacher?: Teacher) => void;
  previousTab?: ActiveTab;
}

export const TeacherProfileView: React.FC<TeacherProfileViewProps> = ({
  teacher,
  setActiveTab,
  onOpenBookingModal,
  previousTab
}) => {
  const currentTeacher = teacher || TEACHERS_LIST[0];
  const [activeProfileTab, setActiveProfileTab] = useState<'methodology' | 'curriculum' | 'schedule' | 'reviews'>('methodology');
  const [selectedGroup, setSelectedGroup] = useState<'A' | 'B' | 'C'>('A');

  const handleBack = () => {
    if (previousTab) {
      setActiveTab(previousTab);
    } else {
      setActiveTab('teachers');
    }
  };

  return (
    <div className="w-full text-right">
      {/* Breadcrumb Trail & Quick Back Navigation */}
      <Breadcrumbs
        onBack={handleBack}
        backLabel="العودة لقائمة المعلمين"
        items={[
          {
            label: 'فصولي (الرئيسية)',
            icon: 'home',
            onClick: () => setActiveTab('classes')
          },
          {
            label: 'دليل المعلمين',
            onClick: () => setActiveTab('teachers')
          },
          {
            label: currentTeacher.subject,
            onClick: () => setActiveTab('teachers')
          },
          {
            label: `${currentTeacher.name} (${currentTeacher.title})`,
            isCurrent: true
          }
        ]}
      />

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-margin py-space-xl flex-grow w-full">
        {/* Top Grid: Hero Profile + Sticky Booking Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Left Column (8 cols): Teacher Hero Details & Badges */}
          <section className="lg:col-span-8 flex flex-col gap-space-lg">
            {/* Teacher Profile Card */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/70 p-space-lg md:p-space-xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-surface-container-low rounded-bl-full pointer-events-none -z-0"></div>

              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-space-lg pb-space-lg border-b border-outline-variant/50">
                {/* Avatar with Verified Ring */}
                <div className="relative shrink-0">
                  <img
                    src={currentTeacher.avatar}
                    alt={currentTeacher.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-primary-fixed shadow-md"
                  />
                  <div className="absolute -bottom-2 -left-2 bg-primary text-on-primary rounded-full p-1.5 shadow" title="معلم موثق">
                    <span className="material-symbols-outlined text-body-md block" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                  </div>
                </div>

                {/* Titles and Subject Info */}
                <div className="flex-grow space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-primary font-label-md text-label-md font-semibold">
                      <span className="material-symbols-outlined text-label-sm">school</span>
                      <span>{currentTeacher.subject}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-md text-label-md font-semibold">
                      <span className="material-symbols-outlined text-label-sm">workspace_premium</span>
                      <span>معلم معتمد رسمياً</span>
                    </span>
                  </div>

                  <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface font-bold">
                    {currentTeacher.name}
                  </h1>

                  <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl">
                    كبير معلمي اللغة العربية والنحو بمدرسة السعيدية الثانوية (سابقاً) ومؤلف سلسلة «الفرسان في تبسيط القواعد النحوية والبلاغة».
                  </p>

                  {/* Education Qualification */}
                  <div className="flex items-center gap-2 text-body-sm font-body-sm text-outline pt-1">
                    <span className="material-symbols-outlined text-body-md text-primary">history_edu</span>
                    <span>مؤهل تربوي معتمد: ماجستير مناهج وطرق تدريس اللغة العربية - كلية التربية جامعة عين شمس</span>
                  </div>
                </div>
              </div>

              {/* Credential Stats Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md pt-space-lg">
                <div className="p-space-md rounded-xl bg-surface border border-outline-variant/50 text-center">
                  <div className="flex items-center justify-center gap-1 text-title font-title text-on-surface">
                    <span>{currentTeacher.rating}</span>
                    <span className="material-symbols-outlined text-title text-[#d97706]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  </div>
                  <p className="text-label-sm font-label-sm text-on-surface-variant mt-0.5">{currentTeacher.reviewsCount} تقييم حقيقي</p>
                </div>

                <div className="p-space-md rounded-xl bg-surface border border-outline-variant/50 text-center">
                  <div className="text-title font-title text-primary font-bold">{currentTeacher.experienceYears} سنة</div>
                  <p className="text-label-sm font-label-sm text-on-surface-variant mt-0.5">خبرة بالمدارس الرسمية</p>
                </div>

                <div className="p-space-md rounded-xl bg-surface border border-outline-variant/50 text-center">
                  <div className="text-title font-title text-secondary font-bold">98%</div>
                  <p className="text-label-sm font-label-sm text-on-surface-variant mt-0.5">نسبة تفوق الطلاب</p>
                </div>

                <div className="p-space-md rounded-xl bg-surface border border-outline-variant/50 text-center">
                  <div className="text-title font-title text-on-surface font-bold">+1,450</div>
                  <p className="text-label-sm font-label-sm text-on-surface-variant mt-0.5">حصة مكتملة بالمنصة</p>
                </div>
              </div>
            </div>

            {/* Dynamic Navigation Tabs for Profile Deep-Dive */}
            <div className="flex items-center gap-2 border-b border-outline-variant/70 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setActiveProfileTab('methodology')}
                className={`px-5 py-2.5 rounded-xl font-title text-body-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeProfileTab === 'methodology'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface hover:bg-surface-container text-on-surface border border-outline-variant/40'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-body-md">person</span>
                <span>أسلوب التدريس والخبرات</span>
              </button>

              <button
                onClick={() => setActiveProfileTab('curriculum')}
                className={`px-5 py-2.5 rounded-xl font-title text-body-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeProfileTab === 'curriculum'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface hover:bg-surface-container text-on-surface border border-outline-variant/40'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-body-md">menu_book</span>
                <span>منهج الصف الثالث الإعدادي (الترم الثاني)</span>
              </button>

              <button
                onClick={() => setActiveProfileTab('schedule')}
                className={`px-5 py-2.5 rounded-xl font-title text-body-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeProfileTab === 'schedule'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface hover:bg-surface-container text-on-surface border border-outline-variant/40'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-body-md">calendar_month</span>
                <span>المجموعات والمواعيد الشاغرة</span>
              </button>

              <button
                onClick={() => setActiveProfileTab('reviews')}
                className={`px-5 py-2.5 rounded-xl font-title text-body-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeProfileTab === 'reviews'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface hover:bg-surface-container text-on-surface border border-outline-variant/40'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-body-md">reviews</span>
                <span>تقييمات أولياء الأمور</span>
              </button>
            </div>

            {/* TAB CONTENT 1: Teaching Methodology */}
            {activeProfileTab === 'methodology' && (
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/70 p-space-lg md:p-space-xl space-y-space-md animate-in fade-in duration-150">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-headline-sm">psychology</span>
                  </div>
                  <div>
                    <h2 className="text-headline-sm font-headline-sm text-on-surface font-bold">فلسفة التدريس ومنهجية التأسيس الذكي</h2>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">تحويل النحو والبلاغة من مادة حفظ جافة إلى مهارة تفكير واستنتاج دائم</p>
                  </div>
                </div>

                <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
                  أعتمد في تدريسي على إزالة عقدة النحو العربي من خلال <strong className="text-on-surface">استراتيجية الخرائط الذهنية التفاعلية</strong> التي تربط القواعد بمواقف لغوية من الحياة اليومية وسياق الآيات القرآنية الكريمة، بدلاً من التلقين التقليدي. يخوض الطالب تجربة تعليمية ممتعة قائمة على التحليل واكتشاف الفروق الدقيقة بين المشتقات النحوية وإعراب الجمل المركبة بثقة تامة.
                </p>

                {/* 3 Pillars Bento */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-2">
                  <div className="p-space-md rounded-xl bg-surface border border-outline-variant/60 flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-body-lg">schema</span>
                    </div>
                    <h3 className="text-title font-title text-on-surface font-bold">خرائط ذهنية ملونة</h3>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">تلخيص كامل لأبواب النحو في مخطط بصري واحد يرسخ القاعدة في ذاكرة الطالب قبل الامتحانات.</p>
                  </div>

                  <div className="p-space-md rounded-xl bg-surface border border-outline-variant/60 flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-lg bg-secondary-container/50 flex items-center justify-center text-on-secondary-container">
                      <span className="material-symbols-outlined text-body-lg">quiz</span>
                    </div>
                    <h3 className="text-title font-title text-on-surface font-bold">نظام بابل شيت وتابلت</h3>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">تدريب الطلاب أسبوعياً على أنماط أسئلة التقييم الحديثة والامتحانات الإلكترونية المصححة فورياً.</p>
                  </div>

                  <div className="p-space-md rounded-xl bg-surface border border-outline-variant/60 flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container">
                      <span className="material-symbols-outlined text-body-lg">contact_phone</span>
                    </div>
                    <h3 className="text-title font-title text-on-surface font-bold">تقرير متابعة أسبوعي</h3>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">رسالة تفصيلية لولي الأمر عبر واتساب تتضمن مستوى الحضور، نتيجة الواجب، وملاحظات الأداء التربوي.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: Term 2 Curriculum Breakdown */}
            {activeProfileTab === 'curriculum' && (
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/70 p-space-lg md:p-space-xl space-y-space-lg animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-primary font-label-md text-label-md mb-1">
                      <span className="material-symbols-outlined text-label-sm">school</span>
                      <span>الفصل الدراسي الثاني • الشهادة الإعدادية</span>
                    </div>
                    <h2 className="text-headline-sm font-headline-sm text-on-surface font-bold">محاور وتفاصيل المنهج الدراسي المتكامل</h2>
                  </div>
                  <button
                    onClick={() => alert('جاري تنزيل خطة التوزيع الزمني لمنهج اللغة العربية (PDF)')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container text-primary font-label-md text-label-md self-start font-bold cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-label-sm">download</span>
                    <span>تحميل خطة التوزيع الزمني (PDF)</span>
                  </button>
                </div>

                {/* Module Cards */}
                <div className="space-y-space-md">
                  {/* Module 1 */}
                  <div className="border border-outline-variant/70 rounded-xl p-space-md bg-surface hover:border-primary transition-colors">
                    <div className="flex items-start justify-between gap-space-md">
                      <div className="flex items-start gap-3">
                        <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-headline-sm flex items-center justify-center shrink-0 font-bold">
                          ١
                        </span>
                        <div>
                          <h3 className="text-title font-title text-on-surface font-bold">المحور الأول: النحو وقواعد الصرف (المشتقات الأساسية)</h3>
                          <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
                            اسم الفاعل، صيغ المبالغة، اسم المفعول، اسما الزمان والمكان، اسم الآلة، واسم التفضيل وشروطه وطرق صياغته.
                          </p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-flex px-2.5 py-1 bg-surface-container-lowest text-primary border border-outline-variant/40 rounded-lg text-label-sm font-bold">
                        12 حصة تدريبية
                      </span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-outline-variant/40 flex flex-wrap items-center gap-4 text-label-md font-label-md text-on-surface-variant">
                      <span className="flex items-center gap-1 text-secondary font-semibold">
                        <span className="material-symbols-outlined text-body-sm">check_circle</span>
                        <span>بنك أسئلة يحتوي على 450 سؤال تدرج صعوبة</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-body-sm text-primary">article</span>
                        <span>ورقة عمل تلخيص القواعد بعد كل درس</span>
                      </span>
                    </div>
                  </div>

                  {/* Module 2 */}
                  <div className="border border-outline-variant/70 rounded-xl p-space-md bg-surface hover:border-primary transition-colors">
                    <div className="flex items-start justify-between gap-space-md">
                      <div className="flex items-start gap-3">
                        <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-headline-sm flex items-center justify-center shrink-0 font-bold">
                          ٢
                        </span>
                        <div>
                          <h3 className="text-title font-title text-on-surface font-bold">المحور الثاني: النصوص الأدبية وتذوق مواطن الجمال والبلاغة</h3>
                          <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
                            سفينة نوح (شريف)، خلال كريمة (شعر)، وادي الكنانة، استعن بالله (حديث شريف)، حب الوطن، مع التركيز على استخراج مواطن الجمال بالفهم دون حفظ أعمى.
                          </p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-flex px-2.5 py-1 bg-surface-container-lowest text-primary border border-outline-variant/40 rounded-lg text-label-sm font-bold">
                        8 حصص مخصصة
                      </span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-outline-variant/40 flex flex-wrap items-center gap-4 text-label-md font-label-md text-on-surface-variant">
                      <span className="flex items-center gap-1 text-secondary font-semibold">
                        <span className="material-symbols-outlined text-body-sm">check_circle</span>
                        <span>تسجيل صوتي عالي الجودة لإلقاء النصوص وشرح المعاني</span>
                      </span>
                    </div>
                  </div>

                  {/* Module 3 */}
                  <div className="border border-outline-variant/70 rounded-xl p-space-md bg-surface hover:border-primary transition-colors">
                    <div className="flex items-start justify-between gap-space-md">
                      <div className="flex items-start gap-3">
                        <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-headline-sm flex items-center justify-center shrink-0 font-bold">
                          ٣
                        </span>
                        <div>
                          <h3 className="text-title font-title text-on-surface font-bold">المحور الثالث: القراءة المتحررة وقصة (طموح جارية)</h3>
                          <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
                            الحياة دقائق وثوانٍ، فالق الحب والنوى، الحمامة المطوقة، واستكمال الفصول المتبقية من سيرة شجر الدر ونجم الدين مع سيناريو درامي يسهل استيعاب الأحداث.
                          </p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-flex px-2.5 py-1 bg-surface-container-lowest text-primary border border-outline-variant/40 rounded-lg text-label-sm font-bold">
                        6 حصص مراجعة
                      </span>
                    </div>
                  </div>

                  {/* Module 4 */}
                  <div className="border border-outline-variant/70 rounded-xl p-space-md bg-surface-container-low/40 hover:border-primary transition-colors">
                    <div className="flex items-start justify-between gap-space-md">
                      <div className="flex items-start gap-3">
                        <span className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container font-headline-sm flex items-center justify-center shrink-0 font-bold">
                          ٤
                        </span>
                        <div>
                          <h3 className="text-title font-title text-on-surface font-bold">المحور الرابع: معسكر المراجعة النهائية ونماذج امتحانات المحافظات</h3>
                          <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
                            حل أكثر من 20 امتحاناً لأعوام سابقة (القاهرة، الجيزة، الإسكندرية، الدقهلية)، مع شرح استراتيجيات إدارة وقت الامتحان وتفادي أخطاء الإملاء والتعبير الوظيفي والإبداعي.
                          </p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-flex px-2.5 py-1 bg-surface-container-lowest text-secondary font-bold border border-secondary/30 rounded-lg text-label-sm">
                        مراجعة ليلة الامتحان
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: Available Cohort Groups */}
            {activeProfileTab === 'schedule' && (
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/70 p-space-lg md:p-space-xl space-y-space-md animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-headline-sm font-headline-sm text-on-surface font-bold">المجموعات المتاحة وحجز موعد الحصة</h2>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">اختر المجموعة الدراسية المناسبة لجدول الطالب - الحد الأقصى 8 طلاب لضمان جودة المشاركة</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-label-md font-label-md text-secondary font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                    <span>التسجيل مفتوح للفوج الجديد</span>
                  </span>
                </div>

                {/* Schedule Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-2">
                  {/* Group A */}
                  <div
                    onClick={() => setSelectedGroup('A')}
                    className={`p-space-lg rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedGroup === 'A'
                        ? 'border-primary bg-surface-container-lowest shadow-md'
                        : 'border-outline-variant/80 bg-surface-container-lowest'
                    }`}
                  >
                    <div className="absolute top-3 left-3 bg-primary text-on-primary text-label-sm font-label-sm px-2.5 py-0.5 rounded-full font-bold">
                      الموصى بها
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-7 h-7 rounded-lg bg-primary-fixed text-primary font-bold flex items-center justify-center text-label-md">أ</span>
                        <h4 className="text-title font-title text-on-surface font-bold">المجموعة (أ)</h4>
                      </div>
                      <div className="text-body-md font-body-md text-primary font-bold flex items-center gap-1.5 mb-2">
                        <span className="material-symbols-outlined text-body-md">calendar_today</span>
                        <span>الأحد والثلاثاء</span>
                      </div>
                      <p className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1.5 mb-3">
                        <span className="material-symbols-outlined text-body-md text-outline">schedule</span>
                        <span>04:00 م إلى 05:30 م (بتوقيت القاهرة)</span>
                      </p>
                      <div className="bg-surface rounded-xl p-2.5 border border-outline-variant/40 mb-4">
                        <div className="flex justify-between text-label-sm font-label-sm mb-1 text-on-surface">
                          <span>المقاعد الشاغرة</span>
                          <span className="text-error font-bold">متبقي مقعدان فقط (2/8)</span>
                        </div>
                        <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                          <div className="bg-error h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-[11px] text-outline mt-1.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">event_upcoming</span>
                          <span>تبدأ أول حصة: الأحد القادم 15 مارس</span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenBookingModal(currentTeacher)}
                      className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-all active:scale-95 shadow-sm font-bold cursor-pointer"
                      type="button"
                    >
                      اختيار هذه المجموعة
                    </button>
                  </div>

                  {/* Group B */}
                  <div
                    onClick={() => setSelectedGroup('B')}
                    className={`p-space-lg rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedGroup === 'B'
                        ? 'border-2 border-primary bg-surface-container-lowest shadow-md'
                        : 'border-outline-variant/80 bg-surface-container-lowest hover:border-outline'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-7 h-7 rounded-lg bg-surface-container text-on-surface font-bold flex items-center justify-center text-label-md">ب</span>
                        <h4 className="text-title font-title text-on-surface font-bold">المجموعة (ب)</h4>
                      </div>
                      <div className="text-body-md font-body-md text-on-surface font-bold flex items-center gap-1.5 mb-2">
                        <span className="material-symbols-outlined text-body-md text-outline">calendar_today</span>
                        <span>السبت والأربعاء</span>
                      </div>
                      <p className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1.5 mb-3">
                        <span className="material-symbols-outlined text-body-md text-outline">schedule</span>
                        <span>06:00 م إلى 07:30 م (بتوقيت القاهرة)</span>
                      </p>
                      <div className="bg-surface rounded-xl p-2.5 border border-outline-variant/40 mb-4">
                        <div className="flex justify-between text-label-sm font-label-sm mb-1 text-on-surface">
                          <span>المقاعد الشاغرة</span>
                          <span className="text-secondary font-bold">متبقي 4 مقاعد (4/8)</span>
                        </div>
                        <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                          <div className="bg-secondary h-2 rounded-full" style={{ width: '50%' }}></div>
                        </div>
                        <p className="text-[11px] text-outline mt-1.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">event_upcoming</span>
                          <span>تبدأ أول حصة: السبت القادم 21 مارس</span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenBookingModal(currentTeacher)}
                      className="w-full py-2.5 rounded-xl border border-primary text-primary hover:bg-surface-container-low font-label-md text-label-md transition-all active:scale-95 font-bold cursor-pointer"
                      type="button"
                    >
                      اختيار هذه المجموعة
                    </button>
                  </div>

                  {/* Group C */}
                  <div
                    onClick={() => setSelectedGroup('C')}
                    className={`p-space-lg rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedGroup === 'C'
                        ? 'border-2 border-primary bg-surface-container-lowest shadow-md'
                        : 'border-outline-variant/80 bg-surface-container-lowest hover:border-outline'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-7 h-7 rounded-lg bg-surface-container text-on-surface font-bold flex items-center justify-center text-label-md">ج</span>
                        <h4 className="text-title font-title text-on-surface font-bold">المجموعة (ج)</h4>
                      </div>
                      <div className="text-body-md font-body-md text-on-surface font-bold flex items-center gap-1.5 mb-2">
                        <span className="material-symbols-outlined text-body-md text-outline">calendar_today</span>
                        <span>الإثنين والخميس</span>
                      </div>
                      <p className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1.5 mb-3">
                        <span className="material-symbols-outlined text-body-md text-outline">schedule</span>
                        <span>07:30 م إلى 09:00 م (بتوقيت القاهرة)</span>
                      </p>
                      <div className="bg-surface rounded-xl p-2.5 border border-outline-variant/40 mb-4">
                        <div className="flex justify-between text-label-sm font-label-sm mb-1 text-on-surface">
                          <span>المقاعد الشاغرة</span>
                          <span className="text-error font-bold">متبقي مقعد واحد فقط! (1/8)</span>
                        </div>
                        <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                          <div className="bg-error h-2 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                        <p className="text-[11px] text-outline mt-1.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">event_upcoming</span>
                          <span>تبدأ أول حصة: الإثنين 16 مارس</span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenBookingModal(currentTeacher)}
                      className="w-full py-2.5 rounded-xl border border-primary text-primary hover:bg-surface-container-low font-label-md text-label-md transition-all active:scale-95 font-bold cursor-pointer"
                      type="button"
                    >
                      اختيار هذه المجموعة
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: Reviews and Parent Testimonials */}
            {activeProfileTab === 'reviews' && (
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/70 p-space-lg md:p-space-xl space-y-space-lg animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-headline-sm font-headline-sm text-on-surface font-bold">آراء وتقييمات أولياء الأمور والطلاب</h2>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">جميع التقييمات صادرة من حسابات أولياء أمور مسجلين أتم أبناؤهم شهراً على الأقل مع المعلم</p>
                  </div>
                  <div className="flex items-center gap-2 bg-surface p-2 rounded-xl border border-outline-variant/60">
                    <span className="text-display font-display text-primary leading-none font-bold">4.95</span>
                    <div>
                      <div className="flex items-center text-[#d97706]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className="material-symbols-outlined text-body-md" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                        ))}
                      </div>
                      <p className="text-label-sm font-label-sm text-outline">من إجمالي 878 مراجعة</p>
                    </div>
                  </div>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  {/* Review 1 */}
                  <div className="p-space-md rounded-xl bg-surface border border-outline-variant/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary font-bold flex items-center justify-center text-label-md">
                          م.أ
                        </div>
                        <div>
                          <h5 className="text-title font-title text-on-surface font-bold">د. مروة عبد العزيز</h5>
                          <p className="text-label-sm font-label-sm text-outline">ولي أمر الطالبة سلمى (الشهادة الإعدادية - القاهرة)</p>
                        </div>
                      </div>
                      <div className="flex text-[#d97706] text-label-sm">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className="material-symbols-outlined text-label-md" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                      "أستاذ إبراهيم غير مفهوم ابنتي تماماً عن النحو، كانت تخشى الإعراب تماماً وتضيع الدرجات في الترم الأول، والآن أصبحت تحل قطعة النحو كاملة في 10 دقائق وبلا أي تردد! المتابعة الأسبوعية عبر واتساب تريحني جداً."
                    </p>
                    <div className="text-[11px] text-outline pt-1">منذ 3 أسابيع • مسجلة في المجموعة (أ)</div>
                  </div>

                  {/* Review 2 */}
                  <div className="p-space-md rounded-xl bg-surface border border-outline-variant/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container font-bold flex items-center justify-center text-label-md">
                          م.ش
                        </div>
                        <div>
                          <h5 className="text-title font-title text-on-surface font-bold">م. طارق الشربيني</h5>
                          <p className="text-label-sm font-label-sm text-outline">ولي أمر الطالب يوسف (الصف الثالث الإعدادي - الجيزة)</p>
                        </div>
                      </div>
                      <div className="flex text-[#d97706] text-label-sm">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className="material-symbols-outlined text-label-md" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                      "الالتزام بالمواعيد والشرح على سبورة إلكترونية منظمة جداً. بنك الأسئلة والخرائط الذهنية جعلت المذاكرة سهلة لابني دون أي ملل. أشكره جداً على تفانيه واهتمامه النفسي بالطلاب."
                    </p>
                    <div className="text-[11px] text-outline pt-1">منذ شهر • مسجل في المجموعة (ب)</div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Right Column (4 cols): Sticky Booking & Checkout Container */}
          <aside className="lg:col-span-4 sticky top-24 z-20 space-y-space-md">
            {/* Main Booking Box */}
            <div className="bg-surface-container-lowest rounded-2xl border-2 border-primary/20 shadow-md p-space-lg space-y-space-md relative overflow-hidden">
              {/* Discount Badge Banner */}
              <div className="bg-secondary/10 -mx-space-lg -mt-space-lg px-space-lg py-2.5 border-b border-secondary/20 flex items-center justify-between">
                <span className="text-secondary font-label-md text-label-md flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-body-sm">local_offer</span>
                  <span>خصم الفصل الدراسي الثاني</span>
                </span>
                <span className="bg-secondary text-on-secondary px-2 py-0.5 rounded-full text-label-sm font-label-sm font-bold">
                  وفر {currentTeacher.discountPercentage}%
                </span>
              </div>

              {/* Pricing Display */}
              <div className="pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-display font-display text-primary font-bold">{currentTeacher.monthlyPrice}</span>
                  <span className="text-title font-title text-on-surface font-bold">ج.م / شهرياً</span>
                  <span className="text-body-md font-body-md text-outline line-through mr-2">{currentTeacher.originalPrice} ج.م</span>
                </div>
                <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
                  اشتراك شهري مرن - يمكن إلغاؤه في أي وقت بدون رسوم خفية.
                </p>
              </div>

              {/* What is Included List */}
              <div className="space-y-2.5 border-y border-outline-variant/60 py-space-md text-body-sm font-body-sm text-on-surface">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-body-md mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <span><strong>8 حصص شهرية مباشرة</strong> (حصتان أسبوعياً - 90 دقيقة للحصة)</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-body-md mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <span>مجموعات تفاعلية صغيرة (بحد أقصى 8 طلاب فقط)</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-body-md mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <span>مذكرات الشرح والخرائط الذهنية بصيغة PDF عالية الجودة</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-body-md mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <span>بنك أسئلة رقمي تفاعلي مع تصحيح ذكي فوري</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-body-md mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <span>تقرير دوري مفصل لولي الأمر عبر واتساب بعد كل حصة</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2.5 pt-1">
                {/* Primary Emerald CTA */}
                <button
                  onClick={() => onOpenBookingModal(currentTeacher)}
                  className="w-full py-3.5 px-4 rounded-xl bg-secondary hover:bg-on-secondary-container text-on-secondary text-title font-title flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 font-bold cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-headline-sm">how_to_reg</span>
                  <span>احجز حصة تجريبية مجاناً</span>
                </button>

                {/* Secondary Primary Blue CTA */}
                <button
                  onClick={() => {
                    setActiveTab('wallet');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary-container border border-primary-container/20 text-body-lg font-body-lg flex items-center justify-center gap-2 transition-all active:scale-95 font-bold cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-body-lg">credit_card</span>
                  <span>الاشتراك المباشر في الفصل</span>
                </button>
              </div>

              {/* Trust & Guarantee Ribbon */}
              <div className="bg-surface rounded-xl p-space-md border border-outline-variant/60 flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-headline-sm shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified_user
                </span>
                <div>
                  <h5 className="text-label-md font-label-md text-on-surface font-bold">ضمان غايتي الذهبي</h5>
                  <p className="text-[12px] text-on-surface-variant leading-normal mt-0.5">
                    استرداد كامل الرسوم بنسبة 100% في حال عدم الرضا التام بعد حضور الحصة الأولى دون أي تعقيدات.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Help & Inquiries Card */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/70 p-space-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container/60 text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined">support_agent</span>
                </div>
                <div>
                  <p className="text-title font-title text-on-surface font-bold">هل لديك استفسار؟</p>
                  <p className="text-label-sm font-label-sm text-outline">فريق الإرشاد الأكاديمي جاهز لمساعدتك</p>
                </div>
              </div>
              <button
                onClick={() => alert('مرحباً بك! فريق الدعم الأكاديمي لمنصة غايتي متاح 24/7 عبر المحادثة الفورية والواتساب.')}
                className="px-3 py-1.5 rounded-lg border border-outline-variant hover:border-primary text-primary font-label-md text-label-md transition-colors cursor-pointer font-bold"
                type="button"
              >
                محادثة فورية
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
