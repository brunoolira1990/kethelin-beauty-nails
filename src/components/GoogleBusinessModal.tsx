import React, { useState } from 'react';
import {
  X,
  Star,
  ExternalLink,
  QrCode,
  Printer,
  Copy,
  Check,
  Share2,
  Sparkles,
  MapPin,
  HelpCircle,
  Plus,
  Trash2,
  Store,
  RefreshCw,
} from 'lucide-react';
import {
  GoogleBusinessConfig,
  saveGoogleBusinessConfig,
  buildGoogleDirectReviewUrl,
  getQrCodeUrl,
} from '../utils/googleBusiness';
import { GoogleReview } from '../data/initialData';
import { STUDIO_INFO } from '../data/initialData';
import { db, isSupabaseConfigured } from '../lib/supabase';

interface GoogleBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GoogleBusinessConfig;
  onUpdateConfig: (newConfig: GoogleBusinessConfig) => void;
  reviews: GoogleReview[];
  onAddReview: (review: GoogleReview) => void;
  onDeleteReview?: (id: string) => void;
}

export const GoogleBusinessModal: React.FC<GoogleBusinessModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  reviews,
  onAddReview,
  onDeleteReview,
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'qrcode' | 'reviews' | 'whatsapp'>('config');
  const [tempUrlOrPlaceId, setTempUrlOrPlaceId] = useState(config.placeId || config.reviewUrl);
  const [tempAddress, setTempAddress] = useState(config.address || STUDIO_INFO.address);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New review form
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newService, setNewService] = useState('Alongamento em Fibra de Vidro');
  const [newDate, setNewDate] = useState('recente');
  const [newComment, setNewComment] = useState('');
  const [isAddingReview, setIsAddingReview] = useState(false);

  if (!isOpen) return null;

  const currentDirectUrl = buildGoogleDirectReviewUrl(tempUrlOrPlaceId || config.reviewUrl);
  const qrCodeImgUrl = getQrCodeUrl(currentDirectUrl, 300);

  const handleSaveConfig = () => {
    const isUrl = tempUrlOrPlaceId.startsWith('http://') || tempUrlOrPlaceId.startsWith('https://');
    const directUrl = buildGoogleDirectReviewUrl(tempUrlOrPlaceId);

    const updated: GoogleBusinessConfig = {
      ...config,
      reviewUrl: directUrl,
      placeId: !isUrl ? tempUrlOrPlaceId.trim() : config.placeId,
      address: tempAddress.trim() || STUDIO_INFO.address,
      isCustomUrlSet: Boolean(tempUrlOrPlaceId.trim()),
      reviewCount: reviews.length,
    };

    onUpdateConfig(updated);
    saveGoogleBusinessConfig(updated);
    if (isSupabaseConfigured) {
      db.saveGoogleConfig(updated).catch((err) =>
        console.warn('Could not save Google config to Supabase:', err)
      );
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentDirectUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddNewReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const colors = ['bg-rose-500', 'bg-amber-600', 'bg-emerald-600', 'bg-indigo-600', 'bg-pink-500', 'bg-purple-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const rev: GoogleReview = {
      id: `google-rev-${Date.now()}`,
      author: newAuthor.trim(),
      avatarColor: randomColor,
      avatarLetter: newAuthor.trim().charAt(0).toUpperCase(),
      rating: newRating,
      date: newDate.trim() || 'há poucos dias',
      service: newService.trim() || 'Atendimento',
      comment: newComment.trim(),
      verified: true,
    };

    onAddReview(rev);
    setNewAuthor('');
    setNewComment('');
    setIsAddingReview(false);
  };

  const handlePrintQr = () => {
    window.print();
  };

  const whatsappMessageTemplate = `Olá! 🌸 Passando para agradecer com muito carinho por ter vindo ao *Kethelin Beauty Nails*!\n\nSeu apoio é fundamental para o nosso trabalho. Você poderia nos ajudar deixando uma rápida avaliação 5 estrelas no nosso *Google Meu Negócio*? Leva menos de 1 minutinho:\n\n⭐ ${currentDirectUrl}\n\nMuito obrigada de coração! 💖💅`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-gradient-to-r from-rose-50/70 via-stone-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-stone-200 flex items-center justify-center p-2">
              {/* Google G Icon */}
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-900 font-['Playfair_Display',serif]">
                  Integração Google Meu Negócio
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  Oficial Google
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Gerencie o perfil oficial, link de avaliação direta e QR Code de balcão do estúdio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 px-6 bg-stone-50/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('config')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'border-[#C57E6B] text-[#C57E6B] bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            Configurar Link & Local
          </button>

          <button
            onClick={() => setActiveTab('qrcode')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'qrcode'
                ? 'border-[#C57E6B] text-[#C57E6B] bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            Placa de Balcão & QR Code
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-[#C57E6B] text-[#C57E6B] bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            Avaliações ({reviews.length})
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'whatsapp'
                ? 'border-[#C57E6B] text-[#C57E6B] bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            Pedir no WhatsApp
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'config' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <p className="font-bold">Como pegar o link direto no seu Google Meu Negócio:</p>
                  <ol className="list-decimal list-inside space-y-0.5 text-amber-800/90 text-[11px]">
                    <li>Pesquise <strong>"meu negócio"</strong> no aplicativo do Google ou no navegador.</li>
                    <li>No painel da sua empresa <em>Kethelin Beauty Nails</em>, clique em <strong>"Pedir avaliações"</strong>.</li>
                    <li>Copie o link curto gerado (ex: <code className="bg-amber-100 px-1 rounded">https://g.page/r/.../review</code> ou <code className="bg-amber-100 px-1 rounded">https://search.google.com/local/writereview?placeid=...</code>) e cole abaixo.</li>
                  </ol>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1.5">
                    Link de Avaliação Direta ou Place ID do Google Meu Negócio
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tempUrlOrPlaceId}
                      onChange={(e) => setTempUrlOrPlaceId(e.target.value)}
                      placeholder="Ex: https://g.page/r/.../review ou https://maps.app.goo.gl/..."
                      className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#C57E6B] focus:ring-1 focus:ring-[#C57E6B]"
                    />
                    <a
                      href={currentDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Testar como a cliente vê o link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Testar</span>
                    </a>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Ao clicar em "Testar", o Google deve abrir diretamente a janela com as 5 estrelas para a cliente avaliar.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1.5">
                    Endereço Oficial Cadastrado no Google Maps
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={tempAddress}
                      onChange={(e) => setTempAddress(e.target.value)}
                      placeholder="Rua Edmar Matosinho, 10 - Parque Bandeirantes, Mauá - SP"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#C57E6B] focus:ring-1 focus:ring-[#C57E6B]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveConfig}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C57E6B] to-[#b36a57] text-white text-xs font-bold shadow-sm hover:opacity-95 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Salvar Configurações do Google</span>
                    </button>
                    {savedSuccess && (
                      <span className="text-xs font-bold text-emerald-600 animate-in fade-in">
                        ✓ Salvo com sucesso!
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar Link de Avaliação'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qrcode' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Print Preview Card */}
                <div
                  id="print-qr-card"
                  className="bg-gradient-to-b from-[#FAF8F5] to-white p-6 rounded-3xl border border-rose-200/80 shadow-md text-center flex flex-col items-center relative"
                >
                  <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-[#C57E6B] mb-2">
                    <Sparkles className="w-3 h-3" />
                    Kethelin Beauty Nails
                  </div>

                  <h3 className="text-lg font-normal font-['Playfair_Display',serif] text-stone-900 mb-1">
                    Sua Opinião Faz Brilhar Nosso Trabalho
                  </h3>
                  <p className="text-[11px] text-stone-600 mb-4 max-w-xs">
                    Aponte a câmera do seu celular para o QR Code e deixe sua avaliação no <strong>Google Meu Negócio</strong>
                  </p>

                  <div className="p-3 bg-white rounded-2xl shadow-xs border border-stone-200 mb-3">
                    <img
                      src={qrCodeImgUrl}
                      alt="QR Code Google Meu Negócio"
                      className="w-44 h-44 object-contain rounded-lg"
                    />
                  </div>

                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-[10px] text-stone-400 font-medium">
                    {tempAddress || STUDIO_INFO.address}
                  </p>
                </div>

                {/* Print and Download Actions */}
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <Printer className="w-4 h-4 text-[#C57E6B]" />
                      Placa para Expor no Balcão ou Espelho
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Imprima ou envie este QR Code. Clientes que estão aguardando ou finalizando o alongamento podem apontar o celular e avaliar em 30 segundos!
                    </p>
                  </div>

                  <div className="space-y-2">
                    <a
                      href={qrCodeImgUrl}
                      download="qrcode-google-kethelin.png"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-[#C57E6B] text-white text-xs font-bold hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-xs"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Baixar Imagem do QR Code</span>
                    </a>

                    <button
                      onClick={handlePrintQr}
                      className="w-full py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Printer className="w-4 h-4 text-stone-500" />
                      <span>Imprimir Placa de Mesa</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Avaliações Registradas ({reviews.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Estas são as avaliações reais recebidas que aparecem com destaque na página inicial.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingReview(!isAddingReview)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#C57E6B] text-xs font-bold border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingReview ? 'Cancelar' : 'Cadastrar Avaliação do Google'}</span>
                </button>
              </div>

              {isAddingReview && (
                <form onSubmit={handleAddNewReview} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <h4 className="text-xs font-bold text-stone-800">
                    Registrar Nova Avaliação Recebida no Google
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Nome da Cliente *</label>
                      <input
                        type="text"
                        required
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        placeholder="Ex: Amanda Silva"
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:border-[#C57E6B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Procedimento</label>
                      <input
                        type="text"
                        value={newService}
                        onChange={(e) => setNewService(e.target.value)}
                        placeholder="Ex: Alongamento em Fibra de Vidro"
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:border-[#C57E6B]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Estrelas (1 a 5)</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setNewRating(s)}
                            className="p-1 cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                s <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Data da Avaliação</label>
                      <input
                        type="text"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        placeholder="Ex: há 3 dias"
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:border-[#C57E6B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Texto da Avaliação *</label>
                    <textarea
                      required
                      rows={2}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Texto que a cliente escreveu no Google..."
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:border-[#C57E6B] resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingReview(false)}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 text-xs hover:bg-stone-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-[#C57E6B] text-white text-xs font-bold hover:opacity-90"
                    >
                      Adicionar à Página
                    </button>
                  </div>
                </form>
              )}

              {reviews.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200/80">
                  <Star className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs font-medium text-stone-600">
                    Ainda não há avaliações cadastradas.
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Envie o link ou o QR Code para suas primeiras clientes para receber suas avaliações 5 estrelas!
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3 bg-white rounded-xl border border-stone-200 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-xs shrink-0 ${rev.avatarColor}`}
                        >
                          {rev.avatarLetter}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-stone-900">{rev.author}</span>
                            <div className="flex items-center text-amber-400 text-xs">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400" />
                              ))}
                            </div>
                            <span className="text-[10px] text-stone-400">{rev.date}</span>
                          </div>
                          <p className="text-xs text-stone-600 mt-0.5 italic">"{rev.comment}"</p>
                          <span className="inline-block text-[10px] text-[#A66E5E] bg-rose-50 px-1.5 py-0.5 rounded mt-1">
                            {rev.service}
                          </span>
                        </div>
                      </div>

                      {onDeleteReview && (
                        <button
                          onClick={() => onDeleteReview(rev.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                <h4 className="text-xs font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  Mensagem Pronta para Pedir Avaliação Pós-Atendimento
                </h4>
                <p className="text-xs text-emerald-800">
                  Copie e envie para a cliente logo após finalizar o atendimento pelo WhatsApp:
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 relative">
                <pre className="text-xs text-stone-800 font-sans whitespace-pre-wrap leading-relaxed">
                  {whatsappMessageTemplate}
                </pre>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(whatsappMessageTemplate);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-bold text-stone-700 shadow-2xs hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(whatsappMessageTemplate)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartilhar via WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
