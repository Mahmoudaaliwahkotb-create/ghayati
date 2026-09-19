import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { STUDENT_USER } from '../data/mockData';

interface TopNavBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenBookingModal: () => void;
  walletBalance: number;
  onOpenClassroom?: () => void;
  onTriggerFifteenMinAlert?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBookingModal,
  walletBalance,
  onOpenClassroom,
  onTriggerFifteenMinAlert
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-margin flex items-center justify-between h-20 rtl:flex-row-reverse">
        {/* Right side in RTL: Brand Logo & Navigation */}
        <div className="flex items-center gap-space-xl">
          <button
            onClick={() => setActiveTab('classes')}
            className="text-headline-md font-headline-md text-primary font-bold tracking-tight flex items-center gap-2 text-right cursor-pointer"
          >
            <span className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                school
              </span>
            </span>
            <span className="hover:opacity-90 transition-opacity">غايتي | Ghayati</span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-space-lg pt-1">
            <button
              onClick={() => setActiveTab('classes')}
              className={`pb-1 flex items-center gap-1.5 transition-colors duration-150 cursor-pointer ${
                activeTab === 'classes' || activeTab === 'booking_confirmed'
                  ? 'border-b-2 border-primary text-primary font-title text-title'
                  : 'text-on-surface-variant font-body-md text-body-md hover:text-primary'
              }`}
            >
              <span>فصولي</span>
              {(activeTab === 'classes' || activeTab === 'booking_confirmed') && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('teachers')}
              className={`pb-1 flex items-center gap-1.5 transition-colors duration-150 cursor-pointer ${
                activeTab === 'teachers' || activeTab === 'teacher_profile'
                  ? 'border-b-2 border-primary text-primary font-title text-title'
                  : 'text-on-surface-variant font-body-md text-body-md hover:text-primary'
              }`}
            >
              <span>معلمو المواد</span>
              {(activeTab === 'teachers' || activeTab === 'teacher_profile') && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`pb-1 flex items-center gap-1.5 transition-colors duration-150 cursor-pointer ${
                activeTab === 'reports'
                  ? 'border-b-2 border-primary text-primary font-title text-title'
                  : 'text-on-surface-variant font-body-md text-body-md hover:text-primary'
              }`}
            >
              <span>تقاريري</span>
              {activeTab === 'reports' && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`pb-1 flex items-center gap-1.5 transition-colors duration-150 cursor-pointer ${
                activeTab === 'wallet'
                  ? 'border-b-2 border-primary text-primary font-title text-title'
                  : 'text-on-surface-variant font-body-md text-body-md hover:text-primary'
              }`}
            >
              <span>محفظتي</span>
              {activeTab === 'wallet' && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
              )}
              {walletBalance > 0 && (
                <span className="bg-surface-container-high text-on-surface px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {walletBalance} ج.م
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('chatbot')}
              className={`pb-1 flex items-center gap-1.5 transition-colors duration-150 cursor-pointer ${
                activeTab === 'chatbot'
                  ? 'border-b-2 border-primary text-primary font-title text-title'
                  : 'text-on-surface-variant font-body-md text-body-md hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-base text-primary">smart_toy</span>
              <span>غايتي AI</span>
              <span className="px-1.5 py-0.2 rounded-full bg-primary/10 text-primary text-[10px] font-bold">Gemini</span>
              {activeTab === 'chatbot' && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
              )}
            </button>
          </nav>
        </div>

        {/* Center Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-xs mx-space-lg">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن مادة، معلم، أو مهارة..."
              className="w-full h-11 pr-10 pl-4 bg-surface-container-low border border-outline-variant rounded-xl text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-right transition-all"
            />
            <span className="material-symbols-outlined absolute right-3 top-3 text-outline text-xl pointer-events-none">
              search
            </span>
          </div>
        </div>

        {/* Left Side: Actions & Profile */}
        <div className="flex items-center gap-3.5">
          {/* Notifications button with popover */}
          <div className="relative">
            <button
              aria-label="الإشعارات"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center relative active:scale-95 duration-150 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-primary"></span>
            </button>

            {showNotifications && (
              <div className="absolute left-0 mt-2 w-96 max-w-[90vw] bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl p-4 z-50 text-right animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2.5 border-b border-outline-variant/60 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                    <span className="text-title font-title text-on-surface font-bold">التنبيهات الأكاديمية</span>
                  </div>
                  <span className="text-label-sm font-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-semibold">
                    تنبيه مباشر
                  </span>
                </div>

                <div className="space-y-3 text-body-sm font-body-sm max-h-[70vh] overflow-y-auto pr-1">
                  {/* Priority 15-min Smart Alert Item */}
                  <div className="p-3.5 rounded-2xl bg-surface-container-low/70 border border-outline-variant relative overflow-hidden space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        <span className="material-symbols-outlined text-xs">alarm</span>
                        <span>متبقي 15 دقيقة على البدء</span>
                      </span>
                      <span className="text-[11px] text-outline">اليوم 05:30 م</span>
                    </div>

                    <div>
                      <p className="font-bold text-on-surface text-sm">حصة الرياضيات المباشرة: الجبر والهندسة</p>
                      <p className="text-on-surface-variant text-xs mt-0.5">مع أ. محمود الكردي • استوديو غايتي HD (القاعة 101)</p>
                    </div>

                    {/* Quick Action Button to Virtual Classroom - PRIMARY ACTION KEEP GREEN */}
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          if (onOpenClassroom) onOpenClassroom();
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">video_camera_front</span>
                        <span>دخول الفصل الافتراضي الآن</span>
                      </button>

                      {onTriggerFifteenMinAlert && (
                        <button
                          onClick={() => {
                            setShowNotifications(false);
                            onTriggerFifteenMinAlert();
                          }}
                          className="p-2 rounded-xl border border-outline-variant hover:border-primary text-on-surface-variant text-xs"
                          title="إظهار لافتة التنبيه العائمة"
                        >
                          <span className="material-symbols-outlined text-base">campaign</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Standard Academic Notifications */}
                  <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
                    <div className="flex items-center justify-between text-xs text-outline mb-1">
                      <span>تأكيد حجز جديد</span>
                      <span>أمس</span>
                    </div>
                    <p className="font-bold text-on-surface text-xs sm:text-sm">حصة تجريبية مجانية: اللغة العربية</p>
                    <p className="text-on-surface-variant text-xs mt-0.5">تم تأكيد الموعد مع أ. إبراهيم الدسوقي ليوم الأحد القادم.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
                    <div className="flex items-center justify-between text-xs text-outline mb-1">
                      <span>تقارير التحصيل</span>
                      <span>منذ يومين</span>
                    </div>
                    <p className="font-bold text-on-surface text-xs sm:text-sm">صدر تقرير مارس لأميرة محمد</p>
                    <p className="text-on-surface-variant text-xs mt-0.5">تحسن ملحوظ بنسبة +26% في استيعاب مفاهيم الرياضيات.</p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-outline-variant/50 flex items-center justify-between text-[11px] text-outline">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-secondary">notifications_active</span>
                    <span>التنبيهات التلقائية مفعلة (واتساب + SMS)</span>
                  </span>
                  <button
                    onClick={() => alert('إعدادات الإشعارات: يمكنك تخصيص وقت التنبيه (15 دقيقة أو 30 دقيقة قبل الحصة).')}
                    className="text-primary hover:underline cursor-pointer"
                  >
                    تخصيص
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-outline-variant/60 hidden sm:block"></div>

          {/* Primary CTA: Book Trial Class */}
          <button
            onClick={onOpenBookingModal}
            className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md shadow hover:bg-on-secondary-container active:scale-95 transition-all cursor-pointer font-bold gap-1"
          >
            <span className="material-symbols-outlined text-lg">calendar_add_on</span>
            <span>احجز حصة تجريبية</span>
          </button>

          {/* User Profile Avatar Pill */}
          <div className="relative">
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 pr-1.5 pl-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/60 hover:border-primary cursor-pointer transition-all"
            >
              <img
                src={STUDENT_USER.avatar}
                alt="صورة الملف الشخصي"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-surface-container-lowest"
              />
              <div className="hidden sm:block text-right">
                <p className="text-label-md font-label-md text-on-surface font-semibold leading-tight">
                  {STUDENT_USER.name}
                </p>
                <p className="text-label-sm font-label-sm text-outline">
                  {STUDENT_USER.role}
                </p>
              </div>
              <span className="material-symbols-outlined text-outline text-base">expand_more</span>
            </div>

            {showProfileMenu && (
              <div className="absolute left-0 mt-2 w-64 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl p-3 z-50 text-right animate-in fade-in slide-in-from-top-2">
                <div className="pb-2.5 border-b border-outline-variant/60 mb-2">
                  <p className="font-bold text-on-surface">{STUDENT_USER.name}</p>
                  <p className="text-label-sm font-label-sm text-on-surface-variant">حساب العائلة المسجل</p>
                  <p className="text-[11px] text-secondary font-semibold mt-1">الطالبة: {STUDENT_USER.studentName} ({STUDENT_USER.grade})</p>
                </div>
                <div className="space-y-1 text-body-sm font-body-sm text-on-surface-variant">
                  <button
                    onClick={() => { setActiveTab('reports'); setShowProfileMenu(false); }}
                    className="w-full text-right p-2 rounded-lg hover:bg-surface-container-low hover:text-primary flex items-center justify-between"
                  >
                    <span>تقرير تقدم أميرة</span>
                    <span className="material-symbols-outlined text-base">insights</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('wallet'); setShowProfileMenu(false); }}
                    className="w-full text-right p-2 rounded-lg hover:bg-surface-container-low hover:text-primary flex items-center justify-between"
                  >
                    <span>رصيد المحفظة والمدفوعات</span>
                    <span className="material-symbols-outlined text-base">account_balance_wallet</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('classes'); setShowProfileMenu(false); }}
                    className="w-full text-right p-2 rounded-lg hover:bg-surface-container-low hover:text-primary flex items-center justify-between"
                  >
                    <span>فصولي وحصص الأسبوع</span>
                    <span className="material-symbols-outlined text-base">school</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('chatbot'); setShowProfileMenu(false); }}
                    className="w-full text-right p-2 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary font-bold flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">smart_toy</span>
                      <span>غايتي AI (Gemini)</span>
                    </span>
                    <span className="material-symbols-outlined text-base">auto_awesome</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
