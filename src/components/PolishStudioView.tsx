import React, { useState } from 'react';
import { Palette, Sparkles, Check, Plus, Trash2, X, RefreshCw, Eye } from 'lucide-react';
import { PolishItem, NailShape } from '../types';

interface PolishStudioViewProps {
  polishes: PolishItem[];
  onAddPolish: (polish: PolishItem) => void;
  onToggleStock: (id: string) => void;
  onDeletePolish: (id: string) => void;
}

export const PolishStudioView: React.FC<PolishStudioViewProps> = ({
  polishes,
  onAddPolish,
  onToggleStock,
  onDeletePolish,
}) => {
  // Simulator states
  const [selectedShape, setSelectedShape] = useState<NailShape>('amendoada');
  const [selectedColor, setSelectedColor] = useState<string>('#B91C1C'); // red
  const [selectedPolishName, setSelectedPolishName] = useState<string>('Vermelho Carmim (Impala)');
  const [finishEffect, setFinishEffect] = useState<'cremoso' | 'fosco' | 'francesinha' | 'glitter' | 'babyboomer'>('cremoso');
  const [accentFinger, setAccentFinger] = useState<boolean>(true); // filha única no anelar
  const [accentColor, setAccentColor] = useState<string>('#FDFCF7'); // branca ou glitter

  // Polish catalog states
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New polish form
  const [newName, setNewName] = useState('');
  const [newBrand, setNewBrand] = useState('Risqué');
  const [newColorHex, setNewColorHex] = useState('#E2B8A8');
  const [newFinish, setNewFinish] = useState<'cremoso' | 'cintilante' | 'glitter' | 'fosco' | 'gel'>('cremoso');
  const [newCategory, setNewCategory] = useState<'nude' | 'vermelho' | 'rosa' | 'escuro' | 'colorido' | 'francesinha'>('nude');

  const shapesList: { id: NailShape; name: string; description: string }[] = [
    { id: 'amendoada', name: 'Amendoada', description: 'Alongada e curvada na ponta' },
    { id: 'quadrada', name: 'Quadrada', description: 'Linhas retas com cantos vivos' },
    { id: 'bailarina', name: 'Bailarina (Coffin)', description: 'Estreita com ponta quadrada reta' },
    { id: 'stiletto', name: 'Stiletto', description: 'Ponta triangular afiada' },
    { id: 'oval', name: 'Oval', description: 'Bordas suaves e ponta arredondada' },
    { id: 'redonda', name: 'Redonda', description: 'Curvatura natural da ponta dos dedos' },
  ];

  const filteredPolishes = polishes.filter((p) => {
    if (categoryFilter === 'todos') return true;
    return p.category === categoryFilter;
  });

  const handleSelectPolish = (polish: PolishItem) => {
    setSelectedColor(polish.colorHex);
    setSelectedPolishName(`${polish.name} (${polish.brand})`);
    if (polish.finish === 'fosco') setFinishEffect('fosco');
    else if (polish.finish === 'glitter') setFinishEffect('glitter');
  };

  const handleAddPolishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newPol: PolishItem = {
      id: 'pol-' + Date.now(),
      name: newName.trim(),
      brand: newBrand.trim(),
      colorHex: newColorHex,
      finish: newFinish,
      inStock: true,
      category: newCategory,
    };

    onAddPolish(newPol);
    setIsAddModalOpen(false);
    setNewName('');
  };

  // Shape rendering helpers
  const getNailBorderRadius = (shape: NailShape) => {
    switch (shape) {
      case 'quadrada':
        return '4px 4px 18px 18px';
      case 'amendoada':
        return '50% 50% 20px 20px';
      case 'bailarina':
        return '10px 10px 18px 18px';
      case 'stiletto':
        return '60% 60% 20px 20px';
      case 'oval':
        return '45% 45% 20px 20px';
      case 'redonda':
        return '35% 35% 20px 20px';
    }
  };

  const getNailClipPath = (shape: NailShape) => {
    if (shape === 'bailarina') {
      return 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)';
    }
    if (shape === 'stiletto') {
      return 'polygon(50% 0%, 100% 90%, 85% 100%, 15% 100%, 0% 90%)';
    }
    return 'none';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-100">
            Estúdio Criativo
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-['Playfair_Display',serif] text-stone-900 mt-1">
          Simulador de Unhas & Esmalteca
        </h1>
        <p className="text-xs text-stone-500">
          Mostruário digital para auxiliar suas clientes na escolha do formato, cores e efeitos antes de iniciar o atendimento.
        </p>
      </div>

      {/* Interactive Simulator Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Canvas Preview */}
        <div className="lg:col-span-6 bg-gradient-to-b from-stone-50 to-rose-50/40 rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Pré-Visualização em Tempo Real
              </span>
              <p className="text-sm font-bold text-stone-900 capitalize">
                Formato {selectedShape} • Efeito {finishEffect}
              </p>
              <p className="text-xs text-rose-700 font-semibold">{selectedPolishName}</p>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer bg-white px-2.5 py-1.5 rounded-lg border border-stone-200 shadow-2xs">
                <input
                  type="checkbox"
                  checked={accentFinger}
                  onChange={(e) => setAccentFinger(e.target.checked)}
                  className="rounded-sm border-stone-300 text-rose-600 focus:ring-rose-500 w-3.5 h-3.5"
                />
                <span>Filha Única</span>
              </label>
            </div>
          </div>

          {/* Hand & Fingers Vector Simulator */}
          <div className="relative w-full max-w-sm h-72 flex items-end justify-center gap-3 sm:gap-4 pb-4">
            {/* 5 Fingers: Polegar, Indicador, Médio, Anelar, Mínimo */}
            {[
              { name: 'Polegar', height: 'h-36', width: 'w-10 sm:w-11', nailH: 'h-13', nailW: 'w-8', isRing: false },
              { name: 'Indicador', height: 'h-48', width: 'w-9 sm:w-10', nailH: 'h-13', nailW: 'w-7.5', isRing: false },
              { name: 'Médio', height: 'h-54', width: 'w-9 sm:w-10', nailH: 'h-14', nailW: 'w-7.5', isRing: false },
              { name: 'Anelar', height: 'h-48', width: 'w-9 sm:w-10', nailH: 'h-13', nailW: 'w-7.5', isRing: true },
              { name: 'Mínimo', height: 'h-38', width: 'w-8 sm:w-8.5', nailH: 'h-11', nailW: 'w-6.5', isRing: false },
            ].map((finger, idx) => {
              const isAccent = accentFinger && finger.isRing;
              const nailColor = isAccent ? accentColor : selectedColor;

              return (
                <div
                  key={idx}
                  className={`relative flex flex-col items-center justify-start ${finger.height} ${finger.width} bg-[#f1d0be] rounded-t-3xl border-t border-l border-r border-[#e3b7a1] shadow-md`}
                >
                  {/* Finger Joint Line */}
                  <div className="absolute top-20 w-3/4 h-0.5 bg-[#e3b7a1]/60 rounded-full" />
                  <div className="absolute top-28 w-2/3 h-0.5 bg-[#e3b7a1]/40 rounded-full" />

                  {/* Nail Plate */}
                  <div
                    style={{
                      borderRadius: getNailBorderRadius(selectedShape),
                      clipPath: getNailClipPath(selectedShape),
                      backgroundColor: nailColor,
                    }}
                    className={`relative ${finger.nailH} ${finger.nailW} -mt-3 shadow-inner overflow-hidden transition-all duration-300 border border-black/10`}
                  >
                    {/* Gloss / Shine Highlight */}
                    {finishEffect !== 'fosco' && (
                      <div className="absolute top-1 left-1.5 w-1.5 h-3/4 bg-white/40 rounded-full blur-[0.5px] pointer-events-none" />
                    )}

                    {/* Francesinha Effect */}
                    {finishEffect === 'francesinha' && (
                      <div
                        className={`absolute top-0 inset-x-0 h-3 ${
                          isAccent ? 'bg-amber-300' : 'bg-white'
                        } shadow-xs border-b border-white/20`}
                      />
                    )}

                    {/* Babyboomer / Degradê */}
                    {finishEffect === 'babyboomer' && (
                      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-transparent to-transparent pointer-events-none" />
                    )}

                    {/* Glitter Spangles */}
                    {(finishEffect === 'glitter' || isAccent) && (
                      <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px] opacity-70 pointer-events-none" />
                    )}

                    {/* Matte finish overlay */}
                    {finishEffect === 'fosco' && (
                      <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px] pointer-events-none" />
                    )}
                  </div>

                  <span className="text-[9px] text-[#b07f67] font-medium absolute -bottom-5">
                    {finger.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Color Palettes Swatches in Simulator */}
          <div className="w-full mt-6 pt-4 border-t border-stone-200">
            <span className="text-[11px] font-semibold text-stone-600 block mb-2">
              Toque em uma cor da paleta rápida:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { hex: '#B91C1C', name: 'Vermelho Carmim' },
                { hex: '#7F1D1D', name: 'Taça de Vinho' },
                { hex: '#E2B8A8', name: 'Nude Clássico' },
                { hex: '#FDFCF7', name: 'Renda / Branquinho' },
                { hex: '#1C1917', name: 'Preto Chic' },
                { hex: '#DB7093', name: 'Rosa Vintage' },
                { hex: '#A7F3D0', name: 'Menta Pastel' },
                { hex: '#DDD6FE', name: 'Lavanda' },
                { hex: '#F59E0B', name: 'Ouro Encapsulado' },
              ].map((swatch, i) => (
                <button
                  key={i}
                  title={swatch.name}
                  onClick={() => {
                    setSelectedColor(swatch.hex);
                    setSelectedPolishName(swatch.name);
                  }}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 shrink-0 cursor-pointer flex items-center justify-center ${
                    selectedColor === swatch.hex
                      ? 'border-stone-900 ring-2 ring-rose-400 scale-105'
                      : 'border-white shadow-xs'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                >
                  {selectedColor === swatch.hex && (
                    <Check className={`w-3.5 h-3.5 ${swatch.hex === '#FDFCF7' ? 'text-stone-800' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Controls & Shapes */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-5">
          {/* Format / Shape Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
              1. Escolha o Formato da Unha
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {shapesList.map((shape) => {
                const isSelected = selectedShape === shape.id;
                return (
                  <button
                    key={shape.id}
                    onClick={() => setSelectedShape(shape.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 border-rose-400 text-stone-900 shadow-xs'
                        : 'bg-stone-50/50 border-stone-200 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <p className="text-xs font-bold leading-tight">{shape.name}</p>
                    <p className="text-[10px] text-stone-500 mt-1 line-clamp-1">{shape.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Finish / Effect Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
              2. Acabamento & Efeito
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'cremoso', label: 'Brilho Verniz / Gel', desc: 'Gloss intenso' },
                { id: 'fosco', label: 'Efeito Fosco (Matte)', desc: 'Toque aveludado' },
                { id: 'francesinha', label: 'Francesinha Sorriso', desc: 'Ponta clássica' },
                { id: 'babyboomer', label: 'Babyboomer / Degradê', desc: 'Transição suave' },
                { id: 'glitter', label: 'Glitter Total', desc: 'Brilho luxuoso' },
              ].map((fx) => (
                <button
                  key={fx.id}
                  onClick={() => setFinishEffect(fx.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    finishEffect === fx.id
                      ? 'bg-stone-900 border-stone-900 text-white shadow-2xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <p className="text-xs font-bold">{fx.label}</p>
                  <p className={`text-[10px] mt-0.5 ${finishEffect === fx.id ? 'text-stone-300' : 'text-stone-400'}`}>
                    {fx.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Filha Única Color Option */}
          {accentFinger && (
            <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-200/70">
              <span className="text-xs font-semibold text-rose-900 block mb-1.5">
                Cor da Filha Única (Dedo Anelar):
              </span>
              <div className="flex items-center gap-2">
                {[
                  { hex: '#FDFCF7', label: 'Branco / Glazed' },
                  { hex: '#F59E0B', label: 'Glitter Ouro' },
                  { hex: '#CBD5E1', label: 'Prata Espelhado' },
                  { hex: '#1C1917', label: 'Preto Intenso' },
                  { hex: '#DB7093', label: 'Rosa Glitz' },
                ].map((col, i) => (
                  <button
                    key={i}
                    onClick={() => setAccentColor(col.hex)}
                    className={`w-6 h-6 rounded-full border border-stone-300 cursor-pointer ${
                      accentColor === col.hex ? 'ring-2 ring-rose-500 scale-110' : ''
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.label}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Studio Polish Inventory Section */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              Esmalteca & Estoque do Studio ({polishes.length} vidrinhos)
            </h2>
            <p className="text-xs text-stone-500">
              Controle quais cores e géis estão disponíveis na bancada ou precisam de reposição.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Cadastrar Esmalte</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 mt-4 border-t border-stone-100 pb-1">
          {[
            { id: 'todos', label: 'Todas as Cores' },
            { id: 'nude', label: 'Nudes & Neutros' },
            { id: 'vermelho', label: 'Vermelhos & Vinhos' },
            { id: 'rosa', label: 'Rosas & Lilases' },
            { id: 'escuro', label: 'Pretos & Escuros' },
            { id: 'francesinha', label: 'Branquinhos / Francesinha' },
            { id: 'colorido', label: 'Coloridos & Glitters' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-stone-900 text-white shadow-2xs font-semibold'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Polishes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
          {filteredPolishes.map((polish) => (
            <div
              key={polish.id}
              className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                polish.inStock
                  ? 'bg-stone-50/70 border-stone-200 hover:border-rose-300'
                  : 'bg-stone-100/60 border-stone-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span
                    className="w-5 h-5 rounded-full border border-black/10 shadow-xs shrink-0"
                    style={{ backgroundColor: polish.colorHex }}
                  />
                  <button
                    onClick={() => onToggleStock(polish.id)}
                    title={polish.inStock ? 'Marcar como esgotado' : 'Marcar em estoque'}
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border cursor-pointer ${
                      polish.inStock
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-stone-200 text-stone-600 border-stone-300'
                    }`}
                  >
                    {polish.inStock ? 'Em estoque' : 'Esgotado'}
                  </button>
                </div>

                <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{polish.name}</h4>
                <p className="text-[11px] text-stone-500">{polish.brand}</p>
                <span className="text-[10px] text-stone-400 capitalize mt-0.5 block">
                  {polish.finish}
                </span>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between">
                <button
                  onClick={() => handleSelectPolish(polish)}
                  className="text-[10px] font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>Testar</span>
                </button>

                <button
                  onClick={() => onDeletePolish(polish.id)}
                  className="text-stone-300 hover:text-rose-600 p-1 rounded-sm cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add Polish */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">Novo Esmalte na Bancada</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-md text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPolishSubmit} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nome da Cor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Grão de Café"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Marca *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Risqué, Impala, Vòlia"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tom / Amostra
                  </label>
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-full h-8 bg-transparent cursor-pointer rounded-lg border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Acabamento
                  </label>
                  <select
                    value={newFinish}
                    onChange={(e) => setNewFinish(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-2 py-2 text-xs text-stone-900"
                  >
                    <option value="cremoso">Cremoso</option>
                    <option value="cintilante">Cintilante</option>
                    <option value="glitter">Glitter</option>
                    <option value="fosco">Fosco</option>
                    <option value="gel">Gel Construtor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Categoria</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-2 py-2 text-xs text-stone-900"
                >
                  <option value="nude">Nude / Neutro</option>
                  <option value="vermelho">Vermelho</option>
                  <option value="rosa">Rosa</option>
                  <option value="escuro">Escuro</option>
                  <option value="francesinha">Francesinha</option>
                  <option value="colorido">Colorido / Fantasia</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
                >
                  Salvar Esmalte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
