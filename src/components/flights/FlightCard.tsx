import React from 'react';
import { Link } from 'react-router-dom';
import { FlightBatch } from '../../types/batch';

interface FlightCardProps {
  batch: FlightBatch;
}

export const FlightCard: React.FC<FlightCardProps> = ({ batch }) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-border-subtle/80 space-y-5 relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl bg-surface-light-blue text-primary flex items-center justify-center font-bold font-title-md text-base border border-border-subtle">
            #{batch.batchNumber}
          </span>
          <div>
            <h3 className="font-title-md text-headline-sm text-on-surface font-bold">
              {batch.title}
            </h3>
            <span className="font-label-sm text-label-sm text-text-secondary">
              Rute: {batch.route} ({batch.flightCode})
            </span>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full font-label-sm text-xs font-bold shrink-0 ${
            batch.status === 'filling'
              ? 'bg-warning-bg text-warning-text'
              : 'bg-success-bg text-success-text'
          }`}
        >
          {batch.statusBadge}
        </span>
      </div>

      {/* Milestones Timeline */}
      <div className="grid grid-cols-3 gap-2 py-3 bg-surface-soft-blue p-4 rounded-xl text-center border border-border-subtle/50">
        <div className="space-y-1">
          <span className="text-[11px] text-text-secondary uppercase block font-semibold">
            Cut-Off Titip
          </span>
          <span className="font-title-md text-label-md text-error font-bold block">
            {batch.cutOffDate}
          </span>
          <span className="text-[11px] text-text-secondary block">{batch.cutOffTime}</span>
        </div>
        <div className="space-y-1 border-x border-border-subtle/60 px-1">
          <span className="text-[11px] text-text-secondary uppercase block font-semibold">
            Live Belanja
          </span>
          <span className="font-title-md text-label-md text-on-surface font-bold block">
            {batch.shoppingPeriod}
          </span>
          <span className="text-[11px] text-text-secondary block">Tokyo Stores</span>
        </div>
        <div className="space-y-1">
          <span className="text-[11px] text-text-secondary uppercase block font-semibold">
            Kirim Domestik
          </span>
          <span className="font-title-md text-label-md text-success-text font-bold block">
            {batch.domesticDeliveryDate}
          </span>
          <span className="text-[11px] text-text-secondary block">Jakarta Hub</span>
        </div>
      </div>

      {/* Quota Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-label-sm font-label-sm text-text-secondary">
          <span>Sisa Bagasi Kargo Tersedia</span>
          <span className="font-bold text-on-surface">Tersisa {batch.remainingKg} kg</span>
        </div>
        <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              batch.usedPercentage > 75 ? 'bg-warning' : 'bg-primary'
            }`}
            style={{ width: `${batch.usedPercentage}%` }}
          />
        </div>
      </div>

      {/* Footer Info & Booking Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <span className="text-label-sm font-label-sm text-text-secondary flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-success">check_circle</span>
          {batch.highlightNote}
        </span>
        <Link
          to={`/estimasi?batch=${batch.batchNumber}`}
          className="px-4 py-2 bg-primary-container text-white rounded-lg font-label-md text-label-md hover:bg-primary-dark transition-colors shadow-xs text-center shrink-0"
        >
          Booking Slot #{batch.batchNumber}
        </Link>
      </div>
    </div>
  );
};
