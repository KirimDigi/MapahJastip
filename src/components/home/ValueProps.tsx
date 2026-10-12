import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export const ValueProps: React.FC = () => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const pillars = [
    {
      icon: 'receipt_long',
      title: t('vp.p1.title'),
      description: t('vp.p1.desc'),
      ctaText: t('vp.p1.cta'),
      link: '/cara-kerja',
    },
    {
      icon: 'category',
      title: t('vp.p2.title'),
      description: t('vp.p2.desc'),
      ctaText: t('vp.p2.cta'),
      link: '/konsultasi-shopper',
    },
    {
      icon: 'currency_exchange',
      title: t('vp.p3.title'),
      description: t('vp.p3.desc'),
      ctaText: t('vp.p3.cta'),
      link: '/estimasi',
    },
    {
      icon: 'inventory_2',
      title: t('vp.p4.title'),
      description: t('vp.p4.desc'),
      ctaText: t('vp.p4.cta'),
      link: '/cara-kerja',
    },
  ];

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / (clientWidth * 0.75));
      setActiveIndex(Math.min(Math.max(index, 0), pillars.length - 1));
    }
  };

  const scrollToPillar = (index: number) => {
    if (scrollRef.current) {
      const card = scrollRef.current.children[index] as HTMLElement;
      card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  return (
    <section className="w-full py-8 sm:py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto space-y-1.5 sm:space-y-3 mb-6 sm:mb-12">
          <span className="text-[11px] sm:text-xs text-primary tracking-wide uppercase font-bold">
            {t('vp.sectionBadge')}
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight leading-snug">
            {t('vp.sectionTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto">
            {t('vp.sectionDesc')}
          </p>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 overflow-x-auto md:overflow-x-visible no-scrollbar snap-x snap-mandatory -mx-3.5 px-3.5 md:mx-0 md:px-0 py-2"
        >
          {pillars.map((p, idx) => (
            <Link
              key={idx}
              to={p.link}
              className="w-[78vw] max-w-[280px] shrink-0 md:w-auto md:max-w-none md:shrink snap-center bg-surface-container-lowest p-4 sm:p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-3 sm:space-y-4 border border-border-subtle/70 group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-surface-light-blue text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">{p.icon}</span>
                </div>
                <h3 className="font-title-md text-title-md text-on-surface font-bold group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                <p className="font-body-md text-sm text-text-secondary leading-relaxed">
                  {p.description}
                </p>
              </div>
              <span className="font-label-sm text-label-sm text-primary font-semibold flex items-center gap-1 pt-2">
                {p.ctaText}
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile Swipe Indicators */}
        <div className="flex md:hidden justify-center items-center gap-1.5 mt-4">
          {pillars.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Pilar ${idx + 1}`}
              onClick={() => scrollToPillar(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? 'w-6 bg-primary'
                  : 'w-1.5 bg-border-subtle hover:bg-text-secondary/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

