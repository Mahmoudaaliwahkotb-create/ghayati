import React, { useState } from 'react';
import { Teacher } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedTeacher?: Teacher | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedTeacher
}) => {
  const [selectedStudent, setSelectedStudent] = useState<'amira' | 'new'>('amira');

  if (!isOpen) return null;

  const teacherName = selectedTeacher ? selectedTeacher.name : 'أ. إبراهيم فؤاد الدسوقي';
  const teacherAvatar = selectedTeacher ? selectedTeacher.avatar : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsOJXO-TufjGKd4qDyIJkiwOA3JXW4Zj_K9hZU55kkeet-voMKTh3GuqHYn_46VBXbhZmYh-_WGcOTfIc2qwb5wbZHMc5tQDKIo1UeuvyY2MxtSCFb1JWLAyRR0jMXHEoxNtqO_xFxkzlK3lI2zQv6_xy-ngxZ1vovMvuD-Hdaz2nJs18Em7e1gUKLeL1Tg5nPUggNlMIKIvEESkk3tIOM1XcT2p88wK4f7LTUpRMk2n4j4O5tpfoJ7w';
  const subjectName = selectedTeacher ? selectedTeacher.subject : 'لغة عربية (القواعد والنحو والبلاغة)';

  return (
    <div
      id="bookingModalOverlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm transition-opacity duration-300"
    >
      {/* Centered Modal Card (680px Width Max) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        className="w-full max-w-[680px] bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant overflow-hidden relative transform transition-all flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Top Accent Bar: Emerald to Primary Blue subtle gradient */}
        <div className="h-1.5 w-full bg-gradient-to-l from-secondary to-primary-container"></div>

        {/* Close Action Button (Top Left in RTL layout) */}
        <button
          onClick={onClose}
          aria-label="إغلاق النافذة"
          className="absolute top-4 left-4 p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-colors z-10 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Scrollable Modal Body */}
        <div className="p-space-lg md:p-space-xl overflow-y-auto space-y-space-lg text-right">
          {/* 1. MODAL HEADER */}
          <div className="flex items-start gap-space-md">
            <div className="w-12 h-12 rounded-full bg-secondary-container/50 border border-secondary text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-headline-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                event_available
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-space-xs flex-wrap">
                <h2 className="text-headline-sm font-headline-sm text-on-surface font-bold" id="modalTitle">
                  تأكيد حجز الحصة التجريبية المجانية
                </h2>
                <span className="bg-secondary-fixed text-on-secondary-fixed px-space-xs py-0.5 rounded text-label-sm font-label-sm font-bold">
                  بدون أي رسوم مسبقة
                </span>
              </div>
              <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
                أنت على وشك حجز مقعد تجريبي مباشر مع المعلم لتقييم أسلوب الشرح والتفاعل الأكاديمي مع الطالب.
              </p>
            </div>
          </div>

          {/* 2. CLASS & TEACHER SUMMARY BOX */}
          <div className="border border-outline-variant rounded-xl bg-surface p-space-md space-y-space-md">
            {/* Teacher Row */}
            <div className="flex items-center justify-between gap-space-md pb-space-sm border-b border-outline-variant/60">
              <div className="flex items-center gap-space-md">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-outline-variant relative shrink-0">
                  <img
                    src={teacherAvatar}
                    alt={teacherName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="text-title font-title text-on-surface font-bold">{teacherName}</span>
                    <span className="text-primary-container text-body-md" title="معلم معتمد وموثق">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                        verified
                      </span>
                    </span>
                  </div>
                  <div className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-space-xs mt-0.5">
                    <span className="bg-surface-container-high text-primary px-space-xs py-0.5 rounded text-label-sm font-label-sm font-bold">
                      {subjectName}
                    </span>
                    <span>•</span>
                    <span>الصف الثالث الإعدادي (الشهادة الإعدادية)</span>
                  </div>
                </div>
              </div>

              {/* Price Highlight Badge */}
              <div className="text-left shrink-0">
                <div className="text-label-sm font-label-sm text-outline line-through">250.00 ج.م</div>
                <div className="bg-secondary text-on-secondary px-space-sm py-1 rounded-lg text-label-md font-label-md font-bold tracking-tight shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">redeem</span>
                  <span>0.00 ج.م مجاناً 100%</span>
                </div>
              </div>
            </div>

            {/* Session Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm pt-space-xs">
              <div className="flex items-start gap-space-sm p-space-xs">
                <span className="material-symbols-outlined text-primary-container mt-0.5">calendar_month</span>
                <div>
                  <span className="block text-label-sm font-label-sm text-on-surface-variant">الموعد المحدد</span>
                  <span className="text-body-md font-body-md text-on-surface font-semibold">الأحد القادم، 16 مارس 2025</span>
                </div>
              </div>

              <div className="flex items-start gap-space-sm p-space-xs">
                <span className="material-symbols-outlined text-primary-container mt-0.5">schedule</span>
                <div>
                  <span className="block text-label-sm font-label-sm text-on-surface-variant">التوقيت (مدة 90 دقيقة)</span>
                  <span className="text-body-md font-body-md text-on-surface font-semibold">04:00 م - 05:30 م (توقيت القاهرة)</span>
                </div>
              </div>

              <div className="flex items-start gap-space-sm p-space-xs">
                <span className="material-symbols-outlined text-primary-container mt-0.5">video_camera_front</span>
                <div>
                  <span className="block text-label-sm font-label-sm text-on-surface-variant">نمط الحصة</span>
                  <span className="text-body-md font-body-md text-on-surface font-semibold">بث حي تفاعلي عبر منصة غايتي لايف</span>
                </div>
              </div>

              <div className="flex items-start gap-space-sm p-space-xs">
                <span className="material-symbols-outlined text-primary-container mt-0.5">groups</span>
                <div>
                  <span className="block text-label-sm font-label-sm text-on-surface-variant">سعة المجموعة التفاعلية</span>
                  <span className="text-body-md font-body-md text-on-surface font-semibold">مجموعة مميزة مصغرة (أقصى حد 8 طلاب)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. STUDENT SELECTION */}
          <div className="space-y-space-sm">
            <label className="text-title font-title text-on-surface flex items-center justify-between">
              <span>بيانات الطالب المُراد تسجيله في الحصة</span>
              <span className="text-label-sm font-label-sm text-on-surface-variant font-normal">اختر من حسابك العائلي</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
              {/* Selected Student Card */}
              <label
                onClick={() => setSelectedStudent('amira')}
                className={`relative flex items-center gap-space-md p-space-sm border-2 rounded-xl cursor-pointer shadow-sm transition-all ${
                  selectedStudent === 'amira'
                    ? 'border-primary-container bg-surface-container-low'
                    : 'border-outline-variant bg-surface-container-lowest'
                }`}
              >
                <input
                  type="radio"
                  name="student_id"
                  checked={selectedStudent === 'amira'}
                  onChange={() => setSelectedStudent('amira')}
                  className="w-4 h-4 text-primary-container border-outline focus:ring-primary-container"
                />
                <div className="flex items-center gap-space-sm">
                  <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary font-bold flex items-center justify-center text-label-md font-label-md shrink-0">
                    أم
                  </div>
                  <div className="truncate text-right">
                    <div className="text-body-md font-body-md font-bold text-on-surface truncate">أميرة أحمد محمد</div>
                    <div className="text-label-sm font-label-sm text-on-surface-variant truncate">الصف الثالث الإعدادي (مطابق للمنهج)</div>
                  </div>
                </div>
                {selectedStudent === 'amira' && (
                  <span className="absolute top-2 left-2 text-primary-container">
                    <span className="material-symbols-outlined text-body-md" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  </span>
                )}
              </label>

              {/* Secondary Option: Add or Switch Student */}
              <label
                onClick={() => setSelectedStudent('new')}
                className={`flex items-center justify-between p-space-sm border rounded-xl cursor-pointer transition-colors ${
                  selectedStudent === 'new'
                    ? 'border-2 border-primary-container bg-surface-container-low'
                    : 'border-dashed border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <div className="w-9 h-9 rounded-full border border-outline-variant text-on-surface-variant flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">person_add</span>
                  </div>
                  <div className="text-right">
                    <div className="text-body-md font-body-md font-medium text-on-surface">طالب آخر أو إضافة ابن جديد</div>
                    <div className="text-label-sm font-label-sm text-on-surface-variant">ربط حساب تلميذ جديد بالمنصة</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">chevron_left</span>
              </label>
            </div>
          </div>

          {/* 4. QUICK PREPARATION CHECKLIST */}
          <div className="bg-surface-container-low/60 border border-outline-variant/60 rounded-xl p-space-md space-y-space-sm">
            <div className="flex items-center gap-space-xs text-primary-container font-semibold text-body-md font-body-md">
              <span className="material-symbols-outlined text-body-lg">info</span>
              <span>تنبيهات وتجهيزات هامة لحضور الحصة:</span>
            </div>
            <ul className="space-y-space-xs pr-space-sm text-body-sm font-body-sm text-on-surface-variant">
              <li className="flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-body-md mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check
                </span>
                <span>سيتم إرسال رابط الحصة المباشرة والتنبيه عبر <strong>واتساب</strong> وعبر قسم <strong>"فصولي"</strong> قبل بدء الدرس بـ 15 دقيقة.</span>
              </li>
              <li className="flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-body-md mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check
                </span>
                <span>يُفضّل الدخول عبر جهاز كمبيوتر مكتبي أو تابلت مع تجهيز كشكول وقلم لمتابعة الأمثلة التفاعلية والأسئلة الشفوية.</span>
              </li>
              <li className="flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-body-md mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check
                </span>
                <span>سوف تتلقى رسالة SMS تذكيرية مجانية على رقم هاتفك المسجل قبل الموعد بساعة واحدة.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 5. ACTIONS FOOTER */}
        <div className="p-space-md md:px-space-xl bg-surface-container-lowest border-t border-outline-variant flex flex-col-reverse sm:flex-row items-center justify-between gap-space-md">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-space-lg py-3 rounded-xl border border-outline text-on-surface hover:bg-surface-container font-title text-body-md transition-colors duration-150 text-center cursor-pointer"
            type="button"
          >
            إلغاء أو تعديل
          </button>

          <div className="w-full sm:w-auto flex items-center gap-space-sm">
            <button
              onClick={onConfirm}
              className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 active:scale-[0.98] text-on-secondary px-space-xl py-3 rounded-xl font-title text-body-md shadow-md transition-all duration-150 flex items-center justify-center gap-space-xs cursor-pointer font-bold"
              type="button"
            >
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                task_alt
              </span>
              <span>تأكيد الحجز ومتابعة إلى فصولي</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
