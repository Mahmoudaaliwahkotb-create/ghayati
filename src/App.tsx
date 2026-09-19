import { useState, useEffect } from 'react';
import { ActiveTab, Teacher } from './types';
import { TEACHERS_LIST } from './data/mockData';
import { TopNavBar } from './components/TopNavBar';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { RechargeModal } from './components/RechargeModal';
import { VirtualClassroomModal } from './components/VirtualClassroomModal';
import { SmartClassAlert } from './components/SmartClassAlert';
import { GeminiChatbot } from './components/GeminiChatbot';
import { ClassesHubView } from './views/ClassesHubView';
import { TeachersDirectoryView } from './views/TeachersDirectoryView';
import { TeacherProfileView } from './views/TeacherProfileView';
import { BookingConfirmedView } from './views/BookingConfirmedView';
import { StudentReportView } from './views/StudentReportView';
import { WalletView } from './views/WalletView';
import { GeminiChatView } from './views/GeminiChatView';

interface WalletTransaction {
  id: string;
  type: 'recharge' | 'subscription' | 'refund';
  amount: number;
  date: string;
  method: string;
  status: 'completed' | 'pending';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('classes');
  const [previousTab, setPreviousTab] = useState<ActiveTab>('classes');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher>(TEACHERS_LIST[0]);

