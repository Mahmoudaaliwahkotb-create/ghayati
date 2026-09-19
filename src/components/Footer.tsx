import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant mt-auto">
      <div className="w-full max-w-7xl mx-auto px-margin py-space-xl flex flex-col md:flex-row justify-between items-center gap-space-lg rtl:flex-row-reverse">
        {/* Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
          <span className="text-headline-sm font-headline-sm text-primary font-bold">
            غايتي | Ghayati
          </span>
          <span className="hidden sm:inline text-outline-variant">|</span>
          <p className="text-on-surface-variant font-body-sm text-body-sm">
            جميع الحقوق محفوظة لمنصة غايتي التعليمية © ٢٠٢٥
          </p>
        </div>

        {/* Footer Navigation Links verbatim */}
        <nav className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
          <a className="text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors duration-150" href="#about">
            عن غايتي
          </a>
          <a className="text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors duration-150" href="#terms">
            الشروط والأحكام
          </a>
          <a className="text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors duration-150" href="#privacy">
            سياسة الخصوصية
          </a>
          <a className="text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors duration-150" href="#faq">
            الأسئلة الشائعة
          </a>
          <a className="text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors duration-150" href="#help">
            مركز المساعدة
          </a>
          <a className="text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors duration-150" href="#contact">
            تواصل معنا
          </a>
        </nav>
      </div>
    </footer>
  );
};
