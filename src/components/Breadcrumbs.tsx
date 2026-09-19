import React from 'react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  icon?: string;
  isCurrent?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onBack?: () => void;
  backLabel?: string;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  onBack,
  backLabel = 'رجوع',
  className = ''
}) => {
  return (
    <nav
      aria-label="مسار التنقل"
      className={`w-full bg-surface-container-lowest border-b border-outline-variant/60 py-2.5 text-right ${className}`}
    >
      <div className="max-w-7xl mx-auto px-margin flex items-center justify-between gap-3 flex-wrap">
        {/* Breadcrumb Trail & Back Button */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm">
          {/* Back Button */}
          {onBack && (
            <>
              <button
                onClick={onBack}
                type="button"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-primary transition-all font-semibold cursor-pointer active:scale-95 shadow-2xs group"
                title={backLabel}
              >
                {/* In RTL, the back arrow points right (towards previous) */}
                <span className="material-symbols-outlined text-base group-hover:-translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
                <span>{backLabel}</span>
              </button>
              <div className="h-4 w-px bg-outline-variant/70 hidden xs:block" aria-hidden="true" />
            </>
          )}

          {/* Ordered Breadcrumbs List */}
          <ol className="flex items-center gap-1 sm:gap-2 flex-wrap text-on-surface-variant font-medium">
            {items.map((item, index) => {
              const isLast = index === items.length - 1 || item.isCurrent;

              return (
                <li key={index} className="flex items-center gap-1 sm:gap-2">
                  {index > 0 && (
                    <span
                      className="material-symbols-outlined text-sm text-outline-variant shrink-0 select-none"
                      aria-hidden="true"
                    >
                      chevron_left
                    </span>
                  )}

                  {isLast ? (
                    <span
                      aria-current="page"
                      className="text-on-surface font-bold text-xs sm:text-sm flex items-center gap-1.5"
                    >
                      {item.icon && (
                        <span className="material-symbols-outlined text-base text-primary">
                          {item.icon}
                        </span>
                      )}
                      <span>{item.label}</span>
                    </span>
                  ) : item.onClick ? (
                    <button
                      type="button"
                      onClick={item.onClick}
                      className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer hover:underline underline-offset-4"
                    >
                      {item.icon && (
                        <span className="material-symbols-outlined text-base">
                          {item.icon}
                        </span>
                      )}
                      <span>{item.label}</span>
                    </button>
                  ) : (
                    <span className="text-on-surface-variant/80">
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Current Location Badge Indicator */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-outline font-semibold bg-surface-container-low px-2.5 py-1 rounded-full border border-outline-variant/40">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>الموقع الحالي: {items[items.length - 1]?.label}</span>
        </div>
      </div>
    </nav>
  );
};
