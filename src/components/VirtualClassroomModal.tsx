import React, { useState } from 'react';

interface VirtualClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectTitle?: string;
  teacherName?: string;
  teacherAvatar?: string;
}

export const VirtualClassroomModal: React.FC<VirtualClassroomModalProps> = ({
  isOpen,
  onClose,
  subjectTitle = 'الرياضيات: الجبر والهندسة التحليلية',
  teacherName = 'أ. محمود الكردي',
  teacherAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUsy9WyJZVlgaHdIpBmViL47B5u2Is50dCZvlJqcQ9x0-Hq74uBeo4Jov6_GyGLiEn6NAHy31s6gCUjOundidI9AbPNCiwGTBgFefKls67LcnYGMl47zi9yJQC_qaZ4Otz2TL8i_fF0BEeznfHRtOoIaTCK27gxdi0AAqONhsAMXos2_nlqOIhGPPuXVlIT9maYzYQyugnRVkTxNi7CMSUfdl2G5WLCrJ9pnqBELIVz76B2fJu3Y8GMA'
}) => {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'notes' | 'students'>('chat');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string; isTeacher?: boolean }>>([
    { sender: 'أ. محمود الكردي', text: 'أهلاً بكم يا أبطال في حصة اليوم! سنبدأ خلال دقيقتين بحل تمارين معادلات الدرجة الثانية.', time: '05:28 م', isTeacher: true },
    { sender: 'أميرة محمد', text: 'السلام عليكم يا مستر، جهزت كشكول التمارين وبانتظار بدء الشرح.', time: '05:29 م' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: 'أميرة محمد', text: inputMessage.trim(), time: '05:30 م' }
    ]);
    setInputMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-6xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-right text-slate-100">
        {/* Classroom Header Bar */}
        <header className="bg-slate-800/90 border-b border-slate-700/80 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white">{subjectTitle}</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hidden sm:inline-block">
                  بث مباشر HD
                </span>
              </div>
              <p className="text-xs text-slate-400">
                المعلم: <strong className="text-slate-200">{teacherName}</strong> • الحضور: ٦ طلاب • الجودة: 1080p (24ms)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('تم تفعيل وضع ملء الشاشة للقاعة')}
              className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 transition-colors"
              title="ملء الشاشة"
            >
              <span className="material-symbols-outlined text-lg">fullscreen</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">call_end</span>
              <span>مغادرة الفصل</span>
            </button>
          </div>
        </header>

        {/* Main Stage Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Main Video & Whiteboard Stage (8 cols on lg) */}
          <div className="lg:col-span-8 bg-slate-950 p-3 sm:p-4 flex flex-col justify-between relative overflow-hidden">
            {/* Whiteboard / Presentation Canvas */}
            <div className="flex-1 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/60 p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden">
              {/* Teacher Feed PIP in top corner */}
              <div className="absolute top-4 left-4 w-32 sm:w-44 aspect-video rounded-xl bg-slate-950 border-2 border-emerald-500/60 shadow-lg overflow-hidden flex flex-col justify-between p-2">
                <img
                  src={teacherAvatar}
                  alt={teacherName}
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div className="relative z-10 flex justify-between items-center text-[10px] text-white">
                  <span className="bg-black/60 px-1.5 py-0.5 rounded backdrop-blur font-bold truncate max-w-[80px]">
                    {teacherName}
                  </span>
                  <span className="material-symbols-outlined text-xs text-emerald-400">mic</span>
                </div>
              </div>

              {/* Whiteboard Content */}
              <div className="max-w-md my-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                  <span className="material-symbols-outlined text-sm">draw</span>
                  <span>السبورة التفاعلية الذكية</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                  الوحدة الثانية: تطبيقات حل معادلة الدرجة الثانية في متغير واحد بيانيّاً
                </h4>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 text-sm space-y-2 font-mono">
                  <p className="text-emerald-400 font-bold">f(x) = ax² + bx + c</p>
                  <p className="text-slate-300">نقطة رأس المنحنى = (-b / 2a , f(-b / 2a))</p>
                  <p className="text-amber-300 text-xs">المميز Δ = b² - 4ac (يحدد عدد الحلول الحقيقية)</p>
                </div>
              </div>

              {/* Student Pip (Self camera) */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>أنت تشارك الآن (أميرة محمد) • الكاميرا: {isCamOn ? 'مفتوحة' : 'مغلقة'}</span>
                </div>
                {isHandRaised && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1 animate-bounce">
                    <span>✋ تم رفع اليد لطلب المداخلة</span>
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Stream Controls Bar */}
            <div className="mt-3 py-2 px-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center gap-3 sm:gap-4 shrink-0">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-full transition-all cursor-pointer ${
                  isMicOn ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
                title={isMicOn ? 'كتم الميكروفون' : 'تشغيل الميكروفون'}
              >
                <span className="material-symbols-outlined text-xl">
                  {isMicOn ? 'mic' : 'mic_off'}
                </span>
              </button>

              <button
                onClick={() => setIsCamOn(!isCamOn)}
                className={`p-3 rounded-full transition-all cursor-pointer ${
                  isCamOn ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
                title={isCamOn ? 'إيقاف الكاميرا' : 'تشغيل الكاميرا'}
              >
                <span className="material-symbols-outlined text-xl">
                  {isCamOn ? 'videocam' : 'videocam_off'}
                </span>
              </button>

              <button
                onClick={() => setIsHandRaised(!isHandRaised)}
                className={`p-3 rounded-full transition-all cursor-pointer ${
                  isHandRaised ? 'bg-amber-500 text-slate-950 font-bold ring-2 ring-amber-300' : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
                title="رفع اليد للمشاركة"
              >
                <span className="material-symbols-outlined text-xl">pan_tool</span>
              </button>

              <button
                onClick={() => alert('جاري مشاركة الشاشة مع المعلم')}
                className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-all cursor-pointer hidden sm:inline-flex"
                title="مشاركة الشاشة"
              >
                <span className="material-symbols-outlined text-xl">screen_share</span>
              </button>

              <div className="h-6 w-px bg-slate-700 mx-1"></div>

              <button
                onClick={() => alert('جاري تحميل مذكرة درس اليوم (PDF)')}
                className="px-3.5 py-2 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">download</span>
                <span>المذكرة</span>
              </button>
            </div>
          </div>

          {/* Right/Sidebar: Interactive Chat & Attendees (4 cols on lg) */}
          <div className="lg:col-span-4 bg-slate-900 border-t lg:border-t-0 lg:border-r border-slate-800 flex flex-col overflow-hidden">
            {/* Tab navigation */}
            <div className="flex items-center border-b border-slate-800 bg-slate-950/60 p-1">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'chat' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-base">chat</span>
                <span>محادثة القاعة</span>
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'students' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-base">group</span>
                <span>الزملاء (٦)</span>
              </button>
            </div>

            {/* Tab Content: Chat */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden p-3">
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl ${
                        msg.isTeacher
                          ? 'bg-emerald-950/60 border border-emerald-800/40 text-emerald-100'
                          : msg.sender === 'أميرة محمد'
                          ? 'bg-blue-950/60 border border-blue-800/40 text-blue-100 mr-4'
                          : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold">{msg.sender}</span>
                        <span className="text-[10px] opacity-60">{msg.time}</span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="mt-2 pt-2 border-t border-slate-800 flex gap-1.5">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="اكتب سؤالاً أو استفساراً للمعلم..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    إرسال
                  </button>
                </form>
              </div>
            )}

            {/* Tab Content: Students List */}
            {activeTab === 'students' && (
              <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-800/70 border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={teacherAvatar} alt={teacherName} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-white">{teacherName}</p>
                      <p className="text-[10px] text-emerald-400">المعلم (مقدم الجلسة)</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-emerald-400 text-sm">mic</span>
                </div>

                <div className="p-2 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">أ</div>
                    <div>
                      <p className="font-bold text-white">أميرة محمد (أنتِ)</p>
                      <p className="text-[10px] text-blue-300">طالبة</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-sm">mic_off</span>
                </div>

                {['سارة يوسف', 'كريم عادل', 'ياسين أحمد', 'مريم خالد'].map((name, i) => (
                  <div key={i} className="p-2 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center font-bold">{name[0]}</div>
                      <div>
                        <p className="font-bold text-slate-200">{name}</p>
                        <p className="text-[10px] text-slate-400">طالب في المجموعة</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-500 text-sm">mic_off</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
