import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (!emailOrPhone.trim()) {
        setError('Harap masukkan email atau nomor WhatsApp');
        return;
      }
      if (!password.trim()) {
        setError('Harap masukkan kata sandi');
        return;
      }

      // Mock login
      login('Budi Santoso', emailOrPhone.includes('@') ? emailOrPhone : 'budi@example.com', emailOrPhone);
      setSuccessMsg('Berhasil masuk! Selamat datang kembali.');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 700);
    } else {
      // Register
      if (!name.trim()) {
        setError('Harap masukkan nama lengkap Anda');
        return;
      }
      if (!phone.trim()) {
        setError('Harap masukkan nomor WhatsApp aktif');
        return;
      }
      if (!password.trim()) {
        setError('Harap masukkan kata sandi');
        return;
      }

      // Mock register
      login(name, email || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`, phone);
      setSuccessMsg('Pendaftaran akun berhasil! Selamat datang di MapahJastip.');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn cursor-pointer"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-3xl border border-border-subtle shadow-2xl p-6 sm:p-7 space-y-5 animate-scale">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-on-surface">
                {mode === 'login' ? 'Masuk ke Akun Anda' : 'Daftar Akun Baru'}
              </h3>
              <p className="text-[11px] text-text-secondary">
                MapahJastip.id — Titip Belanja Jepang Terpercaya
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-container-low text-text-secondary hover:text-on-surface transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Switcher (Masuk vs Daftar) */}
        <div className="grid grid-cols-2 p-1 bg-surface-container-low rounded-xl border border-border-subtle text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                : 'text-text-secondary hover:text-on-surface'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                : 'text-text-secondary hover:text-on-surface'
            }`}
          >
            Daftar Akun
          </button>
        </div>

        {/* Error / Success Notifications */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/50 rounded-xl text-green-600 dark:text-green-400 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] shrink-0">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Nama Lengkap
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 pointer-events-none">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-border-subtle focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs font-medium focus:outline-none"
                />
              </div>
            </div>
          )}

          {mode === 'login' ? (
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Email atau No. WhatsApp
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 pointer-events-none">
                  <span className="material-symbols-outlined text-[18px]">contact_mail</span>
                </span>
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="0812xxxx atau email@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-border-subtle focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs font-medium focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Nomor WhatsApp Aktif
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 pointer-events-none">
                    <span className="material-symbols-outlined text-[18px]">phone_iphone</span>
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-border-subtle focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Email (Opsional)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 pointer-events-none">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-border-subtle focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-on-surface">
                Kata Sandi
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Fitur reset password: Silakan hubungi admin via WhatsApp untuk pemulihan akun.')}
                  className="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
                >
                  Lupa Sandi?
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 pointer-events-none">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi Anda"
                className="w-full pl-9 pr-10 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-border-subtle focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs font-medium focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary hover:bg-primary-dark active:scale-[0.99] text-white rounded-xl font-bold text-xs shadow-md shadow-primary/25 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <span>{mode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun Baru'}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </form>

        {/* Footer info */}
        <div className="pt-2 border-t border-border-subtle/70 text-center">
          <p className="text-[11px] text-text-secondary">
            {mode === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="text-primary hover:underline font-bold cursor-pointer"
            >
              {mode === 'login' ? 'Daftar di sini' : 'Masuk di sini'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
