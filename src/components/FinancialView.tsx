import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Plus,
  Trash2,
  Calendar,
  Filter,
  X,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { Transaction, PaymentMethod } from '../types';
import { formatCurrency, formatDateBR } from '../utils/formatters';

interface FinancialViewProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const FinancialView: React.FC<FinancialViewProps> = ({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
}) => {
  const [periodFilter, setPeriodFilter] = useState<'mes' | 'hoje' | 'semana' | 'todos'>('mes');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [type, setType] = useState<'entrada' | 'saida'>('saida');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(50);
  const [category, setCategory] = useState<
    'servico' | 'produto' | 'materiais' | 'aluguel_fixo' | 'cursos' | 'outros'
  >('materiais');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7);

  // Filter transactions
  const filteredTransactions = transactions
    .filter((tx) => {
      if (periodFilter === 'hoje') return tx.date === todayStr;
      if (periodFilter === 'mes') return tx.date.startsWith(currentMonthStr);
      if (periodFilter === 'semana') {
        const txTime = new Date(tx.date).getTime();
        const weekAgo = Date.now() - 7 * 86400000;
        return txTime >= weekAgo;
      }
      return true;
    })
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  // Calculations
  const totalEntradas = filteredTransactions
    .filter((t) => t.type === 'entrada')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalSaidas = filteredTransactions
    .filter((t) => t.type === 'saida')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const lucroLiquido = totalEntradas - totalSaidas;

  // Payment methods breakdown
  const paymentBreakdown: Record<string, number> = {
    pix: 0,
    cartao_credito: 0,
    cartao_debito: 0,
    dinheiro: 0,
  };

  filteredTransactions
    .filter((t) => t.type === 'entrada')
    .forEach((t) => {
      if (paymentBreakdown[t.paymentMethod] !== undefined) {
        paymentBreakdown[t.paymentMethod] += t.amount;
      }
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newTx: Transaction = {
      id: 'tx-' + Date.now(),
      date: todayStr,
      time: new Date().toTimeString().substring(0, 5),
      type,
      description: description.trim(),
      amount: Number(amount),
      category,
      paymentMethod,
    };

    onAddTransaction(newTx);
    setIsModalOpen(false);
    setDescription('');
    setAmount(50);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-100">
                Caixa & Fluxo Financeiro
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-['Playfair_Display',serif] text-stone-900 mt-1">
              Controle Financeiro do Studio
            </h1>
            <p className="text-xs text-stone-500">
              Receitas de atendimentos, despesas com esmaltes e insumos descartáveis, e lucro líquido.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Period select */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
              <button
                onClick={() => setPeriodFilter('hoje')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  periodFilter === 'hoje'
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Hoje
              </button>
              <button
                onClick={() => setPeriodFilter('semana')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  periodFilter === 'semana'
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                7 Dias
              </button>
              <button
                onClick={() => setPeriodFilter('mes')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  periodFilter === 'mes'
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Este Mês
              </button>
              <button
                onClick={() => setPeriodFilter('todos')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  periodFilter === 'todos'
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Todos
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Lançamento</span>
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6">
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800">Entradas (Faturamento)</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-950 mt-2">
              {formatCurrency(totalEntradas)}
            </p>
            <p className="text-[11px] text-emerald-700 mt-1">
              Atendimentos de unhas concluídos
            </p>
          </div>

          <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-800">Saídas (Insumos e Custos)</span>
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-rose-950 mt-2">
              {formatCurrency(totalSaidas)}
            </p>
            <p className="text-[11px] text-rose-700 mt-1">
              Géis, esmaltes, descartáveis e studio
            </p>
          </div>

          <div className="bg-stone-900 text-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-300">Lucro Líquido Real</span>
              <div className="w-7 h-7 rounded-lg bg-stone-800 text-rose-300 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {formatCurrency(lucroLiquido)}
            </p>
            <p className="text-[11px] text-stone-400 mt-1">
              Margem no período filtrado
            </p>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="mt-5 pt-4 border-t border-stone-100">
          <h4 className="text-xs font-bold text-stone-700 mb-3 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-stone-400" />
            Recebimento por Meio de Pagamento
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Pix', key: 'pix', value: paymentBreakdown.pix, bg: 'bg-emerald-500' },
              {
                label: 'Cartão de Crédito',
                key: 'cartao_credito',
                value: paymentBreakdown.cartao_credito,
                bg: 'bg-blue-500',
              },
              {
                label: 'Cartão de Débito',
                key: 'cartao_debito',
                value: paymentBreakdown.cartao_debito,
                bg: 'bg-amber-500',
              },
              {
                label: 'Dinheiro',
                key: 'dinheiro',
                value: paymentBreakdown.dinheiro,
                bg: 'bg-stone-600',
              },
            ].map((method) => {
              const pct = totalEntradas > 0 ? (method.value / totalEntradas) * 100 : 0;
              return (
                <div key={method.key} className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-stone-700">{method.label}</span>
                    <span className="font-bold text-stone-900">{formatCurrency(method.value)}</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full ${method.bg} transition-all duration-300`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    {pct.toFixed(0)}% do total
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transactions History */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs">
        <h3 className="text-base font-bold text-stone-900 mb-4 flex items-center justify-between">
          <span>Histórico de Lançamentos ({filteredTransactions.length})</span>
          <span className="text-xs text-stone-400 font-normal">
            Ordenado pelos mais recentes
          </span>
        </h3>

        {filteredTransactions.length === 0 ? (
          <p className="text-xs text-stone-400 text-center py-8">
            Nenhuma transação registrada neste período.
          </p>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-stone-50/80 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === 'entrada'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {tx.type === 'entrada' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <ShoppingBag className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-stone-900">
                      {tx.description}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                      <span>{formatDateBR(tx.date)} às {tx.time}</span>
                      <span>•</span>
                      <span className="capitalize font-medium text-stone-600">
                        {tx.category.replace('_', ' ')}
                      </span>
                      <span>•</span>
                      <span className="uppercase text-[10px] bg-stone-100 px-1.5 py-0.2 rounded-sm text-stone-600">
                        {tx.paymentMethod.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm sm:text-base font-bold whitespace-nowrap ${
                      tx.type === 'entrada' ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {tx.type === 'entrada' ? '+' : '-'} {formatCurrency(tx.amount)}
                  </span>

                  <button
                    onClick={() => onDeleteTransaction(tx.id)}
                    title="Excluir lançamento"
                    className="p-1.5 rounded-lg text-stone-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: New Transaction */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
              <h2 className="text-base font-bold text-stone-900">Novo Lançamento no Caixa</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setType('entrada')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    type === 'entrada'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  + Entrada (Receita)
                </button>
                <button
                  type="button"
                  onClick={() => setType('saida')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    type === 'saida'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  - Saída (Despesa / Insumo)
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Descrição do Lançamento *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    type === 'saida'
                      ? 'Ex: Compra de 5 esmaltes e algodão'
                      : 'Ex: Venda de óleo de cutícula'
                  }
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Valor (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-2 text-xs text-stone-800 focus:outline-hidden"
                  >
                    <option value="pix">Pix</option>
                    <option value="cartao_credito">Cartão Crédito</option>
                    <option value="cartao_debito">Cartão Débito</option>
                    <option value="dinheiro">Dinheiro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-2 text-xs text-stone-800 capitalize focus:outline-hidden"
                >
                  <option value="materiais">Materiais & Insumos de Unha</option>
                  <option value="servico">Serviço / Atendimento</option>
                  <option value="produto">Venda de Produtos (Home care)</option>
                  <option value="aluguel_fixo">Aluguel / Custos Fixos</option>
                  <option value="cursos">Cursos & Aperfeiçoamento</option>
                  <option value="outros">Outros</option>
                </select>
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
                  className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Adicionar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
