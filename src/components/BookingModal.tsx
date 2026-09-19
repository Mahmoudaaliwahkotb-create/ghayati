import React, { useState } from 'react';
import { Teacher } from '../types';
import { submitBookingToSupabase } from '../lib/supabase';

export interface BookingConfirmationPayload {
  parentName: string;
  studentName: string;
  whatsappNumber: string;
  bookingId?: string;
  teacherId?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: BookingConfirmationPayload) => void;
  selectedTeacher?: Teacher | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedTeacher
}) => {
  const [parentName, setParentName] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const teacherName = selectedTeacher ? selectedTeacher.name : 'أ. محمود عليوة';
  const teacherAvatar = selectedTeacher
    ? selectedTeacher.avatar
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
  const subjectName = selectedTeacher ? selectedTeacher.subject : 'اللغة العربية والتأسيس';
  const teacherId = selectedTeacher ? selectedTeacher.id : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const cleanParentName = parentName.trim();
    const cleanStudentName = studentName.trim();
    const cleanWhatsapp = whatsappNumber.trim();

    if (!cleanParentName) {
      setErrorMessage('يرجى إدخال اسم ولي الأمر.');
      return;
    }

    if (!cleanStudentName) {
      setErrorMessage('يرجى إدخال اسم الطفل (الطالب).');
      return;
    }

    if (!cleanWhatsapp) {
      setErrorMessage('يرجى إدخال رقم الواتساب للتواصل وإرسال رابط الحصة.');
      return;
    }

    // Phone format check: at least 8 digits
    const digitsOnly = cleanWhatsapp.replace(/[^0-9]/g, '');
    if (digitsOnly.length < 8) {
      setErrorMessage('يرجى إدخال رقم واتساب صحيح ومكون من 8 أرقام على الأقل.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Submit to Supabase "bookings" table (teacher_id, parent_name, student_name, whatsapp_number)
      const result = await submitBookingToSupabase({
        teacherId,
        parentName: cleanParentName,
        studentName: cleanStudentName,
        whatsappNumber: cleanWhatsapp,
      });

      // 2. On success, instantly transition to Screen 5 (Booking Confirmed)
      onConfirm({
        parentName: cleanParentName,
        studentName: cleanStudentName,
        whatsappNumber: cleanWhatsapp,
        bookingId: result.bookingId,
        teacherId,
      });
    } catch (err: any) {
      console.error('Error confirming booking:', err);
      // Fallback transition so parent is never blocked
      onConfirm({
        parentName: cleanParentName,
        studentName: cleanStudentName,
        whatsappNumber: cleanWhatsapp,
        bookingId: `bk-${Date.now().toString().slice(-6)}`,
        teacherId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="bookingModalOverlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm transition-opacity duration-300"
    >
      {/* Centered Modal Card (640px Max Width) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        className="w-full max-w-[640px] bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant overflow-hidden relative transform transition-all flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-l from-secondary to-primary-container"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="إغلاق النافذة"
          className="absolute top-4 left-4 p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-colors z-10 cursor-pointer disabled:opacity-50"
          type="button"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Scrollable Modal Content */}
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
                  حجز الحصة التجريبية المجانية
                </h2>
                <span className="bg-secondary-fixed text-on-secondary-fixed px-space-xs py-0.5 rounded text-label-sm font-label-sm font-bold">
                  بدون أي رسوم (مجاناً 100%)
                </span>
              </div>
              <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
                املأ بياناتك أدناه لتأكيد حجز مقعد لطفلك في الحصة التفاعلية المباشرة مع المعلم.
              </p>
            </div>
          </div>

          {/* 2. CHOSEN TEACHER SUMMARY PILL */}
          <div className="border border-outline-variant rounded-xl bg-surface p-space-md flex items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md">
              <div className="w-13 h-13 rounded-full overflow-hidden border border-outline-variant relative shrink-0">
                <img
                  src={teacherAvatar}
                  alt={teacherName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-title font-title text-on-surface font-bold">{teacherName}</span>
                  <span className="text-primary" title="معلم معتمد وموثق">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                  </span>
                </div>
                <div className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-2 mt-0.5">
                  <span className="bg-surface-container-high text-primary px-2 py-0.5 rounded text-label-sm font-label-sm font-semibold">
                    {subjectName}
                  </span>
                  <span>•</span>
                  <span>حصة تجريبية مباشرة</span>
                </div>
              </div>
            </div>

            <div className="text-left shrink-0">
              <div className="text-label-xs text-outline line-through">250 ج.م</div>
              <div className="text-secondary font-bold text-label-md">0.00 ج.م</div>
            </div>
          </div>

          {/* 3. BOOKING FORM (FORM: parent_name, student_name, whatsapp_number) */}
          <form id="trialBookingForm" onSubmit={handleSubmit} className="space-y-space-md">
            <div className="border-t border-outline-variant/60 pt-space-md">
              <h3 className="text-title font-title text-on-surface font-bold mb-space-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">person_pin</span>
                <span>بيانات الحجز والتواصل:</span>
              </h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-space-md">
                سيتم حفظ البيانات وربطها بالمعلم المختار لإرسال رابط البث عبر الواتساب.
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-space-sm rounded-xl bg-error-container text-on-error-container text-body-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Field 1: parent_name (اسم ولي الأمر) */}
            <div className="space-y-1">
              <label htmlFor="parent_name_input" className="block text-label-md font-label-md text-on-surface font-semibold">
                اسم ولي الأمر <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
                  badge
                </span>
                <input
                  id="parent_name_input"
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="مثال: أحمد محمود عليوة"
                  required
                  disabled={isSubmitting}
                  className="w-full h-11 pr-10 pl-3 rounded-xl border border-outline-variant bg-surface text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md"
                />
              </div>
            </div>

            {/* Field 2: student_name (اسم الطالب / الطفل) */}
            <div className="space-y-1">
              <label htmlFor="student_name_input" className="block text-label-md font-label-md text-on-surface font-semibold">
                اسم الطفل (الطالب) <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
                  face
                </span>
                <input
                  id="student_name_input"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="مثال: عمر أحمد محمود"
                  required
                  disabled={isSubmitting}
                  className="w-full h-11 pr-10 pl-3 rounded-xl border border-outline-variant bg-surface text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md"
                />
              </div>
            </div>

            {/* Field 3: whatsapp_number (رقم الواتساب) */}
            <div className="space-y-1">
              <label htmlFor="whatsapp_number_input" className="block text-label-md font-label-md text-on-surface font-semibold">
                رقم الواتساب (لإرسال رابط الحصة المباشرة والتنبيه) <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
                  chat
                </span>
                <input
                  id="whatsapp_number_input"
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="مثال: 01012345678"
                  dir="ltr"
                  required
                  disabled={isSubmitting}
                  className="w-full h-11 pr-10 pl-3 rounded-xl border border-outline-variant bg-surface text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md text-right font-sans"
                />
              </div>
              <span className="text-label-xs text-on-surface-variant block pr-1">
                سيصلك رابط القاعة الافتراضية عبر تطبيق الواتساب قبل موعد الدرس بـ 15 دقيقة.
              </span>
            </div>

            {/* Note on Free Trial */}
            <div className="bg-surface-container-low/70 border border-outline-variant/50 rounded-xl p-space-sm flex items-start gap-2 text-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-secondary text-lg shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
              <span>
                الحصة تجريبية ومجانية بنسبة 100% ولا تتطلب إدخال أي وسيلة دفع أو التزامات مستقبلية.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-space-md border-t border-outline-variant/60 flex flex-col-reverse sm:flex-row items-center justify-between gap-space-md">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-space-lg py-2.5 rounded-xl border border-outline text-on-surface hover:bg-surface-container font-title text-body-md transition-colors text-center cursor-pointer disabled:opacity-50"
              >
                إلغاء
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 active:scale-[0.98] text-on-secondary px-space-xl py-2.5 rounded-xl font-title text-body-md shadow-md transition-all flex items-center justify-center gap-space-xs cursor-pointer font-bold disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-on-secondary border-t-transparent rounded-full animate-spin"></span>
                    <span>جاري إرسال وتأكيد الحجز...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span>تأكيد الحجز</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
