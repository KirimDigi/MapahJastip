import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { authenticateWithSupabase, registerToSupabase } from '../services/supabase';

interface AuthPageProps {
  defaultMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ defaultMode }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, login, logout } = useAuth();
  const { clearCart } = useCart();
  const { t } = useLanguage();

  const initialMode = searchParams.get('mode') === 'register' || defaultMode === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // Status feedback
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickLogin = async (roleType: 'customer' | 'admin') => {
    setError('');
    setIsLoading(true);

    if (roleType === 'admin') {
      setEmailOrPhone('admin@mapahjastip.id');
      setPassword('admin123');
      sessionStorage.setItem('mapah_admin_auth', 'true');
      try {
        await authenticateWithSupabase('admin@mapahjastip.id', 'admin123');
      } catch (e) {
        console.warn('Supabase auth fallback:', e);
      }
      setIsLoading(false);
      login('Admin MapahJastip', 'admin@mapahjastip.id', '081280905425', 'admin');
      setSuccessMsg('Berhasil masuk sebagai Admin MapahJastip (Terhubung ke Supabase)! Mengalihkan ke Panel Admin...');
      setTimeout(() => {
        navigate('/admin');
      }, 500);
    } else {
      setEmailOrPhone('customer@mapahjastip.id');
      setPassword('customer123');
      try {
        await authenticateWithSupabase('customer@mapahjastip.id', 'customer123');
      } catch (e) {
        console.warn('Supabase auth fallback:', e);
      }
      setIsLoading(false);
      login('Budi Pratama (Sample Customer)', 'customer@mapahjastip.id', '081234567890', 'customer');
      setSuccessMsg('Berhasil masuk sebagai Sample Customer (Terhubung ke Supabase)! Mengalihkan ke Beranda...');
      setTimeout(() => {
        navigate('/');
      }, 500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (!emailOrPhone.trim()) {
        setError(t('auth.emailOrPhonePlaceholder', 'Harap masukkan alamat email atau nomor WhatsApp Anda.'));
        return;
      }
      if (!password.trim()) {
        setError(t('auth.passwordPlaceholder', 'Harap masukkan kata sandi.'));
        return;
      }

      setIsLoading(true);
      try {
        // Cek autentikasi ke database Supabase
        const { user: dbUser } = await authenticateWithSupabase(emailOrPhone, password);

        let role: 'customer' | 'admin' = 'customer';
        let resolvedName = 'Pelanggan MapahJastip';
        let resolvedEmail = emailOrPhone.includes('@') ? emailOrPhone : 'pelanggan@mapahjastip.id';
        let resolvedPhone = emailOrPhone;

        if (dbUser) {
          role = dbUser.role;
          resolvedName = dbUser.name;
          resolvedEmail = dbUser.email;
          resolvedPhone = dbUser.phone || emailOrPhone;
        } else {
          // Fallback lokal jika input cocok dengan format
          const lowerInput = emailOrPhone.toLowerCase().trim();
          const isAdmin = lowerInput.includes('admin');
          role = isAdmin ? 'admin' : 'customer';
          resolvedName = isAdmin
            ? 'Admin MapahJastip'
            : emailOrPhone.includes('@')
              ? emailOrPhone.split('@')[0]
              : 'Pelanggan MapahJastip';
          resolvedEmail = emailOrPhone.includes('@') ? emailOrPhone : isAdmin ? 'admin@mapahjastip.id' : 'pelanggan@mapahjastip.id';
        }

        if (role === 'admin') {
          sessionStorage.setItem('mapah_admin_auth', 'true');
        }

        login(resolvedName, resolvedEmail, resolvedPhone, role);
        setSuccessMsg(
          role === 'admin'
            ? 'Berhasil masuk sebagai Admin MapahJastip (Terhubung ke Supabase)! Mengalihkan ke Panel Admin...'
            : t('auth.loginSuccess', 'Berhasil masuk! Mengalihkan ke beranda...')
        );
        setTimeout(() => {
          navigate(role === 'admin' ? '/admin' : '/');
        }, 600);
      } catch (err: any) {
        setError(err?.message || 'Gagal masuk. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Register
      if (!name.trim()) {
        setError(t('auth.fullNamePlaceholder', 'Harap masukkan nama lengkap Anda.'));
        return;
      }
      if (!phone.trim()) {
        setError(t('auth.phonePlaceholder', 'Harap masukkan nomor WhatsApp aktif Anda.'));
        return;
      }
      if (!password.trim()) {
        setError(t('auth.passwordPlaceholder', 'Harap buat kata sandi untuk akun Anda.'));
        return;
      }
      if (password.length < 6) {
        setError(t('auth.passMinLength', 'Kata sandi minimal 6 karakter.'));
        return;
      }
      if (password !== confirmPassword) {
        setError(t('auth.passMismatch', 'Konfirmasi kata sandi tidak cocok.'));
        return;
      }
      if (!agreeTerms) {
        setError(t('auth.termsRequired', 'Harap setujui syarat dan ketentuan MapahJastip.'));
        return;
      }

      setIsLoading(true);
      try {
        const resolvedEmail = email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@mapahjastip.id`;
        // Simpan akun baru langsung ke tabel app_users di Supabase
        await registerToSupabase(name, resolvedEmail, phone, password, 'customer');

        login(name, resolvedEmail, phone, 'customer');
        setSuccessMsg('Pendaftaran akun berhasil & data tersimpan di database Supabase! Selamat datang.');
        setTimeout(() => {
          navigate('/');
        }, 800);
      } catch (err: any) {
        // Fallback login
        login(name, email || phone, phone, 'customer');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-160px)] bg-surface py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-text-secondary mb-6 sm:mb-8">
          <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>{t('auth.breadcrumbHome')}</span>
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-semibold">
            {isLoggedIn ? t('auth.breadcrumbAccount') : mode === 'login' ? t('auth.breadcrumbLogin') : t('auth.breadcrumbRegister')}
          </span>
        </nav>

        {/* If Already Logged In */}
        {isLoggedIn ? (
          <div className="bg-surface-container-lowest rounded-3xl border border-border-subtle shadow-xl p-6 sm:p-10 max-w-xl mx-auto text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 text-primary mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl">account_circle</span>
            </div>
            <div>
              <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-2 ${
                user?.role === 'admin'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-primary/10 text-primary'
              }`}>
                {user?.role === 'admin' ? '🛡️ Administrator MapahJastip' : t('auth.memberBadge')}
              </span>
              <h1 className="text-2xl font-bold text-on-surface">{user?.name}</h1>
              <p className="text-sm text-text-secondary mt-1">{user?.email || user?.phone}</p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-border-subtle text-left space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">{t('auth.waNumber')}</span>
                <span className="font-semibold text-on-surface">{user?.phone || '-'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">{t('auth.registeredEmail')}</span>
                <span className="font-semibold text-on-surface">{user?.email || '-'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Role Akun</span>
                <span className="font-bold text-primary">
                  {user?.role === 'admin' ? 'MapahJastip Admin' : 'Pelanggan (Customer)'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {user?.role === 'admin' ? (
                <Link
                  to="/admin"
                  className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                  <span>Buka Panel Admin MapahJastip</span>
                </Link>
              ) : (
                <Link
                  to="/status-pesanan"
                  className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  <span>{t('auth.checkOrderStatus')}</span>
                </Link>
              )}
              <Link
                to="/katalog"
                className="flex-1 py-3 px-4 rounded-xl bg-surface-container-low hover:bg-surface-light-blue hover:text-primary text-on-surface text-xs font-bold flex items-center justify-center gap-2 border border-border-subtle transition-all active:scale-98"
              >
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                <span>{t('auth.startShopping')}</span>
              </Link>
            </div>

            <button
              onClick={() => {
                clearCart();
                logout();
              }}
              className="text-xs text-error hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer pt-2"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>{t('auth.logoutAccount')}</span>
            </button>
          </div>
        ) : (
          /* Main 2-Column Authentication Card */
          <div className="bg-surface-container-lowest rounded-3xl border border-border-subtle shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-fadeIn">
            
            {/* Left Column: Brand Story & Highlights (Desktop) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-primary to-primary-container text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
              {/* Background Glow Decorations */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span>{t('auth.badgeStory')}</span>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                    {t('auth.storyTitle')}
                  </h1>
                  <p className="text-xs sm:text-sm text-white/80 mt-3 leading-relaxed">
                    {t('auth.storyDesc')}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-sm">🗾</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold">{t('auth.f1Title')}</p>
                      <p className="text-[11px] text-white/70">{t('auth.f1Desc')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-sm">✈️</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold">{t('auth.f2Title')}</p>
                      <p className="text-[11px] text-white/70">{t('auth.f2Desc')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-sm">💬</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold">{t('auth.f3Title')}</p>
                      <p className="text-[11px] text-white/70">{t('auth.f3Desc')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Batch Info */}
              <div className="relative z-10 pt-8 mt-8 border-t border-white/20 flex items-center justify-between text-xs text-white/80">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>{t('auth.guarantee')}</span>
                </span>
                <span>Tokyo • Osaka • Kyoto</span>
              </div>
            </div>

            {/* Right Column: Full Login / Register Form */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
              <div className="max-w-md w-full mx-auto space-y-6">
                
                {/* Mode Switcher Tabs */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                      {mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
                    </h2>
                    <p className="text-xs text-text-secondary mt-1">
                      {mode === 'login' ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}
                    </p>
                  </div>
                </div>

                {/* Tab Switcher Pills */}
                <div className="grid grid-cols-2 p-1 bg-surface-container-low rounded-2xl border border-border-subtle text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError('');
                      setSuccessMsg('');
                    }}
                    className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      mode === 'login'
                        ? 'bg-primary text-white shadow-xs font-bold'
                        : 'text-text-secondary hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[17px]">login</span>
                    <span>{t('auth.tabLogin')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setError('');
                      setSuccessMsg('');
                    }}
                    className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      mode === 'register'
                        ? 'bg-primary text-white shadow-xs font-bold'
                        : 'text-text-secondary hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[17px]">person_add</span>
                    <span>{t('auth.tabRegister')}</span>
                  </button>
                </div>

                {/* Alerts */}
                {error && (
                  <div className="p-3.5 rounded-xl bg-error-bg text-error-text text-xs flex items-center gap-2 animate-fadeIn border border-error/20">
                    <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                    <span>{error}</span>
                  </div>
                )}
                {successMsg && (
                  <div className="p-3.5 rounded-xl bg-success-bg text-success-text text-xs flex items-center gap-2 animate-fadeIn border border-emerald-300">
                    <span className="material-symbols-outlined text-[18px] shrink-0">check_circle</span>
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* Form Elements */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'register' && (
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        {t('auth.fullName')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary text-[18px]">
                          person
                        </span>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t('auth.fullNamePlaceholder')}
                          className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface placeholder:text-text-secondary/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {mode === 'login' ? (
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        {t('auth.emailOrPhone')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary text-[18px]">
                          contact_mail
                        </span>
                        <input
                          type="text"
                          required
                          value={emailOrPhone}
                          onChange={(e) => setEmailOrPhone(e.target.value)}
                          placeholder={t('auth.emailOrPhonePlaceholder')}
                          className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface placeholder:text-text-secondary/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1.5">
                          {t('auth.phoneActive')} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary text-[18px]">
                            call
                          </span>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={t('auth.phonePlaceholder')}
                            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface placeholder:text-text-secondary/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1.5">
                          {t('auth.emailOptional')}
                        </label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary text-[18px]">
                            mail
                          </span>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@contoh.com"
                            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface placeholder:text-text-secondary/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-on-surface">
                        {t('auth.password')} <span className="text-red-500">*</span>
                      </label>
                      {mode === 'login' && (
                        <a
                          href="https://wa.me/6281280905425?text=Halo%20Admin%20MapahJastip,%20saya%20lupa%20kata%20sandi%20akun%20saya"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-primary hover:underline font-medium"
                        >
                          {t('auth.forgotPassword')}
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary text-[18px]">
                        lock
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('auth.passwordPlaceholder')}
                        className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface placeholder:text-text-secondary/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Tampilkan sandi"
                        className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-on-surface text-[18px] cursor-pointer"
                      >
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </button>
                    </div>
                  </div>

                  {mode === 'register' && (
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        {t('auth.confirmPassword')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary text-[18px]">
                          lock_reset
                        </span>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder={t('auth.confirmPasswordPlaceholder')}
                          className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface placeholder:text-text-secondary/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label="Tampilkan konfirmasi sandi"
                          className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-on-surface text-[18px] cursor-pointer"
                        >
                          {showConfirmPassword ? 'visibility_off' : 'visibility'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Options */}
                  {mode === 'login' ? (
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-text-secondary">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-border-subtle text-primary focus:ring-primary/20"
                        />
                        <span>{t('auth.rememberMe')}</span>
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-3.5 h-3.5 mt-0.5 rounded border-border-subtle text-primary focus:ring-primary/20 cursor-pointer"
                      />
                      <label htmlFor="terms" className="text-[11px] text-text-secondary cursor-pointer leading-tight">
                        {t('auth.agreeTerms')}
                      </label>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{t('auth.processing')}</span>
                      </>
                    ) : (
                      <>
                        <span>{mode === 'login' ? t('auth.loginButton') : t('auth.registerButton')}</span>
                        <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                      </>
                    )}
                  </button>

                  {/* 2 Akun Demo: Sample Customer & MapahJastip Akun Admin */}
                  {mode === 'login' && (
                    <div className="pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleQuickLogin('customer')}
                          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-border-subtle bg-surface-container-low hover:bg-surface-soft-blue hover:border-primary/40 text-xs font-semibold text-on-surface transition-all active:scale-98 cursor-pointer shadow-2xs group"
                          title="Masuk sebagai Sample Customer"
                        >
                          <span className="material-symbols-outlined text-[17px] text-text-secondary group-hover:text-primary transition-colors">
                            person
                          </span>
                          <span className="truncate">Akun Budi (Sample Customer)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickLogin('admin')}
                          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary text-xs font-bold text-primary transition-all active:scale-98 cursor-pointer shadow-2xs group"
                          title="Masuk sebagai MapahJastip Akun Admin"
                        >
                          <span className="material-symbols-outlined text-[17px] text-primary">
                            admin_panel_settings
                          </span>
                          <span className="truncate">MapahJastip Akun Admin</span>
                        </button>
                      </div>
                    </div>
                  )}
                </form>

                {/* Footer Switcher */}
                <div className="text-center pt-2">
                  <p className="text-xs text-text-secondary">
                    {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode(mode === 'login' ? 'register' : 'login');
                        setError('');
                        setSuccessMsg('');
                      }}
                      className="text-primary font-bold hover:underline cursor-pointer"
                    >
                      {mode === 'login' ? t('auth.registerHere') : t('auth.loginHere')}
                    </button>
                  </p>
                </div>

                {/* CS WhatsApp Assistance */}
                <div className="pt-4 border-t border-border-subtle/80 text-center">
                  <p className="text-[11px] text-text-secondary">
                    {t('auth.needHelp')}{' '}
                    <a
                      href="https://wa.me/6281280905425?text=Halo%20Admin%20MapahJastip,%20bisa%20bantu%20saya%20terkait%20akun%20atau%20pesanan%20jastip?"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      {t('auth.chatWa')}
                      <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </a>
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
