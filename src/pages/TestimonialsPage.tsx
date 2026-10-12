import React, { useRef, useState } from 'react';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { DUMMY_REVIEWS } from '../constants/dummyReviews';
import { useLanguage } from '../context/LanguageContext';

export const TestimonialsPage: React.FC = () => {
  const { t } = useLanguage();
  const reviewScrollRef = useRef<HTMLDivElement>(null);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const handleReviewScroll = () => {
    if (reviewScrollRef.current) {
      const { scrollLeft, clientWidth } = reviewScrollRef.current;
      const index = Math.round(scrollLeft / (clientWidth * 0.75));
      setActiveReviewIndex(Math.min(Math.max(index, 0), DUMMY_REVIEWS.length - 1));
    }
  };

  const scrollToReview = (index: number) => {
    if (reviewScrollRef.current) {
      const card = reviewScrollRef.current.children[index] as HTMLElement;
      card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  return (
    <div className="w-full bg-surface pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-light-blue text-primary font-label-md text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            {t('testiPage.badge')}
          </div>
          <h1 className="font-headline-lg text-3xl sm:text-4xl lg:text-headline-lg text-on-surface font-bold">
            {t('testiPage.title')}
          </h1>
          <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
            {t('testiPage.desc')}
          </p>
        </div>

        {/* Rating Breakdown Banner */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-border-subtle shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="text-4xl lg:text-5xl font-extrabold text-primary">4.98</div>
            <div className="space-y-1">
              <div className="flex text-warning">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="text-xs text-text-secondary">{t('testiPage.statSuccess')}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-text-secondary flex-wrap justify-center">
            <div className="text-center">
              <strong className="block text-on-surface text-base font-bold">100%</strong>
              <span>{t('testiPage.statOriginal')}</span>
            </div>
            <div className="text-center">
              <strong className="block text-success-text text-base font-bold">0%</strong>
              <span>{t('testiPage.statDamage')}</span>
            </div>
            <div className="text-center">
              <strong className="block text-primary text-base font-bold">100%</strong>
              <span>{t('testiPage.statReceipt')}</span>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div>
          <div
            ref={reviewScrollRef}
            onScroll={handleReviewScroll}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible no-scrollbar snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 py-2"
          >
            {DUMMY_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="w-[84vw] max-w-[320px] shrink-0 md:w-auto md:max-w-none md:shrink snap-center flex flex-col"
              >
                <ReviewCard review={rev} />
              </div>
            ))}
          </div>

          {/* Mobile Swipe Indicators */}
          <div className="flex md:hidden justify-center items-center gap-1.5 mt-4">
            {DUMMY_REVIEWS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Testimoni ${idx + 1}`}
                onClick={() => scrollToReview(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeReviewIndex === idx
                    ? 'w-6 bg-primary'
                    : 'w-1.5 bg-border-subtle hover:bg-text-secondary/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

