import React, { useState } from 'react';
import { X, Star, Check, Sparkles } from 'lucide-react';
import { GoogleReview } from '../data/initialData';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReview: (review: GoogleReview) => void;
  availableServices?: string[];
  googleReviewUrl: string;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  onAddReview,
  availableServices = [],
  googleReviewUrl,
}) => {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [service, setService] = useState(availableServices[0] || 'Alongamento');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    const colors = ['bg-rose-500', 'bg-amber-600', 'bg-emerald-600', 'bg-indigo-600', 'bg-pink-500', 'bg-purple-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newRev: GoogleReview = {
      id: `rev-${Date.now()}`,
      author: author.trim(),
      avatarColor: randomColor,
      avatarLetter: author.trim().charAt(0).toUpperCase(),
      rating,
      date: 'recente',
      service: service.trim() || 'Atendimento Geral',
      comment: comment.trim(),
      verified: true,
    };

    onAddReview(newRev);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setAuthor('');
      setComment('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-rose-100 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 font-['Playfair_Display',serif]">
              Muito obrigada pela sua avaliação!
            </h3>
            <p className="text-xs text-stone-600">
              Seu depoimento real é essencial para o trabalho da Kethelin Beauty Nails.
            </p>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#C57E6B] bg-rose-50 px-3 py-1 rounded-full border border-rose-100 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Avaliação Real de Cliente
              </span>
              <h3 className="text-2xl font-normal font-['Playfair_Display',serif] text-stone-900">
                Conte sua experiência
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Sua avaliação honesta ajuda outras clientes e fortalece o estúdio.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Seu Nome *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Beatriz Lima"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#C57E6B] focus:ring-1 focus:ring-[#C57E6B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Sua Nota (1 a 5 estrelas)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-stone-700 ml-2">
                    {rating}.0
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Procedimento Realizado
                </label>
                <input
                  type="text"
                  placeholder="Ex: Alongamento em Fibra / Manicure"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#C57E6B] focus:ring-1 focus:ring-[#C57E6B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Seu Comentário / Depoimento *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Conte como foi o atendimento, a durabilidade das unhas, pontualidade..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#C57E6B] focus:ring-1 focus:ring-[#C57E6B] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C57E6B] to-[#b36a57] text-white font-bold text-sm shadow-md hover:opacity-95 transition-all cursor-pointer"
              >
                Publicar Avaliação Real
              </button>

              <div className="pt-2 text-center">
                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#C57E6B] hover:underline font-semibold"
                >
                  <span>Prefere avaliar direto no Google? Clique aqui</span>
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
