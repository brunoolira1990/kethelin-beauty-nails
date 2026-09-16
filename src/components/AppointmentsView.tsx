import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Phone,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Plus,
  Send,
  DollarSign,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { Appointment, Client, ServiceItem, AppointmentStatus } from '../types';
import { formatCurrency, formatDateBR, formatDayOfWeek, getWhatsAppUrl } from '../utils/formatters';

interface AppointmentsViewProps {
  appointments: Appointment[];
  clients: Client[];
  services: ServiceItem[];
  onNewAppointment: (date?: string) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
  onUpdateStatus: (id: string, status: AppointmentStatus, markPaid?: boolean) => void;
  onOpenQuickMessages: (client?: Client, appointment?: Appointment) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  clients,
  services,
  onNewAppointment,
  onEditAppointment,
  onDeleteAppointment,
  onUpdateStatus,
  onOpenQuickMessages,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Filter appointments for the selected date
  const filteredAppointments = appointments
    .filter((apt) => {
      const matchDate = apt.date === selectedDate;
      const matchStatus = statusFilter === 'todos' || apt.status === statusFilter;
      return matchDate && matchStatus;
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  // Day metrics
  const dayAppointments = appointments.filter((apt) => apt.date === selectedDate);
  const totalDayRevenue = dayAppointments
    .filter((a) => a.status !== 'cancelado')
    .reduce((acc, curr) => acc + curr.totalPrice, 0);
  const completedCount = dayAppointments.filter((a) => a.status === 'concluido').length;
  const confirmedCount = dayAppointments.filter((a) => a.status === 'confirmado').length;

  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === todayStr;

  const statusConfig: Record<
    AppointmentStatus,
    { label: string; bg: string; text: string; border: string }
  > = {
    agendado: {
      label: 'Agendado',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
    },
    confirmado: {
      label: 'Confirmado',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
    },
    em_andamento: {
      label: 'Em Atendimento',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
    },
    concluido: {
      label: 'Concluído',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
    },
    cancelado: {
      label: 'Cancelado',
      bg: 'bg-stone-100',
      text: 'text-stone-500',
      border: 'border-stone-200',
    },
  };

  return (
    <div className="space-y-6">
      {/* Date Header & Quick Nav */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A66E5E] bg-[#FAF1EE] px-2.5 py-0.5 rounded-md border border-[#edd5cd]">
                Studio Kethelin Beauty Nails
              </span>
              {isToday && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Hoje
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-['Playfair_Display',serif] text-stone-900 mt-1 capitalize">
              {formatDayOfWeek(selectedDate)}
            </h1>
            <p className="text-xs text-stone-500">
              {formatDateBR(selectedDate)} • {dayAppointments.length} agendamento
              {dayAppointments.length !== 1 ? 's' : ''} programado
              {dayAppointments.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Date Controls */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button
                onClick={handlePrevDay}
                title="Dia anterior"
                className="p-1.5 rounded-lg hover:bg-white text-stone-600 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSelectedDate(todayStr)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isToday
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-white'
                }`}
              >
                Hoje
              </button>

              <button
                onClick={handleNextDay}
                title="Próximo dia"
                className="p-1.5 rounded-lg hover:bg-white text-stone-600 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 font-medium focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
            />

            <button
              onClick={() => onNewAppointment(selectedDate)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Marcar Horário</span>
            </button>
          </div>
        </div>

        {/* Day Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-stone-100">
          <div className="bg-stone-50/70 p-3 rounded-xl border border-stone-100">
            <span className="text-[11px] text-stone-500 font-medium">Agendados no Dia</span>
            <p className="text-lg font-bold text-stone-900 mt-0.5">{dayAppointments.length}</p>
          </div>

          <div className="bg-stone-50/70 p-3 rounded-xl border border-stone-100">
            <span className="text-[11px] text-stone-500 font-medium">Confirmados</span>
            <p className="text-lg font-bold text-emerald-700 mt-0.5">{confirmedCount}</p>
          </div>

          <div className="bg-stone-50/70 p-3 rounded-xl border border-stone-100">
            <span className="text-[11px] text-stone-500 font-medium">Concluídos</span>
            <p className="text-lg font-bold text-blue-700 mt-0.5">{completedCount}</p>
          </div>

          <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100">
            <span className="text-[11px] text-rose-700 font-medium">Previsão de Receita</span>
            <p className="text-lg font-bold text-rose-900 mt-0.5">
              {formatCurrency(totalDayRevenue)}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5">
          {['todos', 'confirmado', 'agendado', 'em_andamento', 'concluido', 'cancelado'].map(
            (statusKey) => (
              <button
                key={statusKey}
                onClick={() => setStatusFilter(statusKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === statusKey
                    ? 'bg-stone-900 text-white shadow-2xs font-semibold'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {statusKey === 'todos' ? 'Todos os Status' : statusKey.replace('_', ' ')}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onOpenQuickMessages()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors shrink-0 cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Mensagens Rápidas WhatsApp</span>
        </button>
      </div>

      {/* Appointment Cards List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200/80 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-3">
            <CalendarIcon className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-stone-800">
            Nenhum agendamento para {isToday ? 'hoje' : 'esta data'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-5">
            Você não possui clientes marcadas para este dia ou para o filtro selecionado.
          </p>
          <button
            onClick={() => onNewAppointment(selectedDate)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agendar Novo Horário</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((apt) => {
            const client = clients.find((c) => c.id === apt.clientId);
            const statusStyle = statusConfig[apt.status];

            return (
              <div
                key={apt.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-2xs hover:shadow-xs transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Left: Time & Client Details */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Time Box */}
                    <div className="flex flex-col items-center justify-center bg-rose-50 border border-rose-100 rounded-xl w-16 h-16 shrink-0 text-rose-950">
                      <span className="text-base font-extrabold">{apt.time}</span>
                      <span className="text-[10px] text-rose-700 font-medium">
                        {apt.durationMinutes} min
                      </span>
                    </div>

                    {/* Client & Service Info */}
                    <div className="space-y-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-stone-900">
                          {apt.clientName}
                        </h3>

                        {/* Status Badge */}
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          {statusStyle.label}
                        </span>

                        {apt.paid && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Pago
                          </span>
                        )}
                      </div>

                      {/* Phone & Instagram */}
                      <div className="flex items-center gap-3 text-xs text-stone-500">
                        {apt.clientPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-stone-400" />
                            {apt.clientPhone}
                          </span>
                        )}
                        {client?.preferredNailShape && (
                          <span className="hidden sm:inline-block text-[11px] text-stone-600 bg-stone-100 px-2 py-0.2 rounded-md">
                            Formato: <strong className="capitalize">{client.preferredNailShape}</strong>
                          </span>
                        )}
                      </div>

                      {/* Services List */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {apt.serviceNames.map((svcName, i) => (
                          <span
                            key={i}
                            className="text-xs bg-rose-50/60 text-rose-900 border border-rose-100 px-2 py-0.5 rounded-lg font-medium"
                          >
                            {svcName}
                          </span>
                        ))}
                      </div>

                      {/* Nail Art / Notes */}
                      {(apt.nailArtNotes || apt.notes) && (
                        <div className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg border border-stone-200/60 mt-2 space-y-0.5">
                          {apt.nailArtNotes && (
                            <p className="flex items-center gap-1 text-rose-700">
                              <Sparkles className="w-3 h-3 shrink-0" />
                              <span>Nail Art: {apt.nailArtNotes}</span>
                            </p>
                          )}
                          {apt.notes && (
                            <p className="text-stone-500">Obs: {apt.notes}</p>
                          )}
                        </div>
                      )}

                      {/* Client Allergies warning if any */}
                      {client?.allergies && client.allergies.length > 0 && (
                        <div className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 mt-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>Alergias: {client.allergies.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Price & Quick Action Buttons */}
                  <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    <div className="text-right">
                      <span className="text-xs text-stone-400 block sm:inline">Total: </span>
                      <span className="text-base font-bold text-stone-900">
                        {formatCurrency(apt.totalPrice)}
                      </span>
                    </div>

                    {/* Action Group */}
                    <div className="flex items-center flex-wrap gap-1.5">
                      {/* WhatsApp Reminder Button */}
                      {apt.clientPhone && (
                        <button
                          onClick={() => onOpenQuickMessages(client, apt)}
                          title="Enviar mensagem WhatsApp"
                          className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="hidden sm:inline">Lembrete</span>
                        </button>
                      )}

                      {/* Status Quick Changer */}
                      {apt.status !== 'concluido' && (
                        <button
                          onClick={() => onUpdateStatus(apt.id, 'concluido', true)}
                          title="Finalizar atendimento e registrar recebimento"
                          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Concluir</span>
                        </button>
                      )}

                      {/* Edit */}
                      <button
                        onClick={() => onEditAppointment(apt)}
                        title="Editar agendamento"
                        className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteAppointment(apt.id)}
                        title="Remover agendamento"
                        className="p-1.5 rounded-lg border border-stone-200 hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
