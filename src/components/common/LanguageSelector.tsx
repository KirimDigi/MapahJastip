import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, LANGUAGES, Language } from '../../context/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'header' | 'compact';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { language, setLanguage, currentLangObj } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      {/* Trigger Button - Hanya 1 teks (misal JP saja, tidak double) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Pilih Bahasa (Language Selector)"
        className={`flex items-center gap-1 sm:gap-1.5 rounded-lg border border-slate-200 dark:border-border-subtle bg-surface-container-low hover:bg-surface-light-blue hover:border-primary/40 text-on-surface hover:text-primary transition-all text-xs font-semibold cursor-pointer select-none focus:outline-none ${
          variant === 'compact'
            ? 'px-2 py-0.5 text-[11px]'
            : 'px-2.5 py-1.5'
        }`}
      >
        <span className="text-xs font-bold uppercase tracking-wider">
          {currentLangObj.shortLabel}
        </span>
        <span className="material-symbols-outlined text-[15px] text-text-secondary">
          expand_more
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-48 rounded-2xl bg-surface-container-lowest border border-border-subtle shadow-xl p-1.5 z-[70] animate-scale space-y-0.5">
          <div className="px-2.5 py-1.5 text-[10px] font-bold text-text-secondary uppercase tracking-wider border-b border-border-subtle/60 mb-1">
            Pilih Bahasa / Language
          </div>

          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-on-surface hover:bg-surface-light-blue hover:text-primary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 py-0.5 text-center rounded bg-surface-container-low text-[10px] font-bold text-primary">
                    {lang.shortLabel}
                  </span>
                  <span>{lang.label}</span>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
