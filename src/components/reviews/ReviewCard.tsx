import React from 'react';
import { Review } from '../../types/review';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-border-subtle/80 space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="space-y-3">
        {/* Photo with physical receipt / unboxed item */}
        <div className="rounded-xl overflow-hidden h-44 bg-surface-soft-blue relative">
          <img
            src={review.imageUrl}
            alt={review.itemPurchased}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {review.receiptProof && (
            <span className="absolute bottom-2 left-2 bg-on-surface/75 backdrop-blur-md text-white px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-success">receipt_long</span>
              Struk Resmi Toko
            </span>
          )}
        </div>

        {/* 5-Star Rating */}
        <div className="flex items-center gap-1 text-warning">
          {[...Array(review.rating)].map((_, i) => (
            <span
              key={i}
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
          ))}
        </div>

        {/* Comment Quote */}
        <p className="font-body-sm text-body-sm text-on-surface italic leading-relaxed">
          &ldquo;{review.comment}&rdquo;
        </p>
      </div>

      {/* Reviewer Details */}
      <div className="pt-3 bg-surface-soft-blue p-3 rounded-xl flex items-center justify-between border border-border-subtle/50">
        <div>
          <span className="font-title-md text-label-md text-on-surface font-bold block">
            {review.customerName}
          </span>
          <span className="text-[12px] text-text-secondary">{review.city}</span>
        </div>
        {review.verified && (
          <span
            className="material-symbols-outlined text-success text-[18px]"
            title="Pembeli Terverifikasi"
          >
            verified
          </span>
        )}
      </div>
    </div>
  );
};
