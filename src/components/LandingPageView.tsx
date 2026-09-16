import React from 'react';
import { BrandLogo } from './BrandLogo';
import { STUDIO_INFO } from '../data/initialData';
import { ServiceItem } from '../types';
import {
  Calendar,
  Sparkles,
  MapPin,
  Phone,
  Instagram,
  Clock,
  ShieldCheck,
  Heart,
  ArrowRight,
  Check,
  Star,
  ChevronRight,
  HelpCircle,
  Share2,
  Lock,
} from 'lucide-react';

interface LandingPageViewProps {
  services: ServiceItem[];
  onGoToBooking: (serviceId?: string) => void;
  onGoToClientPortal: () => void;
  onGoToManicurePanel: () => void;
  onShareClientLink?: () => void;
  isManicureLoggedIn?: boolean;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  services,
  onGoToBooking,
  onGoToClientPortal,
  onGoToManicurePanel,
  onShareClientLink,
  isManicureLoggedIn = false,
}) => {
  const activeServices = services.filter((s) => s.active);

  const keyServices = [
    {
      id: 'srv-fibra',
      name: 'Alongamento em Fibra de Vidro',
      price: 70,
      badge: 'Mais Pedido',
      description: 'Estrutura fininha e ultra resistente. Aspecto idêntico ao da unha natural com curvatura C simétrica.',
      highlight: true,
      features: ['Durabilidade prolongada', 'Alta resistência mecânica', 'Acabamento natural e delicado'],
    },
    {
      id: 'srv-molde-f1',
      name: 'Alongamento no Molde F1',
      price: 65,
      badge: 'Técnica Express',
      description: 'Aplicação ágil no dual form com superfície lisa espelhada e tempo de mesa reduzido.',
      features: ['Simetria perfeita', 'Brilho espelhado', 'Ideal para quem tem pressa'],
    },
    {
      id: 'srv-banho-gel',
      name: 'Banho em Gel / Blindagem',
      price: 55,
      badge: 'Fortalecimento',
      description: 'Camada estruturada em gel sobre as unhas naturais, prevenindo quebras, descamações e lascas.',
      features: ['Não aumenta o comprimento', 'Fortalece unhas fracas', 'Mantém o esmalte por semanas'],
    },
    {
      id: 'srv-esmalte-gel',
      name: 'Esmaltação em Gel',
      price: 45,
      badge: 'Praticidade',
      description: 'Secagem instantânea na cabine UV/LED. Saia do atendimento com unhas 100% secas e intactas.',
      features: ['Secagem imediata', 'Brilho de vidro por 20 dias', 'Sem descascar'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Announcement Bar */}
      <div className="bg-[#FAF1EE] border-b border-[#edd5cd]/60 py-2 px-4 text-center text-xs font-medium text-[#8e5a4c]">
        <span>🌸 Atendimento exclusivo com hora marcada • </span>
        <span className="font-semibold text-[#b36a57]">Rua Edmar Matosinho, nº 10</span>
        <span className="hidden sm:inline"> • Agende pelo WhatsApp ou direto no site</span>
      </div>

      {/* Hero Header */}
      <header className="relative overflow-hidden pt-6 pb-16 sm:pb-24 border-b border-rose-100/60 bg-gradient-to-b from-white via-rose-50/20 to-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation */}
          <div className="flex items-center justify-between pb-8 border-b border-stone-100">
            <BrandLogo size="md" showText={true} />
            <div className="flex items-center gap-1.5 sm:gap-3">
              {onShareClientLink && (
                <button
                  onClick={onShareClientLink}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A66E5E] bg-rose-50 hover:bg-rose-100 border border-rose-200/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Compartilhar link de agendamento da cliente"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#C57E6B]" />
                  <span className="hidden sm:inline">Compartilhar Link</span>
                </button>
              )}
              <button
                onClick={onGoToClientPortal}
                className="text-xs sm:text-sm font-semibold text-stone-700 hover:text-[#b36a57] px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                Espaço da Cliente
              </button>
              <button
                onClick={onGoToManicurePanel}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 px-2.5 py-1.5 rounded-xl border border-stone-200 hover:border-stone-400 bg-white transition-colors cursor-pointer shadow-xs"
                title={isManicureLoggedIn ? 'Painel da Manicure (Conectada)' : 'Área restrita da Manicure (Requer Login)'}
              >
                <Lock className="w-3.5 h-3.5 text-[#C57E6B]" />
                <span>{isManicureLoggedIn ? 'Painel Manicure' : 'Área da Manicure'}</span>
              </button>
            </div>
          </div>

          {/* Hero Content */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-xs font-bold text-[#A66E5E]">
                <Sparkles className="w-3.5 h-3.5 text-[#C57E6B]" />
                <span>Nail Designer Especialista em Estruturas em Gel</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-stone-900 font-['Playfair_Display',serif] leading-tight">
                Unhas delicadas, <br className="hidden sm:block" />
                <span className="italic font-medium text-[#C57E6B]">resistentes</span> e perfeitas.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Valorize sua beleza com técnicas modernas de <strong>Alongamento em Fibra de Vidro</strong>, <strong>Molde F1</strong>, <strong>Banho em Gel</strong> e <strong>Esmaltação Duradoura</strong>. Atendimento com pontualidade, biossegurança e muito carinho.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <button
                  id="btn-agendar-hero"
                  onClick={() => onGoToBooking()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#C57E6B] to-[#b36a57] hover:from-[#b36a57] hover:to-[#9c5947] text-white font-semibold text-sm shadow-md shadow-[#C57E6B]/30 hover:shadow-lg transition-all active:scale-98 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Agendar Horário Online</span>
                </button>

                <a
                  href={`https://wa.me/${STUDIO_INFO.phoneRaw}?text=Ol%C3%A1%2C%20Kethelin!%20Gostaria%20de%20saber%20os%20hor%C3%A1rios%20dispon%C3%ADveis%20para%20fazer%20minhas%20unhas.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white border border-stone-200 text-stone-700 font-semibold text-sm hover:border-emerald-500 hover:text-emerald-700 shadow-xs transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp: {STUDIO_INFO.phone}</span>
                </a>
              </div>

              {/* Quick Info Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C57E6B]" />
                  <span>{STUDIO_INFO.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-rose-500" />
                  <a
                    href={STUDIO_INFO.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-semibold text-stone-700"
                  >
                    {STUDIO_INFO.instagram}
                  </a>
                </div>
              </div>
            </div>

            {/* Visual Card with Brand */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-200/50 border border-rose-100/80">
                <div className="absolute -top-4 -right-4 bg-gradient-to-tr from-[#C57E6B] to-rose-400 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                  ✨ Atendimento VIP
                </div>

                <div className="text-center pb-6 border-b border-stone-100">
                  <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden shadow-sm border border-rose-100 p-1 bg-white mb-3">
                    <img
                      src="/logo.jpg"
                      alt="Kethelin Nails"
                      className="w-full h-full object-contain rounded-2xl"
                    />
                  </div>
                  <h3 className="font-['Great_Vibes',cursive] text-3xl text-[#C57E6B]">
                    Kethelin
                  </h3>
                  <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-stone-500">
                    BEAUTY NAILS
                  </p>
                </div>

                <div className="py-4 space-y-3 text-xs text-stone-600">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>
                      <strong>Materiais Esterilizados:</strong> Rigorosa biossegurança e descartáveis individuais para a sua proteção.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>
                      <strong>Produtos de Alta Qualidade:</strong> Géis e preparadores profissionais que não agridem sua lâmina.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>
                      <strong>Formato e Acabamento Personalizados:</strong> Amendoada, quadrada, bailarina ou stiletto sob medida para seu gosto.
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onGoToBooking()}
                    className="w-full py-3 bg-[#FAF1EE] hover:bg-[#f3e3dd] text-[#8e5a4c] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Ver Horários Disponíveis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Services and Pricing Table Section */}
      <section id="tabela-precos" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[#A66E5E] bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Tabela Oficial de Procedimentos
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal font-['Playfair_Display',serif] text-stone-900">
            Escolha o cuidado ideal para suas unhas
          </h2>
          <p className="text-sm text-stone-600">
            Preços transparentes, materiais premium e acabamento impecável em cada detalhe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyServices.map((service) => (
            <div
              key={service.id}
              className={`bg-white rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 hover:shadow-lg ${
                service.highlight
                  ? 'border-[#C57E6B] shadow-md shadow-[#C57E6B]/10 ring-2 ring-[#C57E6B]/20 relative'
                  : 'border-stone-200/80 shadow-xs'
              }`}
            >
              {service.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C57E6B] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                  Mais Pedido
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-[#A66E5E] bg-rose-50 px-2 py-0.5 rounded-md">
                    {service.badge}
                  </span>
                </div>

                <h3 className="font-['Playfair_Display',serif] text-lg font-bold text-stone-900 leading-snug">
                  {service.name}
                </h3>

                <div className="mt-3 mb-4 flex items-baseline gap-1">
                  <span className="text-xs text-stone-400 font-medium">R$</span>
                  <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
                    {service.price}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">,00</span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {service.description}
                </p>

                <div className="space-y-2 py-3 border-t border-stone-100 text-xs text-stone-600">
                  {service.features.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#C57E6B] shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <button
                  onClick={() => onGoToBooking(service.id)}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    service.highlight
                      ? 'bg-[#C57E6B] hover:bg-[#b36a57] text-white shadow-xs'
                      : 'bg-[#FAF1EE] hover:bg-[#f3e3dd] text-[#8e5a4c]'
                  }`}
                >
                  <span>Agendar este</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Location & Contact Section */}
      <section className="bg-white border-y border-stone-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-[#A66E5E] bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                Localização & Contato
              </span>

              <h2 className="text-3xl sm:text-4xl font-normal font-['Playfair_Display',serif] text-stone-900">
                Venha relaxar e cuidar da sua autoestima
              </h2>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Nosso espaço foi pensado para proporcionar uma experiência de calma, conforto e beleza. Atendemos com hora marcada para dedicar atenção total a você.
              </p>

              <div className="space-y-4 text-sm text-stone-700">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/60">
                  <MapPin className="w-5 h-5 text-[#C57E6B] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900">Endereço:</strong>
                    <span>{STUDIO_INFO.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/60">
                  <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900">WhatsApp & Telefone:</strong>
                    <a
                      href={`https://wa.me/${STUDIO_INFO.phoneRaw}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline font-semibold"
                    >
                      {STUDIO_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/60">
                  <Instagram className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900">Instagram:</strong>
                    <a
                      href={STUDIO_INFO.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-700 hover:underline font-semibold"
                    >
                      {STUDIO_INFO.instagram}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map / Booking Box */}
            <div className="bg-[#FAF8F5] rounded-3xl p-8 border border-rose-100 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-rose-100 flex items-center justify-center mx-auto text-[#C57E6B]">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-['Playfair_Display',serif] text-stone-900">
                  Horários de Atendimento
                </h3>
                <p className="text-xs text-stone-500 mt-1">Segunda a Sábado com horário reservado</p>
              </div>

              <div className="space-y-2 text-xs text-stone-700 max-w-xs mx-auto">
                <div className="flex justify-between py-1.5 border-b border-stone-200/60">
                  <span>Segunda a Sexta</span>
                  <span className="font-bold">09:00 às 19:00</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-200/60">
                  <span>Sábados</span>
                  <span className="font-bold">08:30 às 17:00</span>
                </div>
                <div className="flex justify-between py-1.5 text-stone-400">
                  <span>Domingos e Feriados</span>
                  <span>Fechado</span>
                </div>
              </div>

              <button
                onClick={() => onGoToBooking()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C57E6B] to-[#b36a57] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Reservar Meu Horário Agora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-lg" />
              </div>
              <div>
                <span className="font-['Great_Vibes',cursive] text-2xl text-rose-300">
                  Kethelin
                </span>
                <span className="block text-[9px] uppercase tracking-widest text-stone-400">
                  BEAUTY NAILS
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
              <button onClick={() => onGoToBooking()} className="hover:text-white transition-colors cursor-pointer">
                Agendamento
              </button>
              <button onClick={onGoToClientPortal} className="hover:text-white transition-colors cursor-pointer">
                Espaço da Cliente
              </button>
              <button onClick={onGoToManicurePanel} className="hover:text-rose-300 transition-colors cursor-pointer">
                🔒 Área da Manicure
              </button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <p>© {new Date().getFullYear()} Kethelin Beauty Nails. Todos os direitos reservados.</p>
            <p>Rua Edmar Matosinho, 10 • (11) 95251-7402</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
