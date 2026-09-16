import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Instagram,
  AlertCircle,
  Calendar,
  Sparkles,
  Heart,
  X,
  Edit2,
  Trash2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Client, NailShape, CuticleType, Appointment } from '../types';
import { formatCurrency, formatDateBR, getWhatsAppUrl } from '../utils/formatters';

interface ClientsViewProps {
  clients: Client[];
  appointments: Appointment[];
  onSaveClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
  onNewAppointmentWithClient: (client: Client) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  appointments,
  onSaveClient,
  onDeleteClient,
  onNewAppointmentWithClient,
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientForDetails, setSelectedClientForDetails] = useState<Client | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [allergiesInput, setAllergiesInput] = useState('');
  const [preferredNailShape, setPreferredNailShape] = useState<NailShape>('amendoada');
  const [cuticleType, setCuticleType] = useState<CuticleType>('normal');
  const [nailIssuesInput, setNailIssuesInput] = useState('');
  const [preferredColors, setPreferredColors] = useState('');
  const [notes, setNotes] = useState('');

  const openNewClientModal = () => {
    setClientToEdit(null);
    setName('');
    setPhone('');
    setInstagram('');
    setAllergiesInput('');
    setPreferredNailShape('amendoada');
    setCuticleType('normal');
    setNailIssuesInput('');
    setPreferredColors('');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditClientModal = (client: Client) => {
    setClientToEdit(client);
    setName(client.name);
    setPhone(client.phone);
    setInstagram(client.instagram || '');
    setAllergiesInput(client.allergies ? client.allergies.join(', ') : '');
    setPreferredNailShape(client.preferredNailShape || 'amendoada');
    setCuticleType(client.cuticleType || 'normal');
    setNailIssuesInput(client.nailIssues ? client.nailIssues.join(', ') : '');
    setPreferredColors(client.preferredColors || '');
    setNotes(client.notes || '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const allergies = allergiesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const nailIssues = nailIssuesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const clientData: Client = {
      id: clientToEdit ? clientToEdit.id : 'cli-' + Date.now(),
      name: name.trim(),
      phone: phone.trim() || '(11) 99999-9999',
      instagram: instagram.trim() || undefined,
      allergies,
      preferredNailShape,
      cuticleType,
      nailIssues,
      preferredColors: preferredColors.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: clientToEdit?.createdAt || new Date().toISOString().split('T')[0],
      totalSpent: clientToEdit?.totalSpent || 0,
      appointmentsCount: clientToEdit?.appointmentsCount || 0,
      lastVisit: clientToEdit?.lastVisit,
    };

    onSaveClient(clientData);
    setIsModalOpen(false);
  };

  // Filtered clients
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.instagram && c.instagram.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-100">
                Ficha de Anamnese & Clientes
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-['Playfair_Display',serif] text-stone-900 mt-1">
              Cadastro de Clientes
            </h1>
            <p className="text-xs text-stone-500">
              Histórico de atendimentos, preferências de formato, alergias e cores favoritas.
            </p>
          </div>

          <button
            onClick={openNewClientModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Cliente</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar cliente por nome, telefone ou Instagram..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Clients Cards Grid */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-stone-200 shadow-2xs">
          <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-stone-700">Nenhuma cliente encontrada</p>
          <p className="text-xs text-stone-400 mt-1">Tente buscar por outro termo ou cadastre uma nova cliente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const clientAppointments = appointments.filter((a) => a.clientId === client.id);

            return (
              <div
                key={client.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top: Name & Quick Edit */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-stone-900 leading-tight">
                        {client.name}
                      </h3>
                      {client.instagram && (
                        <p className="text-xs text-rose-600 font-medium mt-0.5">
                          {client.instagram}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditClientModal(client)}
                        title="Editar cliente"
                        className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteClient(client.id)}
                        title="Excluir cliente"
                        className="p-1.5 rounded-lg border border-stone-200 hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Phone & WhatsApp */}
                  <div className="flex items-center gap-2 mt-2 text-xs text-stone-600">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>{client.phone}</span>
                    <a
                      href={getWhatsAppUrl(
                        client.phone,
                        `Olá ${client.name.split(' ')[0]}! Tudo bem? Passando para conversar sobre suas unhas!`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      WhatsApp
                    </a>
                  </div>

                  {/* Anamnesis Badges */}
                  <div className="mt-3 space-y-2 pt-3 border-t border-stone-100">
                    {/* Format & Cuticle */}
                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      {client.preferredNailShape && (
                        <span className="bg-rose-50 text-rose-800 border border-rose-100 px-2 py-0.5 rounded-md font-medium capitalize">
                          💅 Formato: {client.preferredNailShape}
                        </span>
                      )}
                      {client.cuticleType && (
                        <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium capitalize">
                          Cutícula: {client.cuticleType}
                        </span>
                      )}
                    </div>

                    {/* Allergies Warning */}
                    {client.allergies && client.allergies.length > 0 ? (
                      <div className="flex items-center gap-1.5 text-xs text-rose-800 bg-rose-50/80 p-2 rounded-lg border border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span className="text-[11px] leading-tight">
                          <strong>Alergias:</strong> {client.allergies.join(', ')}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] text-emerald-700">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Sem alergias relatadas</span>
                      </div>
                    )}

                    {/* Preferred colors */}
                    {client.preferredColors && (
                      <p className="text-[11px] text-stone-500 line-clamp-1">
                        <strong className="text-stone-700">Cores favoritas:</strong> {client.preferredColors}
                      </p>
                    )}

                    {/* Notes */}
                    {client.notes && (
                      <p className="text-[11px] text-stone-500 italic bg-stone-50 p-1.5 rounded-md border border-stone-100 line-clamp-2">
                        "{client.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom stats & Agendar button */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold">Total Investido</span>
                    <p className="text-xs font-bold text-stone-800">{formatCurrency(client.totalSpent)}</p>
                  </div>

                  <button
                    onClick={() => onNewAppointmentWithClient(client)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold border border-rose-200 transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Agendar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: New / Edit Client */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-rose-50/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-stone-900">
                  {clientToEdit ? 'Editar Ficha da Cliente' : 'Nova Cliente & Anamnese'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Larissa Monteiro"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    WhatsApp / Telefone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="(11) 98765-4321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Instagram (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="@usuario"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Anamnesis section */}
              <div className="bg-rose-50/40 p-4 rounded-xl border border-rose-100 space-y-3">
                <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  Ficha Técnica & Preferências de Unha
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Formato de Unha Favorito
                    </label>
                    <select
                      value={preferredNailShape}
                      onChange={(e) => setPreferredNailShape(e.target.value as NailShape)}
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-800 capitalize focus:outline-hidden"
                    >
                      <option value="amendoada">Amendoada</option>
                      <option value="quadrada">Quadrada</option>
                      <option value="bailarina">Bailarina (Coffin)</option>
                      <option value="stiletto">Stiletto</option>
                      <option value="oval">Oval</option>
                      <option value="redonda">Redonda</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Tipo de Cutícula
                    </label>
                    <select
                      value={cuticleType}
                      onChange={(e) => setCuticleType(e.target.value as CuticleType)}
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-800 capitalize focus:outline-hidden"
                    >
                      <option value="normal">Normal</option>
                      <option value="fina">Fina / Sensível</option>
                      <option value="grossa">Grossa / Aderente</option>
                      <option value="ressecada">Ressecada</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Alergias a Produtos / Esmaltes (separe por vírgula)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Tolueno, Formaldeído, DBP, Glúten, Nenhuma"
                    value={allergiesInput}
                    onChange={(e) => setAllergiesInput(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Queixas / Particularidades da Lâmina
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Roedora, Unhas finas, Ondulações, Quebra fácil"
                    value={nailIssuesInput}
                    onChange={(e) => setNailIssuesInput(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cores e Estilos Favoritos
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Nudes rosados, Francesinha sorriso, Vermelho bordô"
                    value={preferredColors}
                    onChange={(e) => setPreferredColors(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Observações Gerais
                </label>
                <textarea
                  rows={2}
                  placeholder="Informações adicionais sobre o atendimento, café preferido, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
