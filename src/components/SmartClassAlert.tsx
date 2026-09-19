import React, { useState, useEffect } from 'react';

interface SmartClassAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenClassroom: () => void;
  subjectTitle?: string;
  teacherName?: string;
  teacherAvatar?: string;
  roomName?: string;
}

export const SmartClassAlert: React.FC<SmartClassAlertProps> = ({
  isOpen,
  onClose,
  onOpenClassroom,
  subjectTitle = 'الرياضيات (الجبر والهندسة)',
  teacherName = 'أ. محمود الكردي',
  teacherAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUsy9WyJZVlgaHdIpBmViL47B5u2Is50dCZvlJqcQ9x0-Hq74uBeo4Jov6_GyGLiEn6NAHy31s6gCUjOundidI9AbPNCiwGTBgFefKls67LcnYGMl47zi9yJQC_qaZ4Otz2TL8i_fF0BEeznfHRtOoIaTCK27gxdi0AAqONhsAMXos2_nlqOIhGPPuXVlIT9maYzYQyugnRVkTxNi7CMSUfdl2G5WLCrJ9pnqBELIVz76B2fJu3Y8GMA',
  roomName = 'استوديو غايتي الافتراضي HD - القاعة 101'
}) => {
  // 15-minute countdown (900 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(14 * 60 + 52); // ~14m 52s
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Minimized floating pill version
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-3">
        <div className="bg-surface-container-highest text-on-surface rounded-full p-2 pl-4 pr-3 shadow-2xl border border-outline-variant flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
          <div className="text-right">
            <span className="text-xs font-bold block leading-tight">حصة الرياضيات بعد {formattedTime}</span>
            <span className="text-[10px] text-on-surface-variant">{teacherName}</span>
          </div>
          {/* PRIMARY ACTION: Accent green only */}
          <button
            onClick={() => {
              setIsMinimized(false);
              onOpenClassroom();
            }}
            className="px-3.5 py-1.5 rounded-full bg-secondary text-on-secondary text-xs font-bold hover:bg-on-secondary-fixed-variant transition-colors cursor-pointer shadow-xs"
          >
            دخول القاعة
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            className="text-on-surface-variant hover:text-on-surface text-xs cursor-pointer p-1"
            title="توسيع التنبيه"
          >
            <span className="material-symbols-outlined text-base">expand_less</span>
          </button>
        </div>
      </div>
    );
  }

  // Expanded banner alert
  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-50 max-w-lg w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-bottom-5">
      <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-2xl shadow-2xl p-5 text-right relative overflow-hidden backdrop-blur-md">
        {/* Subtle top indicator */}
        <div className="absolute top-0 inset-x-0 h-1 bg-primary"></div>

        {/* Header row */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/50">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="text-sm font-bold text-on-surface">
              تنبيه ذكي: حصتك المباشرة تبدأ بعد ١٥ دقيقة
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 rounded-lg text-outline hover:text-on-surface text-xs cursor-pointer"
              title={soundEnabled ? 'كتم الرنين' : 'تفعيل الرنين'}
            >
              <span className="material-symbols-outlined text-base">
                {soundEnabled ? 'volume_up' : 'volume_off'}
              </span>
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded-lg text-outline hover:text-on-surface cursor-pointer"
              title="تصغير التنبيه"
            >
              <span className="material-symbols-outlined text-base">minimize</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-outline hover:text-on-surface cursor-pointer"
              title="إغلاق التنبيه"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        {/* Lesson Details Card */}
        <div className="my-3.5 flex items-start gap-3.5 bg-surface-container-low/70 p-3 rounded-xl">
          <img
            src={teacherAvatar}
            alt={teacherName}
            className="w-11 h-11 rounded-full object-cover ring-1 ring-outline-variant/60 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-bold text-on-surface text-sm sm:text-base truncate">
                {subjectTitle}
              </h4>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface shrink-0">
                ⏱️ {formattedTime}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              المعلم: <strong className="text-on-surface">{teacherName}</strong>
            </p>
            <p className="text-[11px] text-outline flex items-center gap-1 mt-1 truncate">
              <span className="material-symbols-outlined text-xs text-primary">videocam</span>
              <span>{roomName}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          {/* PRIMARY ACTION: Accent green reserved strictly for joining lesson */}
          <button
            onClick={onOpenClassroom}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">
              sensors
            </span>
            <span>دخول الفصل الافتراضي الآن</span>
          </button>

          <button
            onClick={() => alert('تم فحص الكاميرا والميكروفون بنجاح! جميع الأجهزة جاهزة للبث المباشر.')}
            className="w-full sm:w-auto py-2.5 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm text-primary">mic</span>
            <span>فحص الصوت</span>
          </button>
        </div>

        {/* Notification Channel Meta footer */}
        <div className="mt-2.5 pt-2 border-t border-outline-variant/40 flex items-center justify-between text-[11px] text-outline">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-xs text-primary">check_circle</span>
            <span>تم إرسال الرابط المباشر أيضاً عبر رسائل واتساب والـ SMS</span>
          </span>
          <button
            onClick={() => setIsMinimized(true)}
            className="hover:text-primary underline cursor-pointer"
          >
            تصغير
          </button>
        </div>
      </div>
    </div>
  );
};
