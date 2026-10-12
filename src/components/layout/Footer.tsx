import React from 'react';
import { Logo } from '../common/Logo';
import { generateGeneralConsultationUrl } from '../../utils/whatsapp';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-surface-container-low border-t border-border-subtle shadow-[0_-1px_8px_rgba(18,59,120,0.04)] mt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Logo className="h-10 sm:h-12 w-auto" />
            </div>
            <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
              {t('footer.about')}
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-success-bg text-success-text font-label-sm text-label-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" />
                {t('footer.shopperDuty')}
              </span>
            </div>
          </div>

          {/* Col 2: Operational Hubs */}
          <div className="space-y-3">
            <span className="font-title-md text-title-md text-on-surface font-semibold block">
              {t('footer.hubTitle')}
            </span>
            <div className="space-y-2.5 font-body-sm text-body-sm text-text-secondary">
              <div className="p-3 bg-surface-container-lowest rounded-xl border border-border-subtle/50">
                <p className="font-label-md text-label-md text-on-surface font-semibold mb-0.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                  {t('footer.tokyoDesk')}
                </p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {t('footer.tokyoAddress')}
                </p>
              </div>
              <div className="p-3 bg-surface-container-lowest rounded-xl border border-border-subtle/50">
                <p className="font-label-md text-label-md text-on-surface font-semibold mb-0.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">warehouse</span>
                  {t('footer.jktHub')}
                </p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {t('footer.jktAddress')}
                </p>
              </div>
            </div>
          </div>

          {/* Col 3: Customer Service & Working Hours */}
          <div className="space-y-3">
            <span className="font-title-md text-title-md text-on-surface font-semibold block">
              {t('footer.csTitle')}
            </span>
            <p className="font-body-sm text-body-sm text-text-secondary">
              {t('footer.csDesc')}
            </p>
            <div className="space-y-2.5">
              <a
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-container-lowest hover:bg-surface-light-blue text-primary font-label-md text-label-md rounded-xl w-full border border-border-subtle transition-colors shadow-xs"
                href={generateGeneralConsultationUrl()}
                target="_blank"
                rel="noreferrer"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">chat</span>
                {t('footer.waBtn')}
              </a>
              <div className="p-3 bg-surface-container-lowest rounded-xl border border-border-subtle/50 text-text-secondary font-body-sm text-body-sm">
                <p className="text-on-surface font-label-md text-label-md font-semibold mb-0.5">
                  {t('footer.hoursTitle')}
                </p>
                <p className="text-xs">{t('footer.hoursDesc')}</p>
              </div>
            </div>
          </div>

          {/* Col 4: Guarantees */}
          <div className="space-y-3">
            <span className="font-title-md text-title-md text-on-surface font-semibold block">
              {t('footer.warrantyTitle')}
            </span>
            <ul className="space-y-2.5 font-body-sm text-body-sm text-text-secondary">
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-success text-[18px] mt-0.5 shrink-0">
                  verified
                </span>
                <span>
                  <strong className="text-on-surface">{t('footer.w1Title')}</strong>{t('footer.w1Desc')}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">
                  shield
                </span>
                <span>
                  <strong className="text-on-surface">{t('footer.w2Title')}</strong>{t('footer.w2Desc')}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-tertiary-container text-[18px] mt-0.5 shrink-0">
                  receipt_long
                </span>
                <span>
                  <strong className="text-on-surface">{t('footer.w3Title')}</strong>{t('footer.w3Desc')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="pt-6 border-t border-border-subtle flex flex-col xl:flex-row items-center justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-text-secondary font-label-sm text-xs flex-wrap">
            {/* Metode Pembayaran ID */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5">
                <span>🇮🇩</span> {t('footer.paymentId')}
              </span>
              <span className="px-2.5 py-1 bg-surface-container-lowest rounded-md font-price-md text-xs font-bold text-on-surface border border-border-subtle shadow-2xs">
                BCA
              </span>
              <span className="px-2.5 py-1 bg-surface-container-lowest rounded-md font-price-md text-xs font-bold text-on-surface border border-border-subtle shadow-2xs">
                Mandiri
              </span>
              <span className="px-2.5 py-1 bg-surface-container-lowest rounded-md font-price-md text-xs font-bold text-on-surface border border-border-subtle shadow-2xs">
                QRIS
              </span>
              <span className="px-2.5 py-1 bg-surface-container-lowest rounded-md font-price-md text-xs font-bold text-on-surface border border-border-subtle shadow-2xs">
                Jenius
              </span>
            </div>

            <span className="hidden sm:inline text-border-subtle">|</span>

            {/* Metode Pembayaran Resmi Jepang */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5">
                <span>🇯🇵</span> {t('footer.paymentJp')}
              </span>
              <span className="px-2.5 py-1 bg-surface-container-lowest rounded-md font-price-md text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-border-subtle shadow-2xs">
                JPQR
              </span>
              <span className="px-2.5 py-1 bg-surface-container-lowest rounded-md font-price-md text-xs font-bold text-red-600 dark:text-red-400 border border-border-subtle shadow-2xs">
                PayPay
              </span>
              <span className="px-2.5 py-1 bg-surface-container-lowest rounded-md font-price-md text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-border-subtle shadow-2xs">
                Suica / Pasmo
              </span>
              <span className="px-2.5 py-1 bg-surface-container-lowest rounded-md font-price-md text-xs font-bold text-blue-700 dark:text-blue-400 border border-border-subtle shadow-2xs">
                JCB
              </span>
              <span className="px-2.5 py-1 bg-surface-container-lowest rounded-md font-price-md text-xs font-bold text-amber-700 dark:text-amber-400 border border-border-subtle shadow-2xs">
                Konbini Pay
              </span>
              <span className="px-2.5 py-1 bg-surface-container-lowest rounded-md font-price-md text-xs font-bold text-on-surface border border-border-subtle shadow-2xs">
                Yucho Bank
              </span>
            </div>
          </div>

          <p className="font-body-sm text-body-sm text-text-secondary text-center xl:text-right shrink-0">
            &copy; {new Date().getFullYear()} {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};
