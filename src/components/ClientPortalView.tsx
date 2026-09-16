import React, { useState } from 'react';
import { Appointment, Client, ServiceItem } from '../types';
import { STUDIO_INFO } from '../data/initialData';
import { formatCurrency, formatDateBR, getWhatsAppUrl } from '../utils/formatters';
import { BrandLogo } from './BrandLogo';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Phone,
  Heart,
  Gift,
  ShieldCheck,
  Search,
  ArrowLeft,
  ChevronRight,
  Info,
  Share2,
} from 'lucide-react';

interface ClientPortalViewProps {
  services: ServiceItem[];
  appointments: Appointment[];
  clients: Client[];
  initialSelectedServiceId?: string;
  onBookAppointment: (appointment: Appointment, clientData: Partial<Client>) => void;
  onBackToHome: () => void;
  onGoToManicurePanel: () => void;
  onShareClientLink?: () => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  services,
  appointments,
  clients,
  initialSelectedServiceId,
  onBookAppointment,
  onBackToHome,
  onGoToManicurePanel,
  onShareClientLink,
}) => {
  type ClientTab = 'agendar' | 'meus-horarios' | 'fidelidade' | 'cuidados';
  const [activeTab, setActiveTab] = useState<ClientTab>('agendar');

  // Booking Form State
  const activeServices = services.filter((s) => s.active);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialSelectedServiceId || 'srv-fibra'
  );
  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>([]);
  const [date, setDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState<string>('10:00');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [preferredShape, setPreferredShape] = useState('amendoada');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState<Appointment | null>(null);

  // Search by Phone State for "Meus Horários"
  const [searchPhone, setSearchPhone] = useState('');
  const [foundAppointments, setFoundAppointments] = useState<Appointment[] | null>(null);
  const [searchedClient, setSearchedClient] = useState<Client | null>(null);

  // Available Time Slots
  const timeSlots = ['09:00', '10:30', '13:00', '14:30', '16:00', '17:30'];

  // Calculate totals
  const mainService = services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedExtras = services.filter((s) => selectedExtraIds.includes(s.id));
  const totalPrice = (mainService?.price || 0) + selectedExtras.reduce((acc, s) => acc + s.price, 0);
  const totalDuration = (mainService?.durationMinutes || 0) + selectedExtras.reduce((acc, s) => acc + s.durationMinutes, 0);

  // Check if slot is taken
  const isSlotBooked = (checkTime: string) => {
    return appointments.some(
      (a) => a.date === date && a.time === checkTime && a.status !== 'cancelado'
    );
  };

  const handleToggleExtra = (extraId: string) => {
    setSelectedExtraIds((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Por favor, informe seu nome e telefone para contato.');
      return;
    }

    const allServiceNames = [mainService.name, ...selectedExtras.map((s) => s.name)];
    const allServiceIds = [mainService.id, ...selectedExtraIds];

    const newAppointment: Appointment = {
      id: 'apt-client-' + Date.now(),
      clientId: 'cli-' + Date.now(),
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      serviceIds: allServiceIds,
      serviceNames: allServiceNames,
      date,
      time,
      durationMinutes: totalDuration,
      totalPrice,
      status: 'agendado',
      notes: notes.trim() ? `Formato: ${preferredShape}. Obs: ${notes.trim()}` : `Formato preferido: ${preferredShape}`,
      paymentMethod: 'pendente',
      paid: false,
    };

    onBookAppointment(newAppointment, {
      name: clientName.trim(),
      phone: clientPhone.trim(),
      preferredNailShape: preferredShape,
    });

    setBookingSuccess(newAppointment);
  };

  const handleSearchPhone = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = searchPhone.replace(/\D/g, '');
    if (!cleanQuery) return;

    const matchedAppointments = appointments.filter((a) =>
      a.clientPhone.replace(/\D/g, '').includes(cleanQuery)
    );
    const matchedClient = clients.find((c) =>
      c.phone.replace(/\D/g, '').includes(cleanQuery)
    );

    setFoundAppointments(matchedAppointments);
    setSearchedClient(matchedClient || null);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <header className="bg-white border-b border-rose-100 shadow-xs sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Voltar para a página inicial"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <BrandLogo size="md" showText={false} />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {onShareClientLink && (
              <button
                onClick={onShareClientLink}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A66E5E] bg-rose-50 hover:bg-rose-100 border border-rose-200/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                title="Compartilhar link deste portal com uma amiga"
              >
                <Share2 className="w-3.5 h-3.5 text-[#C57E6B]" />
                <span className="hidden sm:inline">Compartilhar Link</span>
              </button>
            )}
            <button
              onClick={onGoToManicurePanel}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-400 bg-white transition-colors cursor-pointer"
            >
              🔒 Área da Manicure
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner inside Portal */}
      <div className="bg-gradient-to-r from-[#FAF1EE] to-[#FAF8F5] border-b border-rose-100/60 py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#A66E5E] uppercase tracking-wider bg-white px-2.5 py-0.5 rounded-full border border-rose-200/60 mb-1">
              <Sparkles className="w-3 h-3 text-[#C57E6B]" />
              <span>Espaço da Cliente</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal font-['Playfair_Display',serif] text-stone-900">
              Agende seu momento de cuidado
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Rua Edmar Matosinho, 10 • WhatsApp (11) 95251-7402
            </p>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="flex bg-white p-1 rounded-2xl border border-stone-200 shadow-xs text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('agendar');
                setBookingSuccess(null);
              }}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'agendar'
                  ? 'bg-[#C57E6B] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Agendar Online
            </button>
            <button
              onClick={() => setActiveTab('meus-horarios')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'meus-horarios'
                  ? 'bg-[#C57E6B] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Meus Horários
            </button>
            <button
              onClick={() => setActiveTab('fidelidade')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'fidelidade'
                  ? 'bg-[#C57E6B] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Cartão Fidelidade
            </button>
            <button
              onClick={() => setActiveTab('cuidados')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'cuidados'
                  ? 'bg-[#C57E6B] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Dicas & Cuidados
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* TAB 1: AGENDAMENTO ONLINE */}
        {activeTab === 'agendar' && (
          <div>
            {bookingSuccess ? (
              <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-lg text-center max-w-lg mx-auto space-y-5 animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl font-bold font-['Playfair_Display',serif] text-stone-900">
                    Agendamento Solicitado!
                  </h2>
                  <p className="text-sm text-stone-600">
                    Obrigada, <strong>{bookingSuccess.clientName}</strong>! Seu horário foi registrado no sistema da Kethelin Beauty Nails.
                  </p>
                </div>

                <div className="bg-[#FAF8F5] rounded-2xl p-4 text-xs text-stone-700 text-left space-y-2 border border-stone-200/60">
                  <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span className="text-stone-500">Procedimento:</span>
                    <strong className="text-stone-900">{bookingSuccess.serviceNames.join(', ')}</strong>
                  </div>
                  <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span className="text-stone-500">Data e Horário:</span>
                    <strong className="text-[#C57E6B]">
                      {formatDateBR(bookingSuccess.date)} às {bookingSuccess.time}
                    </strong>
                  </div>
                  <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span className="text-stone-500">Valor Estimado:</span>
                    <strong className="text-emerald-700 font-bold">{formatCurrency(bookingSuccess.totalPrice)}</strong>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-stone-500">Endereço:</span>
                    <span className="text-stone-800 text-right">{STUDIO_INFO.address}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <a
                    href={`https://wa.me/${STUDIO_INFO.phoneRaw}?text=Ol%C3%A1%2C%20Kethelin!%20Acabei%20de%20agendar%20pelo%20site%3A%0A%0A%E2%9C%A8%20*Nome%3A*%20${encodeURIComponent(
                      bookingSuccess.clientName
                    )}%0A%F0%9F%93%85%20*Data%3A*%20${formatDateBR(bookingSuccess.date)}%20%C3%A0s%20${
                      bookingSuccess.time
                    }%0A%F0%9F%92%85%20*Servi%C3%A7o%3A*%20${encodeURIComponent(
                      bookingSuccess.serviceNames.join(', ')
                    )}%0A%F0%9F%92%B0%20*Valor%3A*%20${formatCurrency(
                      bookingSuccess.totalPrice
                    )}%0A%0APoderia%20confirmar%20por%20gentileza%3F%20%E2%9D%A4%EF%B8%8F`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Confirmar pelo WhatsApp da Kethelin</span>
                  </a>

                  {/* Google Review Invite Link */}
                  <a
                    href={STUDIO_INFO.googleReviewsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
                    <span>Avaliar Kethelin Beauty Nails no Google ⭐⭐⭐⭐⭐</span>
                  </a>

                  <button
                    onClick={() => {
                      setBookingSuccess(null);
                      setClientName('');
                      setClientPhone('');
                      setNotes('');
                    }}
                    className="text-xs text-stone-500 hover:text-stone-800 underline font-medium cursor-pointer"
                  >
                    Fazer outro agendamento
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="space-y-8">
                {/* 1. Escolha do Procedimento */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-[#FAF1EE] text-[#A66E5E] font-bold text-xs flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-lg font-bold font-['Playfair_Display',serif] text-stone-900">
                      Escolha o Procedimento Principal
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeServices
                      .filter((s) => s.category === 'alongamento' || s.category === 'manicure')
                      .map((srv) => {
                        const isSelected = selectedServiceId === srv.id;
                        return (
                          <div
                            key={srv.id}
                            onClick={() => setSelectedServiceId(srv.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'border-[#C57E6B] bg-[#FAF1EE]/60 ring-2 ring-[#C57E6B]/20 shadow-xs'
                                : 'border-stone-200 hover:border-stone-300 bg-white'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="text-sm font-bold text-stone-900">{srv.name}</h3>
                                <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{srv.description}</p>
                              </div>
                              <span className="text-base font-extrabold text-[#C57E6B] shrink-0">
                                {formatCurrency(srv.price)}
                              </span>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {srv.durationMinutes} min
                              </span>
                              <span className={`font-semibold ${isSelected ? 'text-[#C57E6B]' : 'text-stone-400'}`}>
                                {isSelected ? 'Selecionado' : 'Selecionar'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Adicionais opcionais */}
                  <div className="mt-6 pt-4 border-t border-stone-100">
                    <p className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                      Adicionais Opcionais:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeServices
                        .filter((s) => s.category === 'nailart' || s.id === 'srv-remocao')
                        .map((extra) => {
                          const isChecked = selectedExtraIds.includes(extra.id);
                          return (
                            <label
                              key={extra.id}
                              className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                isChecked
                                  ? 'border-[#C57E6B] bg-rose-50/40 text-stone-900 font-semibold'
                                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleExtra(extra.id)}
                                  className="rounded text-[#C57E6B] focus:ring-[#C57E6B]"
                                />
                                <span>{extra.name}</span>
                              </div>
                              <span className="font-bold text-[#C57E6B]">+{formatCurrency(extra.price)}</span>
                            </label>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* 2. Data e Horário */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-[#FAF1EE] text-[#A66E5E] font-bold text-xs flex items-center justify-center">
                      2
                    </span>
                    <h2 className="text-lg font-bold font-['Playfair_Display',serif] text-stone-900">
                      Selecione o Dia e o Horário
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-2">
                        Data do Atendimento:
                      </label>
                      <input
                        type="date"
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-[#C57E6B] focus:ring-1 focus:ring-[#C57E6B] outline-hidden bg-white"
                        required
                      />
                      <p className="text-[11px] text-stone-400 mt-1">Atendimento de segunda a sábado.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-2">
                        Horários Disponíveis no Dia:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((slot) => {
                          const booked = isSlotBooked(slot);
                          const isSelected = time === slot;
                          return (
                            <button
                              type="button"
                              key={slot}
                              disabled={booked}
                              onClick={() => setTime(slot)}
                              className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                                booked
                                  ? 'bg-stone-100 text-stone-400 border-stone-200 line-through cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-[#C57E6B] text-white border-[#C57E6B] shadow-xs'
                                  : 'bg-white text-stone-700 border-stone-200 hover:border-[#C57E6B]'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Seus Dados */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-[#FAF1EE] text-[#A66E5E] font-bold text-xs flex items-center justify-center">
                      3
                    </span>
                    <h2 className="text-lg font-bold font-['Playfair_Display',serif] text-stone-900">
                      Seus Dados para Contato
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Seu Nome Completo *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Beatriz Silva"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-[#C57E6B] focus:ring-1 focus:ring-[#C57E6B] outline-hidden"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        WhatsApp (com DDD) *
                      </label>
                      <input
                        type="tel"
                        placeholder="Ex: (11) 98765-4321"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-[#C57E6B] focus:ring-1 focus:ring-[#C57E6B] outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Formato de Unha Desejado:
                      </label>
                      <select
                        value={preferredShape}
                        onChange={(e) => setPreferredShape(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-[#C57E6B] focus:ring-1 focus:ring-[#C57E6B] outline-hidden bg-white"
                      >
                        <option value="amendoada">Amendoada (Almond) - Mais pedido</option>
                        <option value="quadrada">Quadrada clássica</option>
                        <option value="bailarina">Bailarina (Coffin)</option>
                        <option value="stiletto">Stiletto marcante</option>
                        <option value="oval">Oval delicada</option>
                        <option value="redonda">Redonda natural</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Observações ou Alergias (Opcional):
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Alergia a esmalte comum, unhas roídas..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-[#C57E6B] focus:ring-1 focus:ring-[#C57E6B] outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Resumo Final e Botão de Agendar */}
                <div className="bg-[#FAF1EE] rounded-3xl p-6 border border-[#edd5cd] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-stone-500 block">Total Previsto:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                        {formatCurrency(totalPrice)}
                      </span>
                      <span className="text-xs text-stone-600">
                        (Duração estimada: ~{totalDuration} min)
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Pagamento realizado no estúdio via Pix, Cartão ou Dinheiro.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#C57E6B] to-[#b36a57] hover:from-[#b36a57] hover:to-[#9c5947] text-white font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    Confirmar Agendamento
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: MEUS HORÁRIOS */}
        {activeTab === 'meus-horarios' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
              <h2 className="text-xl font-bold font-['Playfair_Display',serif] text-stone-900 mb-2">
                Consultar Meus Agendamentos
              </h2>
              <p className="text-xs text-stone-600 mb-4">
                Digite seu número de WhatsApp para ver os horários marcados ou histórico.
              </p>

              <form onSubmit={handleSearchPhone} className="flex gap-2 max-w-md">
                <input
                  type="tel"
                  placeholder="Ex: (11) 98765-4321"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-[#C57E6B] outline-hidden"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C57E6B] text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-[#b36a57] transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Buscar</span>
                </button>
              </form>
            </div>

            {foundAppointments !== null && (
              <div className="space-y-4">
                {foundAppointments.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 text-stone-500 text-sm">
                    Nenhum agendamento encontrado para este número. Deseja agendar um horário novo?
                  </div>
                ) : (
                  foundAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                              apt.status === 'confirmado'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : apt.status === 'concluido'
                                ? 'bg-stone-100 text-stone-700'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {apt.status}
                          </span>
                          <span className="text-xs font-bold text-[#C57E6B]">
                            {formatDateBR(apt.date)} às {apt.time}
                          </span>
                        </div>
                        <h3 className="font-bold text-stone-900 text-sm">{apt.serviceNames.join(', ')}</h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Valor: {formatCurrency(apt.totalPrice)} • {STUDIO_INFO.address}
                        </p>
                      </div>

                      <a
                        href={`https://wa.me/${STUDIO_INFO.phoneRaw}?text=Ol%C3%A1%20Kethelin%2C%20sobre%20o%20meu%20agendamento%20do%20dia%20${formatDateBR(
                          apt.date
                        )}%20%C3%A0s%20${apt.time}...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Falar no WhatsApp</span>
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CARTÃO FIDELIDADE */}
        {activeTab === 'fidelidade' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-[#A66E5E] tracking-wider">
                  Programa Fidelidade VIP
                </span>
                <h2 className="text-2xl font-bold font-['Playfair_Display',serif] text-stone-900 mt-1">
                  Cartão Fidelidade Kethelin
                </h2>
                <p className="text-xs text-stone-500">
                  A cada procedimento concluído, você ganha 1 carimbo. No 10º atendimento, ganhe R$ 30 de desconto ou Nail Art completa de cortesia!
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#FAF1EE] text-[#C57E6B] flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6" />
              </div>
            </div>

            {/* Cartela de 10 carimbos */}
            <div className="grid grid-cols-5 gap-3 sm:gap-4 py-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const isStamped = num <= 3; // Exemplo interativo com 3 carimbos
                return (
                  <div
                    key={num}
                    className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all ${
                      num === 10
                        ? 'border-amber-400 bg-amber-50/50 text-amber-700'
                        : isStamped
                        ? 'border-[#C57E6B] bg-[#FAF1EE] text-[#C57E6B]'
                        : 'border-dashed border-stone-200 text-stone-300'
                    }`}
                  >
                    {isStamped ? (
                      <Heart className="w-5 h-5 fill-current" />
                    ) : num === 10 ? (
                      <Gift className="w-5 h-5 text-amber-600" />
                    ) : (
                      <span className="text-xs font-bold text-stone-300">{num}</span>
                    )}
                    <span className="text-[10px] font-bold mt-1">
                      {num === 10 ? 'Prêmio!' : `#${num}`}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="bg-[#FAF8F5] rounded-2xl p-4 text-xs text-stone-600 border border-stone-200/60 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#C57E6B] shrink-0 mt-0.5" />
              <span>
                Seus carimbos são contabilizados automaticamente pela Kethelin sempre que seu atendimento for marcado como concluído no sistema.
              </span>
            </div>
          </div>
        )}

        {/* TAB 4: GUIA DE CUIDADOS */}
        {activeTab === 'cuidados' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
              <h2 className="text-2xl font-bold font-['Playfair_Display',serif] text-stone-900 mb-1">
                Guia de Cuidados com suas Unhas
              </h2>
              <p className="text-xs text-stone-500 mb-6">
                Dicas essenciais para prolongar a vida útil do seu alongamento e manter o brilho intacto.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/60 space-y-1.5">
                  <strong className="block text-stone-900 font-bold text-sm">
                    1. Unha não é ferramenta
                  </strong>
                  <p>
                    Evite abrir latinhas de refrigerante, caixas ou raspar etiquetas com a ponta das unhas. Use sempre a polpa dos dedos.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/60 space-y-1.5">
                  <strong className="block text-stone-900 font-bold text-sm">
                    2. Use luvas para limpeza
                  </strong>
                  <p>
                    Produtos químicos agressivos como água sanitária, desengordurantes e solventes enfraquecem o gel e tiram o brilho.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/60 space-y-1.5">
                  <strong className="block text-stone-900 font-bold text-sm">
                    3. Hidratação diária
                  </strong>
                  <p>
                    Aplique óleo hidratante nas cutículas todas as noites. Isso previne o ressecamento da pele e mantém o contorno impecável.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/60 space-y-1.5">
                  <strong className="block text-stone-900 font-bold text-sm">
                    4. Não arranque com os dentes!
                  </strong>
                  <p>
                    Arrancar o gel na força remove camadas da sua unha natural. Em caso de quebra ou descolamento, venha fazer uma manutenção segura.
                  </p>
                </div>
              </div>
            </div>

            {/* Google Review Invite Banner */}
            <div className="bg-gradient-to-r from-white to-rose-50/50 rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-stone-200/80 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                  <h3 className="font-bold text-stone-900 text-sm">
                    Já fez suas unhas com a Kethelin?
                  </h3>
                  <p className="text-xs text-stone-500">
                    Sua opinião no Google nos ajuda muito e apoia nosso trabalho! ⭐⭐⭐⭐⭐
                  </p>
                </div>
              </div>

              <a
                href={STUDIO_INFO.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C57E6B] to-[#b36a57] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Deixar Avaliação no Google</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
