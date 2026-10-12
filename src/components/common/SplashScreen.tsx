import React, { useState, useEffect } from 'react';
import logoImg from '../../assets/MapahJastip.id.png';

import { useLanguage } from '../../context/LanguageContext';

export const SplashScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // 3 seconds total display time: 2.7s smooth progress + 300ms pause at 100%
    const totalDuration = 2700;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      // Hold at 100% for 300ms so visitor sees completion and hits full 3.0s before fade out
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 300);

      // Remove from DOM after fade-out transition (500ms) completes
      const removeTimer = setTimeout(() => {
        setIsVisible(false);
      }, 800);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [progress]);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Loading Screen MapahJastip"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#faf9f5] dark:bg-slate-950 px-6 transition-all duration-500 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-102' : 'opacity-100'
      }`}
    >
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute w-72 h-72 rounded-full bg-primary/8 dark:bg-primary/20 blur-3xl pointer-events-none -top-10 -right-10" />
      <div className="absolute w-72 h-72 rounded-full bg-cyan-400/8 dark:bg-cyan-500/15 blur-3xl pointer-events-none -bottom-10 -left-10" />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full animate-fadeIn">
        
        {/* White Rounded Box with Logo */}
        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-[32px] sm:rounded-[36px] bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.07)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 flex items-center justify-center p-5 sm:p-6 transition-transform transform duration-300">
          <img
            src={logoImg}
            alt="Logo MapahJastip.id"
            className="w-full h-full object-contain drop-shadow-xs"
          />
        </div>

        {/* Brand Name */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-7 sm:mt-8 font-headline">
          MAPAH JASTIP
        </h1>

        {/* Badges / Subtitle */}
        {/* Badges / Subtitle */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-primary dark:text-cyan-400 mt-2 tracking-wide">
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-primary/10 text-primary dark:bg-primary/20 dark:text-cyan-300 font-extrabold">
            JP
          </span>
          <span>日本直送</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>
            {language === 'ja' ? '100% 日本正規品' : language === 'en' ? '100% AUTHENTIC JAPAN' : '100% ORIGINAL JEPANG'}
          </span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 font-extrabold">
            ID
          </span>
        </div>

        {/* Tagline */}
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
          {language === 'ja'
            ? '日本でのお買い物代行、ご自宅まで安心お届け'
            : language === 'en'
            ? 'Shopping in Japan, We Deliver Directly to Your Doorstep'
            : 'Titip Belanja di Jepang, Kami yang Urus Sampai Rumah Anda'}
        </p>

        {/* Loading Progress Bar */}
        <div className="w-52 sm:w-64 h-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden mt-8 shadow-inner relative">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-primary to-primary-container rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(0,94,164,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Optional Percentage Text (Subtle) */}
        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-semibold tracking-wider">
          {language === 'ja'
            ? `システム読み込み中... ${progress}%`
            : language === 'en'
            ? `Loading system... ${progress}%`
            : `Memuat sistem... ${progress}%`}
        </span>

      </div>
    </aside>
  );
};
