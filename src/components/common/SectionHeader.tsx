import React from 'react';

interface SectionHeaderProps {
  badge?: string;
  badgeIcon?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  badgeIcon,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  return (
    <div
      className={`space-y-3 mb-10 ${
        align === 'center' ? 'text-center max-w-3xl mx-auto' : 'text-left max-w-2xl'
      } ${className}`}
    >
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-light-blue text-primary font-label-md text-xs uppercase font-bold tracking-wider">
          {badgeIcon && <span className="material-symbols-outlined text-[16px]">{badgeIcon}</span>}
          {badge}
        </span>
      )}
      <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
