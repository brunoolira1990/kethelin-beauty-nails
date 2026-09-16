import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, DollarSign, User, Plus, Sparkles, Check, Phone } from 'lucide-react';
import { Appointment, Client, ServiceItem, PaymentMethod, AppointmentStatus } from '../types';
import { formatCurrency } from '../utils/formatters';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment, newClientData?: Partial<Client>) => void;
  appointmentToEdit?: Appointment | null;
  clients: Client[];
  services: ServiceItem[];
  defaultDate?: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  appointmentToEdit,
  clients,
  services,
  defaultDate,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const [isNewClient, setIsNewClient] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(
    appointmentToEdit?.clientId || clients[0]?.id || ''
  );
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    appointmentToEdit?.serviceIds || [services[0]?.id || '']
  );
  const [date, setDate] = useState(appointmentToEdit?.date || defaultDate || todayStr);
  const [time, setTime] = useState(appointmentToEdit?.time || '10:00');
  const [status, setStatus] = useState<AppointmentStatus>(appointmentToEdit?.status || 'confirmado');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    appointmentToEdit?.paymentMethod || 'pix'
  );
  const [paid, setPaid] = useState(appointmentToEdit?.paid || false);
  const [notes, setNotes] = useState(appointmentToEdit?.notes || '');
  const [nailArtNotes, setNailArtNotes] = useState(appointmentToEdit?.nailArtNotes || '');

  // Calculate totals
  const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id));
  const calculatedTotalPrice = selectedServices.reduce((acc, curr) => acc + curr.price, 0);
  const calculatedDuration = selectedServices.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const [customPrice, setCustomPrice] = useState<number | null>(
    appointmentToEdit ? appointmentToEdit.totalPrice : null
  );

  const finalPrice = customPrice !== null ? customPrice : calculatedTotalPrice;

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) => {
      if (prev.includes(serviceId)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let clientId = selectedClientId;
    let clientName = '';
    let clientPhone = '';
    let newClientData: Partial<Client> | undefined = undefined;

    if (isNewClient) {
      if (!newClientName.trim()) return;
      clientId = 'cli-' + Date.now();
      clientName = newClientName.trim();
      clientPhone = newClientPhone.trim() || '(11) 99999-0000';
      newClientData = {
        id: clientId,
        name: clientName,
        phone: clientPhone,
        createdAt: todayStr,
        totalSpent: 0,
        appointmentsCount: 0,
      };
    } else {
      const client = clients.find((c) => c.id === selectedClientId);
      clientName = client?.name || 'Cliente';
      clientPhone = client?.phone || '';
    }

    const serviceNames = selectedServices.map((s) => s.name);

    const updatedAppointment: Appointment = {
      id: appointmentToEdit?.id || 'apt-' + Date.now(),
      clientId,
      clientName,
      clientPhone,
      serviceIds: selectedServiceIds,
      serviceNames,
      date,
      time,
      durationMinutes: calculatedDuration,
      totalPrice: finalPrice,
      status,
      notes,
      nailArtNotes,
      paymentMethod,
      paid,
    };

    onSave(updatedAppointment, newClientData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-rose-50/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-stone-900">
              {appointmentToEdit ? 'Editar Agendamento' : 'Novo Agendamento'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Client Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700">Cliente</label>
              <button
                type="button"
                onClick={() => setIsNewClient(!isNewClient)}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
              >
                {isNewClient ? '← Selecionar existente' : '+ Nova cliente'}
              </button>
            </div>

            {isNewClient ? (
              <div className="space-y-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div>
                  <label className="block text-[11px] text-stone-500 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ana Clara Silva"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-500 mb-1">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                  />
                </div>
              </div>
            ) : (
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2.5 text-sm text-stone-900 font-medium focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Service Selection (Multi-select) */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Procedimentos / Serviços
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-stone-200 rounded-xl bg-stone-50/50">
              {services.map((svc) => {
                const isSelected = selectedServiceIds.includes(svc.id);
                return (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => toggleService(svc.id)}
                    className={`flex items-start justify-between p-2.5 rounded-lg text-left transition-all border ${
                      isSelected
                        ? 'bg-rose-50/80 border-rose-300 text-stone-900'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div className="pr-2">
                      <p className="text-xs font-semibold leading-tight">{svc.name}</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {svc.durationMinutes} min • {formatCurrency(svc.price)}
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-rose-600 border-rose-600 text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date, Time, Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Data</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Horário</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              >
                <option value="confirmado">Confirmado</option>
                <option value="agendado">Agendado</option>
                <option value="em_andamento">Em Atendimento</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Nail art & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Detalhes de Nail Art / Esmalte
              </label>
              <input
                type="text"
                placeholder="Ex: Francesinha, pedraria, encapsulada"
                value={nailArtNotes}
                onChange={(e) => setNailArtNotes(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-800 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Observações internas
              </label>
              <input
                type="text"
                placeholder="Ex: Cutícula sensível, cliente com pressa"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-800 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Payment & Price Summary Box */}
          <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-600 mb-1">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>
                  Tempo estimado: <strong className="text-stone-800">{calculatedDuration} min</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-600">Valor Total:</span>
                <input
                  type="number"
                  step="1"
                  value={finalPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  className="w-24 bg-white border border-rose-300 rounded-md px-2 py-1 text-sm font-bold text-rose-700 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                  Forma de Pagamento
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-hidden"
                >
                  <option value="pix">Pix</option>
                  <option value="cartao_credito">Cartão Crédito</option>
                  <option value="cartao_debito">Cartão Débito</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="pendente">Pagar na hora</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer mt-4">
                <input
                  type="checkbox"
                  checked={paid}
                  onChange={(e) => setPaid(e.target.checked)}
                  className="rounded-sm border-stone-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <span className="text-xs font-semibold text-stone-800">Pago</span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm shadow-rose-200 cursor-pointer"
            >
              Salvar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
