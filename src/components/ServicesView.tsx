import React, { useState } from 'react';
import { Sparkles, Plus, Clock, DollarSign, Edit2, Trash2, Check, X } from 'lucide-react';
import { ServiceItem, ServiceCategory } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ServicesViewProps {
  services: ServiceItem[];
  onSaveService: (service: ServiceItem) => void;
  onDeleteService: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  services,
  onSaveService,
  onDeleteService,
  onToggleActive,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<ServiceItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('manicure');
  const [price, setPrice] = useState<number>(50);
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [description, setDescription] = useState('');
  const [popular, setPopular] = useState(false);

  const categories = [
    { id: 'todos', label: 'Todos os Serviços' },
    { id: 'manicure', label: 'Manicure & Gel' },
    { id: 'alongamento', label: 'Alongamento & Fibra' },
    { id: 'pedicure', label: 'Pedicure' },
    { id: 'combo', label: 'Combos Pé & Mão' },
    { id: 'spa', label: 'Spa dos Pés' },
    { id: 'nailart', label: 'Nail Art & Extras' },
  ];

  const filteredServices = services.filter((svc) => {
    if (selectedCategory === 'todos') return true;
    return svc.category === selectedCategory;
  });

  const openNewModal = () => {
    setServiceToEdit(null);
    setName('');
    setCategory('manicure');
    setPrice(50);
    setDurationMinutes(45);
    setDescription('');
    setPopular(false);
    setIsModalOpen(true);
  };

  const openEditModal = (svc: ServiceItem) => {
    setServiceToEdit(svc);
    setName(svc.name);
    setCategory(svc.category);
    setPrice(svc.price);
    setDurationMinutes(svc.durationMinutes);
    setDescription(svc.description);
    setPopular(!!svc.popular);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSvc: ServiceItem = {
      id: serviceToEdit ? serviceToEdit.id : 'srv-' + Date.now(),
      name: name.trim(),
      category,
      price: Number(price),
      durationMinutes: Number(durationMinutes),
      description: description.trim(),
      active: serviceToEdit ? serviceToEdit.active : true,
      popular,
    };

    onSaveService(newSvc);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-100">
                Menu de Procedimentos
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-['Playfair_Display',serif] text-stone-900 mt-1">
              Serviços & Tabela de Preços
            </h1>
            <p className="text-xs text-stone-500">
              Configure valores, tempos de execução e descrições dos serviços oferecidos no seu studio.
            </p>
          </div>

          <button
            onClick={openNewModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Procedimento</span>
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 mt-4 border-t border-stone-100 pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-rose-600 text-white shadow-2xs font-bold'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((svc) => (
          <div
            key={svc.id}
            className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              svc.active
                ? 'border-stone-200/80 shadow-2xs hover:shadow-xs'
                : 'border-stone-200 opacity-60 bg-stone-50/50'
            }`}
          >
            <div>
              {/* Category & Popular Tag */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md tracking-wider">
                  {svc.category}
                </span>

                <div className="flex items-center gap-1">
                  {svc.popular && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-rose-500" />
                      Mais Pedido
                    </span>
                  )}

                  <button
                    onClick={() => onToggleActive(svc.id)}
                    title={svc.active ? 'Desativar serviço' : 'Ativar serviço'}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                      svc.active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-stone-200 text-stone-600 border-stone-300'
                    }`}
                  >
                    {svc.active ? 'Ativo' : 'Pausado'}
                  </button>
                </div>
              </div>

              {/* Title & Price */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-bold text-stone-900 leading-snug">{svc.name}</h3>
                <span className="text-base font-bold text-rose-700 whitespace-nowrap">
                  {formatCurrency(svc.price)}
                </span>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Tempo de cabine: {svc.durationMinutes} minutos</span>
              </div>

              {/* Description */}
              {svc.description && (
                <p className="text-xs text-stone-600 mt-2.5 leading-relaxed bg-stone-50/70 p-2.5 rounded-xl border border-stone-100">
                  {svc.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-1.5 mt-4 pt-3 border-t border-stone-100">
              <button
                onClick={() => openEditModal(svc)}
                className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold px-2.5"
              >
                <Edit2 className="w-3 h-3" />
                <span>Editar</span>
              </button>
              <button
                onClick={() => onDeleteService(svc.id)}
                className="p-1.5 rounded-lg border border-stone-200 hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New / Edit Service */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-rose-50/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-stone-900">
                  {serviceToEdit ? 'Editar Procedimento' : 'Novo Procedimento'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nome do Procedimento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Esmaltação em Gel com Francesinha"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-2 text-xs text-stone-800 capitalize focus:outline-hidden"
                  >
                    <option value="manicure">Manicure</option>
                    <option value="pedicure">Pedicure</option>
                    <option value="combo">Combo Pé & Mão</option>
                    <option value="alongamento">Alongamento</option>
                    <option value="nailart">Nail Art</option>
                    <option value="spa">Spa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 font-bold focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Duração (minutos) *
                  </label>
                  <input
                    type="number"
                    step="5"
                    min="5"
                    required
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Descrição dos Passos / Detalhes
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Cutilagem profunda, alinhamento da lâmina com primer e top coat de alto brilho."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={popular}
                    onChange={(e) => setPopular(e.target.checked)}
                    className="rounded-sm border-stone-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-stone-800">
                    Destacar como "Mais Pedido" no catálogo
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
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
                  Salvar Procedimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
