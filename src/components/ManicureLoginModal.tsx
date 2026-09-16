import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { Lock, Eye, EyeOff, ShieldCheck, Check, AlertCircle, X, KeyRound } from 'lucide-react';

interface ManicureLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
}

export const ManicureLoginModal: React.FC<ManicureLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const [emailOrUser, setEmailOrUser] = useState('kethelin@beautynails.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const cleanPass = password.trim();

      // Accepted default passwords for Kethelin
      const validPasswords = ['kethelin123', '1234', 'kethelin', 'admin'];

      // Also check saved custom password in localStorage if set
      const savedCustomPass = localStorage.getItem('kethelin_custom_password');

      if (
        validPasswords.includes(cleanPass) ||
        (savedCustomPass && cleanPass === savedCustomPass)
      ) {
        if (rememberMe) {
          localStorage.setItem('kethelin_manicure_auth', 'true');
        } else {
          sessionStorage.setItem('kethelin_manicure_auth', 'true');
        }
        onSuccessLogin();
      } else {
        setErrorMessage('Senha incorreta. Use a senha padrão ou 1234.');
      }
    }, 400);
  };

  const handleQuickFill = () => {
    setEmailOrUser('kethelin@beautynails.com');
    setPassword('kethelin123');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 overflow-hidden">
        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#C57E6B] via-rose-300 to-[#b36a57]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pb-5 border-b border-stone-100">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#FAF1EE] text-[#C57E6B] flex items-center justify-center mb-3 shadow-xs border border-rose-200/60">
            <Lock className="w-7 h-7" />
          </div>

          <span className="text-[10px] uppercase font-bold tracking-widest text-[#A66E5E] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            Acesso Restrito
          </span>

          <h2 className="text-2xl font-bold font-['Playfair_Display',serif] text-stone-900 mt-2">
            Painel da Manicure
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Digite sua senha de profissional para acessar a agenda, clientes e fluxo de caixa.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="pt-5 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Usuário / E-mail Profissional
            </label>
            <input
              type="text"
              value={emailOrUser}
              onChange={(e) => setEmailOrUser(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-[#C57E6B] focus:ring-1 focus:ring-[#C57E6B] outline-hidden"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-700">
                Senha de Acesso / PIN
              </label>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[11px] text-[#A66E5E] hover:underline font-medium cursor-pointer"
              >
                Preencher senha padrão
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Ex: kethelin123 ou 1234"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-stone-200 text-sm focus:border-[#C57E6B] focus:ring-1 focus:ring-[#C57E6B] outline-hidden"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-stone-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-[#C57E6B] focus:ring-[#C57E6B]"
              />
              <span>Lembrar neste navegador</span>
            </label>
            <span className="text-[11px] text-stone-400">Kethelin Beauty Nails</span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C57E6B] to-[#b36a57] hover:from-[#b36a57] hover:to-[#9c5947] text-white font-bold text-sm shadow-md shadow-[#C57E6B]/30 hover:shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Verificando...' : 'Entrar no Painel da Manicure'}</span>
            </button>
          </div>
        </form>

        {/* Quick Helper / Demo Credentials Card */}
        <div className="mt-5 p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 text-xs text-stone-600">
          <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
            <KeyRound className="w-3.5 h-3.5 text-[#C57E6B]" />
            <span>Credenciais de Acesso da Kethelin:</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-600">
            <span>Senha Padrão: <code className="bg-white px-1.5 py-0.5 rounded border font-bold text-stone-900">kethelin123</code> ou PIN <code className="bg-white px-1.5 py-0.5 rounded border font-bold text-stone-900">1234</code></span>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[#C57E6B] font-bold hover:underline"
            >
              Usar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
