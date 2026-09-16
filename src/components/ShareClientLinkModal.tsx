import React, { useState } from 'react';
import { Share2, Copy, Check, QrCode, MessageCircle, ExternalLink, X, Sparkles, Instagram } from 'lucide-react';

interface ShareClientLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareClientLinkModal: React.FC<ShareClientLinkModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  // Construct client portal sharing URL
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  const shareableUrl = `${origin}${pathname}?p=cliente`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = shareableUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Olá! 💅✨ Para agendar seu horário na Kethelin Beauty Nails, acesse nosso link exclusivo:\n\n${shareableUrl}\n\nEscolha o procedimento (Alongamento Fibra, Molde F1, Banho em Gel, Esmaltação), o melhor dia e horário!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Kethelin Beauty Nails - Agendamento Online',
          text: 'Agende seu horário de unhas online com a Kethelin Beauty Nails:',
          url: shareableUrl,
        });
      } catch (err) {
        // Ignored if cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    shareableUrl
  )}&color=8B4D3B&bgcolor=FAF8F5`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 overflow-hidden">
        {/* Decorative bar */}
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
            <Share2 className="w-7 h-7" />
          </div>

          <span className="text-[10px] uppercase font-bold tracking-widest text-[#A66E5E] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            Link Exclusivo de Clientes
          </span>

          <h2 className="text-2xl font-bold font-['Playfair_Display',serif] text-stone-900 mt-2">
            Compartilhar Link da Cliente
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
            Envie este link direto para suas clientes agendarem horários online, conferirem a tabela de preços e verem o cartão fidelidade.
          </p>
        </div>

        {/* URL Box */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Link Direto de Agendamento
            </label>
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#FAF8F5] border border-stone-200">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="w-full bg-transparent px-2 text-xs sm:text-sm text-stone-700 font-mono select-all outline-hidden truncate"
              />
              <button
                onClick={handleCopyLink}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 hover:border-stone-400 text-stone-800 text-xs font-semibold shadow-xs hover:bg-stone-50 transition-all cursor-pointer active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#C57E6B]" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Sharing Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar no WhatsApp</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C57E6B] to-[#b36a57] hover:from-[#b36a57] hover:to-[#9c5947] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-98"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Link Copiado!' : 'Copiar para Bio'}</span>
            </button>
          </div>

          {/* QR Code Toggle Section */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowQr(!showQr)}
              className="w-full py-2.5 px-3 rounded-xl border border-stone-200 hover:border-stone-300 bg-white text-xs font-semibold text-stone-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-[#C57E6B]" />
              <span>{showQr ? 'Ocultar QR Code' : 'Mostrar QR Code para Mesa / Balcão'}</span>
            </button>

            {showQr && (
              <div className="mt-3 p-4 rounded-2xl bg-[#FAF8F5] border border-rose-100 text-center animate-in fade-in duration-200">
                <p className="text-[11px] text-stone-500 mb-3">
                  Aproxime a câmera do celular da cliente para abrir o agendamento imediatamente:
                </p>
                <div className="inline-block p-3 bg-white rounded-2xl shadow-sm border border-stone-200">
                  <img
                    src={qrImageUrl}
                    alt="QR Code de Agendamento da Cliente"
                    className="w-44 h-44 object-contain mx-auto"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-[10px] text-stone-400 mt-2 font-mono">
                  {shareableUrl}
                </p>
              </div>
            )}
          </div>

          {/* Instagram / Bio Tip Box */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50/60 to-amber-50/60 border border-rose-100 flex items-start gap-3 text-xs text-stone-700">
            <Instagram className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-900 block mb-0.5">Dica para Instagram:</span>
              <span className="text-[11px] leading-relaxed text-stone-600">
                Cole este link no perfil do Instagram <strong>@Nail_kethelinxz</strong> ou no status do WhatsApp para que suas clientes agendem sozinhas sem precisar aguardar resposta.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
