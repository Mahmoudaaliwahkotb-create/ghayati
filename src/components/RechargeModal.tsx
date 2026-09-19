import React, { useState } from 'react';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRechargeSuccess: (amount: number, method: string) => void;
}

export const RechargeModal: React.FC<RechargeModalProps> = ({
  isOpen,
  onClose,
  onRechargeSuccess
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(250);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<'fawry' | 'cards' | 'meeza' | 'wallets'>('cards');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleRecharge = () => {
    if (finalAmount <= 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const methodLabels = {
        fawry: 'شبكة فوري (Fawry)',
        cards: 'بطاقة ائتمان / فيزا وماستركارد',
        meeza: 'بطاقة ميزة الوطنية',
        wallets: 'محفظة ذكية (فودافون كاش / إنستاباي)'
      };
      onRechargeSuccess(finalAmount, methodLabels[selectedMethod]);
      onClose();
    }, 800);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm transition-opacity"
    >
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant overflow-hidden text-right animate-in zoom-in-95 duration-200">
        <div className="h-1.5 w-full bg-gradient-to-l from-primary to-secondary"></div>

        <div className="p-space-lg md:p-space-xl space-y-space-lg">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
            <div className="flex items-center gap-2">
              <span className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
              </span>
              <div>
                <h3 className="text-title font-title text-on-surface font-bold">شحن رصيد المحفظة</h3>
                <p className="text-body-sm text-on-surface-variant">رصيد فوري وآمن لحجز الحصص والاشتراكات</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Amount Presets */}
          <div className="space-y-2">
            <label className="text-body-md font-semibold text-on-surface">اختر مبلغ الشحن (بالجنيه المصري):</label>
            <div className="grid grid-cols-4 gap-2">
              {[100, 250, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount('');
                  }}
                  className={`py-2.5 px-2 rounded-xl text-title font-bold transition-all ${
                    selectedAmount === amt && !customAmount
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-low border border-outline-variant hover:border-primary text-on-surface'
                  }`}
                >
                  {amt} <span className="text-[12px] font-normal">ج.م</span>
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="pt-2">
              <input
                type="number"
                placeholder="أو اكتب مبلغاً مخصصاً..."
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                }}
                className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-surface text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:outline-none text-right"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-body-md font-semibold text-on-surface">طريقة الدفع المفضلة:</label>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Cards */}
              <label
                onClick={() => setSelectedMethod('cards')}
                className={`p-3 rounded-xl border-2 flex items-center gap-2 cursor-pointer transition-all ${
                  selectedMethod === 'cards'
                    ? 'border-primary bg-surface-container-low'
                    : 'border-outline-variant/80 bg-surface'
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  checked={selectedMethod === 'cards'}
                  onChange={() => setSelectedMethod('cards')}
                  className="text-primary"
                />
                <div>
                  <p className="text-body-md font-bold text-on-surface">فيزا / ماستركارد</p>
                  <p className="text-[11px] text-outline">خصم فوري مباشر</p>
                </div>
              </label>

              {/* Fawry */}
              <label
                onClick={() => setSelectedMethod('fawry')}
                className={`p-3 rounded-xl border-2 flex items-center gap-2 cursor-pointer transition-all ${
                  selectedMethod === 'fawry'
                    ? 'border-primary bg-surface-container-low'
                    : 'border-outline-variant/80 bg-surface'
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  checked={selectedMethod === 'fawry'}
                  onChange={() => setSelectedMethod('fawry')}
                  className="text-primary"
                />
                <div>
                  <p className="text-body-md font-bold text-on-surface">شبكة فوري (Fawry)</p>
                  <p className="text-[11px] text-outline">كود دفع فوري</p>
                </div>
              </label>

              {/* Meeza */}
              <label
                onClick={() => setSelectedMethod('meeza')}
                className={`p-3 rounded-xl border-2 flex items-center gap-2 cursor-pointer transition-all ${
                  selectedMethod === 'meeza'
                    ? 'border-primary bg-surface-container-low'
                    : 'border-outline-variant/80 bg-surface'
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  checked={selectedMethod === 'meeza'}
                  onChange={() => setSelectedMethod('meeza')}
                  className="text-primary"
                />
                <div>
                  <p className="text-body-md font-bold text-on-surface">بطاقات ميزة</p>
                  <p className="text-[11px] text-outline">البطاقة الوطنية المصرية</p>
                </div>
              </label>

              {/* E-Wallets */}
              <label
                onClick={() => setSelectedMethod('wallets')}
                className={`p-3 rounded-xl border-2 flex items-center gap-2 cursor-pointer transition-all ${
                  selectedMethod === 'wallets'
                    ? 'border-primary bg-surface-container-low'
                    : 'border-outline-variant/80 bg-surface'
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  checked={selectedMethod === 'wallets'}
                  onChange={() => setSelectedMethod('wallets')}
                  className="text-primary"
                />
                <div>
                  <p className="text-body-md font-bold text-on-surface">المحافظ الذكية</p>
                  <p className="text-[11px] text-outline">فودافون كاش / إنستاباي</p>
                </div>
              </label>
            </div>
          </div>

          {/* Reassurance */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary-fixed/30 text-secondary text-body-sm font-semibold border border-secondary-container">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span>المعاملة مشفرة ومؤمنة بنسبة 100% مع إمكانية استرداد الرصيد في أي وقت.</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-outline text-on-surface hover:bg-surface-container font-title text-body-md"
            >
              إلغاء
            </button>
            <button
              type="button"
              disabled={isProcessing || finalAmount <= 0}
              onClick={handleRecharge}
              className="flex-1 py-3 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-title text-title flex items-center justify-center gap-2 shadow-md disabled:opacity-50 font-bold"
            >
              {isProcessing ? (
                <>
                  <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                  <span>جارٍ الشحن الآمن...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">payments</span>
                  <span>تأكيد شحن {finalAmount} ج.م</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
