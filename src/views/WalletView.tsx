import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface WalletTransaction {
  id: string;
  type: 'recharge' | 'subscription' | 'refund';
  amount: number;
  date: string;
  method: string;
  status: 'completed' | 'pending';
}

interface WalletViewProps {
  walletBalance: number;
  transactions: WalletTransaction[];
  onOpenRechargeModal: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  walletBalance,
  transactions,
  onOpenRechargeModal,
  setActiveTab
}) => {
  const [filterType, setFilterType] = useState<'all' | 'recharge' | 'subscription' | 'refund'>('all');

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  return (
    <div className="w-full text-right">
      {/* Breadcrumbs & Navigation Header */}
      <Breadcrumbs
        onBack={() => setActiveTab('classes')}
        backLabel="العودة إلى فصولي"
        items={[
          {
            label: 'فصولي (الرئيسية)',
            icon: 'home',
            onClick: () => setActiveTab('classes')
          },
          {
            label: 'إدارة الحساب',
            onClick: () => setActiveTab('classes')
          },
          {
            label: 'محفظتي والرصيد',
            isCurrent: true
          }
        ]}
      />

      {/* Main Canvas */}
      <main className="w-full max-w-7xl mx-auto px-margin py-space-md flex-1 space-y-space-xl">
        {/* Title and Subtitle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div>
            <h1 className="text-headline-lg font-headline-lg text-on-surface font-bold">إدارة المحفظة والرصيد</h1>
            <p className="text-body-md font-body-md text-on-surface-variant mt-1">
              تتبع رصيدك التعليمي، واشحن باقات الحصص، وأدر مدفوعاتك بكل سهولة وأمان.
            </p>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container-low px-4 py-2 rounded-full text-secondary font-label-md text-label-md border border-secondary-container self-start md:self-auto font-bold">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
            <span>حساب موثق ومحمي بتقنية التشفير المالي 256-bit</span>
          </div>
        </div>

        {/* 1. Balance Summary Card */}
        <section className="relative overflow-hidden bg-surface-container-lowest border border-outline-variant rounded-2xl p-space-lg shadow-sm transition-all hover:border-outline">
          {/* Soft Brand Backdrop Accent & Delicate Security Watermark */}
          <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-secondary-fixed/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute left-6 top-6 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-9xl text-primary">lock</span>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Balance Info (8 Cols) */}
            <div className="lg:col-span-8 space-y-space-md">
              <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md font-bold">
                <span className="material-symbols-outlined text-primary text-xl">account_balance_wallet</span>
                <span>الرصيد المتاح بالمحفظة</span>
                <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse mr-1"></span>
              </div>

              {/* Currency & Figure Display */}
              <div className="flex items-baseline gap-space-sm rtl:space-x-reverse">
                <span className="text-display font-display text-primary tracking-tight font-bold">
                  {walletBalance.toFixed(2)}
                </span>
                <span className="text-headline-sm font-headline-sm text-on-surface-variant font-semibold">ج.م</span>
                <span className="text-body-sm font-body-sm text-outline mr-2">(جنيه مصري)</span>
              </div>

              {/* Promotional Rewards Callout Container */}
              <div className="inline-flex flex-wrap items-center gap-space-sm bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5">
                <span className="material-symbols-outlined text-tertiary-container text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  redeem
                </span>
                <span className="font-title text-on-surface text-body-md">
                  رصيد المكافآت الترويجية: <strong className="text-primary font-bold">50.00 ج.م</strong>
                </span>
                <span className="text-body-sm text-on-surface-variant bg-surface-container-lowest px-2 py-0.5 rounded-md border border-outline-variant/40 font-semibold">
                  تُخصم تلقائياً عند أول حجز
                </span>
              </div>

              {/* Reassurance Badge */}
              <div className="flex items-center gap-space-xs text-secondary text-body-sm font-body-sm pt-space-xs font-bold">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span>دفع آمن 100% ومسترد في حال عدم الرضا عن أول حصة.</span>
              </div>
            </div>

            {/* Recharge CTA & Methods (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col items-stretch justify-center bg-surface-container-low/60 rounded-xl p-space-md border border-outline-variant/70 space-y-space-md">
              <div className="text-right">
                <span className="text-label-md font-label-md text-on-surface font-bold block">جاهز لحجز الحصص القادمة؟</span>
                <span className="text-body-sm font-body-sm text-on-surface-variant">اشحن رصيدك لتأكيد حجز معلمك المفضل فوراً</span>
              </div>

              {/* Primary Recharge Button */}
              <button
                onClick={onOpenRechargeModal}
                className="w-full inline-flex items-center justify-center gap-space-xs px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-title text-title transition-all duration-150 shadow-sm active:scale-95 group cursor-pointer font-bold"
                type="button"
              >
                <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform duration-200">
                  add_circle
                </span>
                <span>شحن المحفظة الآن +</span>
              </button>

              {/* Accepted Payment Methods */}
              <div className="pt-space-xs border-t border-outline-variant/50">
                <span className="text-label-sm font-label-sm text-outline block mb-2 text-right">وسائل الدفع المقبولة والمعتمدة:</span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-lg py-1.5 px-1 flex flex-col items-center justify-center hover:border-primary transition-colors">
                    <span className="text-label-sm font-bold text-primary">فوري</span>
                    <span className="text-[9px] text-outline">Fawry</span>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-lg py-1.5 px-1 flex flex-col items-center justify-center hover:border-primary transition-colors">
                    <span className="text-label-sm font-bold text-on-surface">فيزا / ماستر</span>
                    <span className="text-[9px] text-outline">Cards</span>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-lg py-1.5 px-1 flex flex-col items-center justify-center hover:border-primary transition-colors">
                    <span className="text-label-sm font-bold text-secondary">ميزة</span>
                    <span className="text-[9px] text-outline">Meeza</span>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-lg py-1.5 px-1 flex flex-col items-center justify-center hover:border-primary transition-colors">
                    <span className="text-label-sm font-bold text-error">محافظ ذكية</span>
                    <span className="text-[9px] text-outline">Wallets</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Transactions Section with Empty or Loaded State */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-space-lg shadow-sm">
          {/* Section Header with Filter Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md border-b border-outline-variant pb-space-md mb-space-lg">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-2xl">receipt_long</span>
              <h2 className="text-headline-sm font-headline-sm text-on-surface font-bold">سجل العمليات والمدفوعات الأخيرة</h2>
            </div>

            {/* Filter Chips Rail */}
            <div className="flex items-center gap-space-xs overflow-x-auto pb-1 rtl:flex-row-reverse">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-1.5 rounded-full text-label-md font-label-md transition-colors whitespace-nowrap cursor-pointer font-bold ${
                  filterType === 'all'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface border border-outline-variant text-on-surface-variant hover:text-primary'
                }`}
                type="button"
              >
                الكل
              </button>
              <button
                onClick={() => setFilterType('recharge')}
                className={`px-4 py-1.5 rounded-full text-label-md font-label-md transition-colors whitespace-nowrap cursor-pointer font-bold ${
                  filterType === 'recharge'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface border border-outline-variant text-on-surface-variant hover:text-primary'
                }`}
                type="button"
              >
                عمليات الشحن
              </button>
              <button
                onClick={() => setFilterType('subscription')}
                className={`px-4 py-1.5 rounded-full text-label-md font-label-md transition-colors whitespace-nowrap cursor-pointer font-bold ${
                  filterType === 'subscription'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface border border-outline-variant text-on-surface-variant hover:text-primary'
                }`}
                type="button"
              >
                اشتراكات الدروس
              </button>
              <button
                onClick={() => setFilterType('refund')}
                className={`px-4 py-1.5 rounded-full text-label-md font-label-md transition-colors whitespace-nowrap cursor-pointer font-bold ${
                  filterType === 'refund'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface border border-outline-variant text-on-surface-variant hover:text-primary'
                }`}
                type="button"
              >
                المبالغ المستردة
              </button>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            /* Empty State Container */
            <div className="py-space-xl px-space-md flex flex-col items-center justify-center text-center max-w-xl mx-auto">
              <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center mb-space-md relative text-primary">
                <span className="material-symbols-outlined text-5xl">account_balance_wallet</span>
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center text-outline">
                  <span className="material-symbols-outlined text-lg">search_off</span>
                </div>
              </div>

              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-space-xs font-bold">
                لا توجد حركات مالية سابقة حتى الآن
              </h3>
              <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed mb-space-lg">
                عند قيامك بشحن الرصيد أو سداد اشتراكات الدروس مع المعلمين، ستظهر تفاصيل الإيصالات والعمليات هنا بشكل تلقائي وفوري.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-space-sm">
                <button
                  onClick={() => setActiveTab('teachers')}
                  className="inline-flex items-center gap-space-xs px-6 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-title text-body-md border border-primary/20 transition-all active:scale-95 cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-xl">manage_search</span>
                  <span>تصفح قائمة المواد والمعلمين</span>
                </button>
                <button
                  onClick={() => alert('مرحباً بك! فريق الدعم المالي لمنصة غايتي متاح لمساعدتك.')}
                  className="inline-flex items-center gap-space-xs px-4 py-2.5 rounded-xl text-on-surface-variant hover:text-primary font-body-md text-body-md transition-colors cursor-pointer font-bold"
                  type="button"
                >
                  <span className="material-symbols-outlined text-xl">support_agent</span>
                  <span>تواصل مع الدعم المالي</span>
                </button>
              </div>
            </div>
          ) : (
            /* Populated Transactions List */
            <div className="space-y-3">
              {filteredTransactions.map(tx => (
                <div key={tx.id} className="p-4 rounded-xl bg-surface border border-outline-variant/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined">add_circle</span>
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">عملية شحن رصيد ناجحة</p>
                      <p className="text-label-sm text-on-surface-variant">{tx.method} • {tx.date}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-title font-bold text-secondary">+{tx.amount}.00 ج.م</p>
                    <span className="text-label-sm text-secondary bg-secondary/10 px-2 py-0.5 rounded-full font-bold">مكتملة</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3. Fast FAQ & Help Banner */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-space-lg shadow-sm">
          <div className="flex items-center gap-space-xs mb-space-md">
            <span className="material-symbols-outlined text-primary text-2xl">quiz</span>
            <h2 className="text-headline-sm font-headline-sm text-on-surface font-bold">كيف تعمل المحفظة في غايتي؟</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {/* Card 1 */}
            <div className="bg-surface-container-low/50 border border-outline-variant/80 rounded-xl p-space-md flex flex-col justify-between hover:border-primary transition-all duration-150 group">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary mb-space-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">security</span>
                </div>
                <h3 className="text-title font-title text-on-surface mb-space-xs font-bold">١. حجز آمن ومضمون</h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant leading-normal">
                  يُحجز المبلغ في محفظتك الوسيطة ولا يُحوّل إلى المعلم إلا بعد إتمام الحصة وتقييم رضاك الكامل عن التجربة الدراسية.
                </p>
              </div>
              <span className="text-label-sm font-label-sm text-secondary font-bold mt-space-sm inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>ضمان حقوق ولي الأمر</span>
              </span>
            </div>

            {/* Card 2 */}
            <div className="bg-surface-container-low/50 border border-outline-variant/80 rounded-xl p-space-md flex flex-col justify-between hover:border-primary transition-all duration-150 group">
              <div>
                <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary mb-space-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">published_with_changes</span>
                </div>
                <h3 className="text-title font-title text-on-surface mb-space-xs font-bold">٢. مرونة الاسترداد الفوري</h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant leading-normal">
                  إمكانية إلغاء الحصة أو إعادة جدولتها واسترداد كامل الرصيد لمحفظتك خلال 24 ساعة بضغطة زر وبدون أي تعقيدات.
                </p>
              </div>
              <span className="text-label-sm font-label-sm text-secondary font-bold mt-space-sm inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>استرداد تلقائي بدون عمولات</span>
              </span>
            </div>

            {/* Card 3 */}
            <div className="bg-surface-container-low/50 border border-outline-variant/80 rounded-xl p-space-md flex flex-col justify-between hover:border-primary transition-all duration-150 group">
              <div>
                <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary mb-space-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">payments</span>
                </div>
                <h3 className="text-title font-title text-on-surface mb-space-xs font-bold">٣. طرق دفع متعددة وفورية</h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant leading-normal">
                  شحن فوري متوافق مع كافة البنوك المصرية: شبكة فوري عبر أي كشك، بطاقات ميزة الوطنية، والمحافظ الذكية عبر الهاتف.
                </p>
              </div>
              <span className="text-label-sm font-label-sm text-secondary font-bold mt-space-sm inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>شحن برقم هاتفك أو فوري كود</span>
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
