import React, { useState } from 'react';
import { X, Send, Copy, Check, MessageSquare, Sparkles, Heart } from 'lucide-react';
import { Client, Appointment } from '../types';
import { formatDateBR, getWhatsAppUrl } from '../utils/formatters';

interface QuickMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  appointments: Appointment[];
  preselectedClient?: Client | null;
  preselectedAppointment?: Appointment | null;
}

export const QuickMessagesModal: React.FC<QuickMessagesModalProps> = ({
  isOpen,
  onClose,
  clients,
  appointments,
  preselectedClient,
  preselectedAppointment,
}) => {
  if (!isOpen) return null;

  const [selectedClientId, setSelectedClientId] = useState<string>(
    preselectedClient?.id || clients[0]?.id || ''
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const client = clients.find((c) => c.id === selectedClientId) || clients[0];
  const clientAppointments = appointments.filter((a) => a.clientId === client?.id);
  const nextAppointment = preselectedAppointment || clientAppointments[0];

  const studioName = 'Kethelin Beauty Nails';
  const studioAddress = 'Rua Edmar Matosinho, número 10';
  const studioInstagram = '@Nail_kethelinxz';

  const templates = [
    {
      title: 'Lembrete de Agendamento (24h antes)',
      description: 'Ideal para enviar no dia anterior ao atendimento para evitar furos.',
      text: `Olá ${client ? client.name.split(' ')[0] : 'linda'}, tudo bem? 🌸\n\nPassando para lembrar do seu horário no *${studioName}* amanhã!\n\n📅 Data: *${nextAppointment ? formatDateBR(nextAppointment.date) : 'Conforme agendado'}*\n⏰ Horário: *${nextAppointment ? nextAppointment.time : '09:00'}*\n💅 Procedimento: *${nextAppointment ? nextAppointment.serviceNames.join(', ') : 'Alongamento / Esmaltação'}*\n📍 Endereço: *${studioAddress}*\n📸 Instagram: *${studioInstagram}*\n\nPodemos confirmar sua presença? Se tiver qualquer imprevisto, por favor nos avise com antecedência. Te espero com muito carinho! ✨`,
    },
    {
      title: 'Confirmação Imediata de Horário',
      description: 'Envie logo após marcar um novo agendamento.',
      text: `Oie ${client ? client.name.split(' ')[0] : ''}! ✨\n\nSeu agendamento foi confirmado com sucesso no *${studioName}*:\n\n📅 Data: *${nextAppointment ? formatDateBR(nextAppointment.date) : 'A definir'}*\n⏰ Horário: *${nextAppointment ? nextAppointment.time : 'A definir'}*\n💅 Procedimento: *${nextAppointment ? nextAppointment.serviceNames.join(', ') : 'Alongamento'}*\n📍 Endereço: *${studioAddress}*\n\nQualquer dúvida estou à disposição pelo WhatsApp. Até logo! 💖`,
    },
    {
      title: 'Tabela de Preços & Procedimentos',
      description: 'Envie para clientes novas que pedirem orçamento no WhatsApp.',
      text: `Olá! Segue nossa tabela oficial de procedimentos do *${studioName}*:\n\n💅 *Alongamento em Fibra de Vidro:* R$ 70,00\n💅 *Alongamento no Molde F1:* R$ 65,00\n✨ *Banho em Gel / Blindagem:* R$ 55,00\n🌸 *Esmaltação em Gel:* R$ 45,00\n\n📍 *Endereço:* ${studioAddress}\n📸 *Instagram:* ${studioInstagram}\n\nVamos agendar o seu horário? Me avise o melhor dia para você! 💖`,
    },
    {
      title: 'Guia de Cuidados Pós-Alongamento / Gel',
      description: 'Dicas de ouro para a cliente manter o alongamento lindo e sem infiltrações.',
      text: `Olá ${client ? client.name.split(' ')[0] : ''}! 💅✨\n\nPara que suas unhas continuem impecáveis por semanas, siga estes cuidados essenciais:\n\n1️⃣ Unha não é ferramenta: evite abrir latinhas ou caixas com a ponta das unhas.\n2️⃣ Use luvas de borracha ao manusear produtos de limpeza e químicos fortes.\n3️⃣ Hidrate as cutículas diariamente com óleo vegetal ou caneta hidratante.\n4️⃣ Nunca tente arrancar o gel com os dentes! Em caso de quebra, faça manutenção segura.\n\nQualquer dúvida estou por aqui! Tenha uma semana maravilhosa! 🥰`,
    },
    {
      title: 'Mensagem de Saudades / Hora da Manutenção',
      description: 'Reative clientes que não frequentam o espaço há mais de 20 dias.',
      text: `Oi ${client ? client.name.split(' ')[0] : ''}, que saudade de você! 💕\n\nVi aqui que já faz alguns dias desde o seu último procedimento no *${studioName}*. Como estão suas unhas?\n\nQue tal tirarmos um momentinho só seu esta semana para renovar a estrutura e esmaltação? Temos horários disponíveis!\n\nMe avise que já reservo o melhor horário para você! ☕💅`,
    },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-rose-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Mensagens Prontas para WhatsApp
              </h2>
              <p className="text-xs text-stone-500">
                Lembretes, confirmações e pós-atendimento personalizados
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Select Client */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Personalizar mensagem para a cliente:
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 font-medium focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - {c.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Templates list */}
          <div className="space-y-4">
            {templates.map((tpl, idx) => (
              <div
                key={idx}
                className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs hover:border-rose-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                      {tpl.title}
                    </h3>
                    <p className="text-xs text-stone-500">{tpl.description}</p>
                  </div>
                </div>

                <div className="bg-stone-50 rounded-lg p-3 text-xs text-stone-700 font-mono whitespace-pre-wrap border border-stone-200/80 mb-3 leading-relaxed">
                  {tpl.text}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleCopy(tpl.text, idx)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-stone-500" />
                        <span>Copiar Texto</span>
                      </>
                    )}
                  </button>

                  {client && (
                    <a
                      href={getWhatsAppUrl(client.phone, tpl.text)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Abrir no WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