  const handleNavigateTab = (tab: ActiveTab) => {
    if (tab !== activeTab) {
      setPreviousTab(activeTab);
      setActiveTab(tab);
    }
  };
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<number>(0.0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  // Smart 15-minute Notification & Virtual Classroom States
  const [isFifteenMinAlertOpen, setIsFifteenMinAlertOpen] = useState<boolean>(true);
  const [isVirtualClassroomOpen, setIsVirtualClassroomOpen] = useState<boolean>(false);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState<boolean>(false);
  const [classroomDetails, setClassroomDetails] = useState<{ subjectTitle: string; teacherName: string }>({
    subjectTitle: 'الرياضيات: الجبر والهندسة التحليلية',
    teacherName: 'أ. محمود الكردي'
  });

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleOpenBookingModal = (teacher?: Teacher) => {
    if (teacher) {
      setSelectedTeacher(teacher);
    }
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = () => {
    setIsBookingModalOpen(false);
    setActiveTab('booking_confirmed');
  };

  const handleOpenClassroom = (subjectTitle?: string, teacherName?: string) => {
    if (subjectTitle || teacherName) {
      setClassroomDetails({
        subjectTitle: subjectTitle || 'الرياضيات: الجبر والهندسة التحليلية',
        teacherName: teacherName || 'أ. محمود الكردي'
      });
    }
    setIsVirtualClassroomOpen(true);
  };

  const handleTriggerFifteenMinAlert = () => {
    setIsFifteenMinAlertOpen(true);
  };

  const handleRechargeSuccess = (amount: number, method: string) => {
    setWalletBalance((prev) => prev + amount);
    const newTx: WalletTransaction = {
      id: `TX-${Date.now().toString().slice(-6)}`,
      type: 'recharge',
      amount,
      date: 'اليوم، ' + new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      method,
      status: 'completed'
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-background text-on-surface antialiased">
      {/* Top Application Bar with Notifications Menu */}
      <TopNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBookingModal={() => handleOpenBookingModal()}
        walletBalance={walletBalance}
        onOpenClassroom={() => handleOpenClassroom()}
        onTriggerFifteenMinAlert={handleTriggerFifteenMinAlert}
      />

      {/* Quick Interactive Screen Switcher Bar for Seamless Showcase */}
      <div className="bg-surface-container border-b border-outline-variant/60 py-2 sticky top-20 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-margin flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0 text-label-md font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary text-base">dashboard_customize</span>
            <span className="hidden sm:inline">تنقل سريع بين الشاشات:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setActiveTab('classes')}
              className={`px-3 py-1 rounded-lg text-label-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'classes'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              ١. فصولي (الرئيسية)
            </button>

            <button
              onClick={() => setActiveTab('teachers')}
              className={`px-3 py-1 rounded-lg text-label-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'teachers'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              ٢. قائمة معلمي اللغة العربية
            </button>

            <button
              onClick={() => setActiveTab('teacher_profile')}
              className={`px-3 py-1 rounded-lg text-label-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'teacher_profile'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              ٣. الملف الشخصي للمعلم
            </button>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-3 py-1 rounded-lg text-label-sm font-bold transition-all cursor-pointer whitespace-nowrap bg-secondary text-on-secondary hover:bg-on-secondary-fixed-variant shadow-xs flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">event_available</span>
              <span>٤. نافذة حجز الحصة التجريبية</span>
            </button>

            <button
              onClick={() => setActiveTab('booking_confirmed')}
              className={`px-3 py-1 rounded-lg text-label-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'booking_confirmed'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              ٥. تم تأكيد الحجز ومتابعة الموعد
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-1 rounded-lg text-label-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              ٦. تقرير تقدم الطالبة (الرياضيات)
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`px-3 py-1 rounded-lg text-label-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'wallet'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              ٧. محفظتي والرصيد
            </button>

            {/* Gemini AI Chat View Button */}
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`px-3 py-1 rounded-lg text-label-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'chatbot'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30'
              }`}
            >
              <span className="material-symbols-outlined text-xs text-secondary animate-pulse">smart_toy</span>
              <span>٨. روبوت المحادثة غايتي AI (Gemini)</span>
            </button>

            {/* Smart 15-Minute Alert Demo Trigger */}
            <button
              onClick={handleTriggerFifteenMinAlert}
              className="px-3 py-1 rounded-lg text-label-sm font-bold transition-all cursor-pointer whitespace-nowrap bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1"
              title="تفعيل إشعار قبل الحصة بـ 15 دقيقة مع زر الدخول السريع"
            >
              <span className="material-symbols-outlined text-xs animate-pulse">alarm</span>
              <span>إشعار الـ 15 دقيقة الذكي</span>
            </button>

            {/* Direct Virtual Classroom Trigger */}
            <button
              onClick={() => handleOpenClassroom()}
              className="px-3 py-1 rounded-lg text-label-sm font-bold transition-all cursor-pointer whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1"
              title="فتح رابط الفصل الافتراضي التفاعلي"
            >
              <span className="material-symbols-outlined text-xs">video_camera_front</span>
              <span>الفصل الافتراضي</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area Rendering Selected View */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'classes' && (
          <ClassesHubView
            setActiveTab={handleNavigateTab}
            setSelectedTeacher={setSelectedTeacher}
            onOpenBookingModal={handleOpenBookingModal}
            onOpenClassroom={handleOpenClassroom}
            onTriggerFifteenMinAlert={handleTriggerFifteenMinAlert}
          />
        )}

        {activeTab === 'teachers' && (
          <TeachersDirectoryView
            setActiveTab={handleNavigateTab}
            setSelectedTeacher={setSelectedTeacher}
            onOpenBookingModal={handleOpenBookingModal}
          />
        )}

        {activeTab === 'teacher_profile' && (
          <TeacherProfileView
            teacher={selectedTeacher}
            setActiveTab={handleNavigateTab}
            onOpenBookingModal={handleOpenBookingModal}
            previousTab={previousTab}
          />
        )}

        {activeTab === 'booking_confirmed' && (
          <BookingConfirmedView
            setActiveTab={handleNavigateTab}
            onOpenBookingModal={() => handleOpenBookingModal()}
          />
        )}

        {activeTab === 'reports' && (
          <StudentReportView
            setActiveTab={handleNavigateTab}
            onOpenBookingModal={() => handleOpenBookingModal()}
          />
        )}

        {activeTab === 'wallet' && (
          <WalletView
            walletBalance={walletBalance}
            transactions={transactions}
            onOpenRechargeModal={() => setIsRechargeModalOpen(true)}
            setActiveTab={handleNavigateTab}
          />
        )}

        {activeTab === 'chatbot' && (
          <GeminiChatView setActiveTab={handleNavigateTab} />
        )}
      </div>

      {/* Shared Footer Component */}
      <Footer />

      {/* Floating Action Button to launch Gemini Chatbot anywhere */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsFloatingChatOpen(!isFloatingChatOpen)}
          className="flex items-center gap-2 px-4 py-3 bg-primary hover:bg-on-primary-fixed-variant text-on-primary rounded-full shadow-2xl hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/20"
          title="محادثة غايتي AI (Gemini)"
        >
          <span className="material-symbols-outlined text-2xl">smart_toy</span>
          <span className="font-bold text-xs sm:text-sm">مساعد غايتي AI</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      </div>

      {/* Floating Gemini Chatbot Window */}
      <GeminiChatbot
        isOpen={isFloatingChatOpen}
        onClose={() => setIsFloatingChatOpen(false)}
        isFloating={true}
      />

      {/* Smart 15-Minute Alert Toast / Floating Banner */}
      <SmartClassAlert
        isOpen={isFifteenMinAlertOpen}
        onClose={() => setIsFifteenMinAlertOpen(false)}
        onOpenClassroom={() => handleOpenClassroom(classroomDetails.subjectTitle, classroomDetails.teacherName)}
        subjectTitle={classroomDetails.subjectTitle}
        teacherName={classroomDetails.teacherName}
      />

      {/* Interactive Virtual Classroom Modal */}
      <VirtualClassroomModal
        isOpen={isVirtualClassroomOpen}
        onClose={() => setIsVirtualClassroomOpen(false)}
        subjectTitle={classroomDetails.subjectTitle}
        teacherName={classroomDetails.teacherName}
      />

      {/* Interactive Booking Modal Dialog */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={handleConfirmBooking}
        selectedTeacher={selectedTeacher}
      />

      {/* Interactive Wallet Recharge Modal Dialog */}
      <RechargeModal
        isOpen={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
        onRechargeSuccess={handleRechargeSuccess}
      />
    </div>
  );
}
