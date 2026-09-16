import React from 'react';
import {
  Calendar,
  Users,
  Sparkles,
  DollarSign,
  Palette,
  Plus,
  Phone,
  Instagram,
  MapPin,
  Globe,
  Database,
  Share2,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export type TabType = 'agenda' | 'clientes' | 'servicos' | 'financeiro' | 'estudio';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onNewAppointment: () => void;
  todayAppointmentsCount: number;
  onSwitchToPublic: () => void;
  onShareClientLink: () => void;
  onLogout: () => void;
  isSupabaseConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onNewAppointment,
  todayAppointmentsCount,
  onSwitchToPublic,
  onShareClientLink,
  onLogout,
  isSupabaseConnected = false,
}) => {
  const tabs = [
    {
      id: 'agenda' as TabType,
      label: 'Agenda',
      icon: Calendar,
      badge: todayAppointmentsCount > 0 ? todayAppointmentsCount : undefined,
    },
    { id: 'clientes' as TabType, label: 'Clientes & Ficha', icon: Users },
    { id: 'servicos' as TabType, label: 'Serviços & Preços', icon: Sparkles },
    { id: 'financeiro' as TabType, label: 'Financeiro', icon: DollarSign },
    { id: 'estudio' as TabType, label: 'Esmalteca & Simulador', icon: Palette },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      {/* Top micro contact banner */}
      <div className="bg-[#FAF1EE] border-b border-[#edd5cd]/60 py-1 px-4 sm:px-6 lg:px-8 text-[11px] text-[#8e5a4c] hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#C57E6B]" />
              <span>Rua Edmar Matosinho, 10</span>
            </span>
            <span className="text-stone-300">•</span>
            <a
              href="https://wa.me/5511952517402"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-stone-900 transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>(11) 95251-7402</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            {/* Supabase Status indicator */}
            <div className="flex items-center gap-1 text-[10px] font-semibold text-stone-500">
              <Database className={`w-3 h-3 ${isSupabaseConnected ? 'text-emerald-600' : 'text-stone-400'}`} />
              <span>
                {isSupabaseConnected ? 'Supabase Conectado' : 'Modo Offline / LocalStorage'}
              </span>
            </div>

            <a
              href="https://instagram.com/Nail_kethelinxz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-rose-700 font-semibold transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-rose-500" />
              <span>@Nail_kethelinxz</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo / Studio Name */}
          <div className="flex items-center gap-3">
            <BrandLogo size="md" showText={true} />
            <span className="hidden lg:inline-block text-[10px] uppercase tracking-wider font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200/60 ml-1">
              Painel Manicure
            </span>
          </div>

          {/* Navigation Tabs - Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/70">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => onSelectTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-white text-rose-700 shadow-xs shadow-stone-200 font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600' : 'text-stone-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onShareClientLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[#A66E5E] bg-rose-50/80 border border-rose-200/80 hover:bg-rose-100/80 hover:border-rose-300 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              title="Copiar e compartilhar o link do Portal da Cliente"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C57E6B]" />
              <span className="hidden sm:inline">Link da Cliente</span>
            </button>

            <button
              onClick={onSwitchToPublic}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-stone-700 bg-white border border-stone-200 hover:border-[#C57E6B] hover:text-[#C57E6B] text-xs font-semibold transition-colors cursor-pointer"
              title="Visualizar a Landing Page pública"
            >
              <Globe className="w-3.5 h-3.5 text-[#C57E6B]" />
              <span className="hidden lg:inline">Ver Site</span>
            </button>

            <button
              id="btn-novo-agendamento-nav"
              onClick={onNewAppointment}
              className="inline-flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#C57E6B] to-[#b36a57] hover:from-[#b36a57] hover:to-[#9c5947] text-white text-xs sm:text-sm font-semibold shadow-sm shadow-[#c57e6b]/30 hover:shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Novo</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-stone-500 hover:text-rose-700 hover:bg-rose-50 border border-stone-200 transition-colors cursor-pointer"
              title="Sair / Bloquear Painel da Manicure"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden overflow-x-auto py-2.5 gap-1.5 scrollbar-none border-t border-stone-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-rose-50 text-rose-700 font-semibold border border-rose-200/80'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-600' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
