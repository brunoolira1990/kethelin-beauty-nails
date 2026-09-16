import React, { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { AppointmentsView } from './components/AppointmentsView';
import { ClientsView } from './components/ClientsView';
import { ServicesView } from './components/ServicesView';
import { FinancialView } from './components/FinancialView';
import { PolishStudioView } from './components/PolishStudioView';
import { AppointmentModal } from './components/AppointmentModal';
import { QuickMessagesModal } from './components/QuickMessagesModal';
import { LandingPageView } from './components/LandingPageView';
import { ClientPortalView } from './components/ClientPortalView';
import { ManicureLoginModal } from './components/ManicureLoginModal';
import { ShareClientLinkModal } from './components/ShareClientLinkModal';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_CLIENTS,
  INITIAL_SERVICES,
  INITIAL_TRANSACTIONS,
  INITIAL_POLISHES,
} from './data/initialData';
import { Appointment, Client, ServiceItem, Transaction, PolishItem, AppointmentStatus } from './types';
import { isSupabaseConfigured, checkSupabaseConnection, db } from './lib/supabase';
import { CheckCircle2, RotateCcw, Sparkles, Globe, User, ShieldCheck, Lock, Share2 } from 'lucide-react';

export type AppViewMode = 'landing' | 'client_portal' | 'manicure_panel';

export default function App() {
  // App View Modes
  const [viewMode, setViewMode] = useState<AppViewMode>('landing');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | undefined>(undefined);

  // Manicure Panel Sub-Navigation
  const [currentTab, setCurrentTab] = useState<TabType>('agenda');

  // Supabase connection status
  const [supabaseConnected, setSupabaseConnected] = useState(false);

  // Auth & Protection for Manicure Panel
  const [isManicureAuthenticated, setIsManicureAuthenticated] = useState<boolean>(() => {
    return (
      localStorage.getItem('kethelin_manicure_auth') === 'true' ||
      sessionStorage.getItem('kethelin_manicure_auth') === 'true'
    );
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isShareClientLinkModalOpen, setIsShareClientLinkModalOpen] = useState(false);

  // Persistence States
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('kethelin_appointments_v1');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('kethelin_clients_v1');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('kethelin_services_v1');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('kethelin_transactions_v1');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [polishes, setPolishes] = useState<PolishItem[]>(() => {
    const saved = localStorage.getItem('kethelin_polishes_v1');
    return saved ? JSON.parse(saved) : INITIAL_POLISHES;
  });

  // Modals state
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);
  const [defaultAppointmentDate, setDefaultAppointmentDate] = useState<string | undefined>(undefined);

  const [isQuickMessagesOpen, setIsQuickMessagesOpen] = useState(false);
  const [quickMessageClient, setQuickMessageClient] = useState<Client | null>(null);
  const [quickMessageAppointment, setQuickMessageAppointment] = useState<Appointment | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Check Supabase connection & initial cloud fetch on mount
  useEffect(() => {
    async function initSupabase() {
      if (isSupabaseConfigured) {
        const isConnected = await checkSupabaseConnection();
        setSupabaseConnected(isConnected);

        if (isConnected) {
          const [remoteApts, remoteClients, remoteServices, remoteTxs] = await Promise.all([
            db.fetchAppointments(),
            db.fetchClients(),
            db.fetchServices(),
            db.fetchTransactions(),
          ]);

          if (remoteApts && remoteApts.length > 0) setAppointments(remoteApts);
          if (remoteClients && remoteClients.length > 0) setClients(remoteClients);
          if (remoteServices && remoteServices.length > 0) setServices(remoteServices);
          if (remoteTxs && remoteTxs.length > 0) setTransactions(remoteTxs);
        }
      }
    }
    initSupabase();
  }, []);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('kethelin_appointments_v1', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('kethelin_clients_v1', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('kethelin_services_v1', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('kethelin_transactions_v1', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('kethelin_polishes_v1', JSON.stringify(polishes));
  }, [polishes]);

  // Read URL query parameter for client portal or manicure direct link
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const portal = urlParams.get('p') || urlParams.get('portal');
    if (portal === 'cliente' || portal === 'agendar' || portal === 'client') {
      setViewMode('client_portal');
    } else if (portal === 'manicure' || portal === 'admin') {
      const isAuth =
        localStorage.getItem('kethelin_manicure_auth') === 'true' ||
        sessionStorage.getItem('kethelin_manicure_auth') === 'true';
      if (isAuth) {
        setViewMode('manicure_panel');
      } else {
        setIsLoginModalOpen(true);
      }
    }
  }, []);

  const changeViewMode = (mode: AppViewMode) => {
    if (mode === 'manicure_panel' && !isManicureAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    setViewMode(mode);
    const url = new URL(window.location.href);
    if (mode === 'client_portal') {
      url.searchParams.set('p', 'cliente');
    } else if (mode === 'manicure_panel') {
      url.searchParams.set('p', 'manicure');
    } else {
      url.searchParams.delete('p');
      url.searchParams.delete('portal');
    }
    window.history.replaceState(null, '', url.toString());
  };

  const handleGoToManicurePanel = () => {
    if (isManicureAuthenticated) {
      changeViewMode('manicure_panel');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleSuccessLogin = () => {
    setIsManicureAuthenticated(true);
    setIsLoginModalOpen(false);
    setViewMode('manicure_panel');
    const url = new URL(window.location.href);
    url.searchParams.set('p', 'manicure');
    window.history.replaceState(null, '', url.toString());
    showToast('Acesso autorizado! Bem-vinda, Kethelin.');
  };

  const handleLogout = () => {
    localStorage.removeItem('kethelin_manicure_auth');
    sessionStorage.removeItem('kethelin_manicure_auth');
    setIsManicureAuthenticated(false);
    setViewMode('landing');
    const url = new URL(window.location.href);
    url.searchParams.delete('p');
    window.history.replaceState(null, '', url.toString());
    showToast('Você saiu do painel da manicure.');
  };

  // Today's count for navbar badge
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointmentsCount = appointments.filter(
    (a) => a.date === todayStr && a.status !== 'cancelado'
  ).length;

  // Handlers for Appointments
  const handleOpenNewAppointment = (date?: string) => {
    setAppointmentToEdit(null);
    setDefaultAppointmentDate(date || todayStr);
    setIsAppointmentModalOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setAppointmentToEdit(appointment);
    setIsAppointmentModalOpen(true);
  };

  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este agendamento?')) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      db.deleteAppointment(id);
      showToast('Agendamento removido.');
    }
  };

  const handleSaveAppointment = (savedApt: Appointment, newClientData?: Partial<Client>) => {
    if (newClientData && newClientData.name) {
      const fullNewClient: Client = {
        id: newClientData.id || 'cli-' + Date.now(),
        name: newClientData.name,
        phone: newClientData.phone || '',
        createdAt: todayStr,
        totalSpent: 0,
        appointmentsCount: 1,
        lastVisit: savedApt.date,
        preferredNailShape: (newClientData.preferredNailShape as any) || 'amendoada',
        cuticleType: 'normal',
      };
      setClients((prev) => {
        const exists = prev.some((c) => c.phone && c.phone === fullNewClient.phone);
        if (exists) return prev;
        return [fullNewClient, ...prev];
      });
      db.saveClient(fullNewClient);
    }

    setAppointments((prev) => {
      const exists = prev.some((a) => a.id === savedApt.id);
      if (exists) {
        return prev.map((a) => (a.id === savedApt.id ? savedApt : a));
      }
      return [savedApt, ...prev];
    });

    db.saveAppointment(savedApt);

    showToast(
      appointmentToEdit
        ? 'Agendamento atualizado com sucesso!'
        : 'Novo agendamento confirmado na agenda!'
    );
  };

  const handleClientSelfBooking = (newApt: Appointment, clientData: Partial<Client>) => {
    handleSaveAppointment(newApt, clientData);
    showToast('Agendamento recebido! Você pode enviar a confirmação pelo WhatsApp.');
  };

  const handleUpdateStatus = (id: string, newStatus: AppointmentStatus, markPaid?: boolean) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return;

    const updatedApt = {
      ...apt,
      status: newStatus,
      paid: markPaid ? true : apt.paid,
    };

    setAppointments((prev) => prev.map((a) => (a.id === id ? updatedApt : a)));
    db.saveAppointment(updatedApt);

    // If marked as finished & paid, auto-register transaction and update client stats
    if (newStatus === 'concluido' && markPaid) {
      const newTx: Transaction = {
        id: 'tx-' + Date.now(),
        date: todayStr,
        time: new Date().toTimeString().substring(0, 5),
        type: 'entrada',
        description: `Atendimento ${apt.clientName} - ${apt.serviceNames.join(', ')}`,
        amount: apt.totalPrice,
        category: 'servico',
        paymentMethod: apt.paymentMethod === 'pendente' ? 'pix' : apt.paymentMethod || 'pix',
        appointmentId: apt.id,
      };

      setTransactions((prev) => [newTx, ...prev]);
      db.saveTransaction(newTx);

      // Update client stats
      setClients((prev) =>
        prev.map((c) => {
          if (c.id === apt.clientId || c.name === apt.clientName) {
            const updatedClient = {
              ...c,
              totalSpent: (c.totalSpent || 0) + apt.totalPrice,
              appointmentsCount: (c.appointmentsCount || 0) + 1,
              lastVisit: todayStr,
            };
            db.saveClient(updatedClient);
            return updatedClient;
          }
          return c;
        })
      );

      showToast(`Atendimento concluído e R$ ${apt.totalPrice.toFixed(2)} lançado no Caixa!`);
    } else {
      showToast(`Status atualizado para: ${newStatus.replace('_', ' ')}`);
    }
  };

  // Quick WhatsApp Message modal opener
  const handleOpenQuickMessages = (client?: Client, appointment?: Appointment) => {
    setQuickMessageClient(client || null);
    setQuickMessageAppointment(appointment || null);
    setIsQuickMessagesOpen(true);
  };

  // Handlers for Clients
  const handleSaveClient = (client: Client) => {
    setClients((prev) => {
      const exists = prev.some((c) => c.id === client.id);
      if (exists) {
        return prev.map((c) => (c.id === client.id ? client : c));
      }
      return [client, ...prev];
    });
    db.saveClient(client);
    showToast('Ficha da cliente salva com sucesso!');
  };

  const handleDeleteClient = (id: string) => {
    if (window.confirm('Excluir o cadastro desta cliente?')) {
      setClients((prev) => prev.filter((c) => c.id !== id));
      showToast('Cliente removida.');
    }
  };

  const handleNewAppointmentWithClient = (client: Client) => {
    setAppointmentToEdit(null);
    setDefaultAppointmentDate(todayStr);
    setIsAppointmentModalOpen(true);
  };

  // Handlers for Services
  const handleSaveService = (service: ServiceItem) => {
    setServices((prev) => {
      const exists = prev.some((s) => s.id === service.id);
      if (exists) {
        return prev.map((s) => (s.id === service.id ? service : s));
      }
      return [service, ...prev];
    });
    db.saveService(service);
    showToast('Procedimento salvo na tabela de preços!');
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('Remover este serviço do catálogo?')) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      showToast('Serviço removido.');
    }
  };

  const handleToggleActiveService = (id: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, active: !s.active };
          db.saveService(updated);
          return updated;
        }
        return s;
      })
    );
  };

  // Handlers for Finances
  const handleAddTransaction = (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
    db.saveTransaction(tx);
    showToast(tx.type === 'entrada' ? 'Receita lançada no Caixa!' : 'Despesa registrada no Caixa!');
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Lançamento removido.');
  };

  // Handlers for Polishes
  const handleAddPolish = (polish: PolishItem) => {
    setPolishes((prev) => [polish, ...prev]);
    showToast('Esmalte cadastrado na esmalteca!');
  };

  const handleToggleStockPolish = (id: string) => {
    setPolishes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const handleDeletePolish = (id: string) => {
    setPolishes((prev) => prev.filter((p) => p.id !== id));
    showToast('Esmalte removido da esmalteca.');
  };

  // Reset to initial sample data helper
  const handleResetData = () => {
    if (
      window.confirm(
        'Deseja restaurar os dados de demonstração da Kethelin Beauty Nails (clientes, agenda, financeiro e esmalteca)?'
      )
    ) {
      setAppointments(INITIAL_APPOINTMENTS);
      setClients(INITIAL_CLIENTS);
      setServices(INITIAL_SERVICES);
      setTransactions(INITIAL_TRANSACTIONS);
      setPolishes(INITIAL_POLISHES);
      localStorage.clear();
      showToast('Dados restaurados com sucesso!');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* View Mode Switcher Header Floating Pill (Quick navigation between Landing, Client Portal, Share Link and Manicure Panel) */}
      <div className="fixed bottom-4 left-4 z-50 bg-stone-900/95 backdrop-blur-md text-white p-1.5 rounded-2xl shadow-2xl border border-stone-700/70 flex items-center gap-1 text-xs">
        <button
          onClick={() => changeViewMode('landing')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
            viewMode === 'landing' ? 'bg-[#C57E6B] font-bold text-white shadow-xs' : 'text-stone-300 hover:text-white'
          }`}
          title="Ver Landing Page Oficial"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Landing Page</span>
        </button>

        <button
          onClick={() => {
            setSelectedServiceForBooking(undefined);
            changeViewMode('client_portal');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
            viewMode === 'client_portal' ? 'bg-[#C57E6B] font-bold text-white shadow-xs' : 'text-stone-300 hover:text-white'
          }`}
          title="Ver Portal da Cliente (Agendamento Online e Fidelidade)"
        >
          <User className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Portal da Cliente</span>
        </button>

        {/* Dedicated Share Client Link Button */}
        <button
          onClick={() => setIsShareClientLinkModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-rose-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Compartilhar link exclusivo da cliente"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Compartilhar Link</span>
        </button>

        <button
          onClick={handleGoToManicurePanel}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
            viewMode === 'manicure_panel' ? 'bg-[#C57E6B] font-bold text-white shadow-xs' : 'text-stone-300 hover:text-white'
          }`}
          title={isManicureAuthenticated ? 'Painel de Gestão da Manicure (Ativo)' : 'Área da Manicure (Requer Login)'}
        >
          {isManicureAuthenticated ? (
            <ShieldCheck className="w-3.5 h-3.5 text-rose-300" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span className="hidden sm:inline">
            {isManicureAuthenticated ? 'Painel Manicure' : 'Manicure (Login)'}
          </span>
        </button>
      </div>

      {/* 1. LANDING PAGE VIEW */}
      {viewMode === 'landing' && (
        <LandingPageView
          services={services}
          onGoToBooking={(serviceId) => {
            setSelectedServiceForBooking(serviceId);
            changeViewMode('client_portal');
          }}
          onGoToClientPortal={() => changeViewMode('client_portal')}
          onGoToManicurePanel={handleGoToManicurePanel}
          onShareClientLink={() => setIsShareClientLinkModalOpen(true)}
          isManicureLoggedIn={isManicureAuthenticated}
        />
      )}

      {/* 2. CLIENT PORTAL VIEW (Self-booking, My Appointments, Loyalty Card, Care Tips) */}
      {viewMode === 'client_portal' && (
        <ClientPortalView
          services={services}
          appointments={appointments}
          clients={clients}
          initialSelectedServiceId={selectedServiceForBooking}
          onBookAppointment={handleClientSelfBooking}
          onBackToHome={() => changeViewMode('landing')}
          onGoToManicurePanel={handleGoToManicurePanel}
          onShareClientLink={() => setIsShareClientLinkModalOpen(true)}
        />
      )}

      {/* 3. MANICURE PANEL VIEW (Protected with Login) */}
      {viewMode === 'manicure_panel' && !isManicureAuthenticated && (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-200 text-center shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF1EE] text-[#C57E6B] flex items-center justify-center mx-auto mb-4 border border-rose-200/80 shadow-xs">
              <Lock className="w-8 h-8" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#A66E5E] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Acesso Protegido
            </span>
            <h2 className="text-2xl font-bold font-['Playfair_Display',serif] text-stone-900 mt-2 mb-2">
              Painel da Manicure
            </h2>
            <p className="text-xs text-stone-600 mb-6 leading-relaxed">
              Esta área contém os dados da agenda, controle de clientes e o fluxo de caixa do estúdio <strong>Kethelin Beauty Nails</strong>. Faça o login de profissional para prosseguir.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C57E6B] to-[#b36a57] hover:from-[#b36a57] hover:to-[#9c5947] text-white font-bold text-sm shadow-md shadow-[#C57E6B]/30 hover:shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Fazer Login da Manicure</span>
              </button>
              <button
                onClick={() => changeViewMode('landing')}
                className="w-full py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Voltar para a Página Inicial
              </button>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'manicure_panel' && isManicureAuthenticated && (
        <>
          {/* Top Navigation */}
          <Navbar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            onNewAppointment={() => handleOpenNewAppointment()}
            todayAppointmentsCount={todayAppointmentsCount}
            onSwitchToPublic={() => changeViewMode('landing')}
            onShareClientLink={() => setIsShareClientLinkModalOpen(true)}
            onLogout={handleLogout}
            isSupabaseConnected={supabaseConnected}
          />

          {/* Quick Notice Banner inside Manicure Panel */}
          <div className="bg-white border-b border-rose-100 py-2 px-4 sm:px-6 lg:px-8 text-xs text-stone-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>
                <strong>Sessão Ativa (Kethelin Pro):</strong> Gerenciamento protegido de agenda, clientes e caixa.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsShareClientLinkModalOpen(true)}
                className="text-[#C57E6B] hover:text-[#9c5947] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartilhar Link da Cliente</span>
              </button>
              <span className="text-stone-300">|</span>
              <button
                onClick={() => changeViewMode('client_portal')}
                className="text-stone-600 hover:text-stone-900 font-semibold underline cursor-pointer"
              >
                Ver como Cliente →
              </button>
            </div>
          </div>

          {/* Main Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
            {currentTab === 'agenda' && (
              <AppointmentsView
                appointments={appointments}
                clients={clients}
                services={services}
                onNewAppointment={handleOpenNewAppointment}
                onEditAppointment={handleEditAppointment}
                onDeleteAppointment={handleDeleteAppointment}
                onUpdateStatus={handleUpdateStatus}
                onOpenQuickMessages={handleOpenQuickMessages}
              />
            )}

            {currentTab === 'clientes' && (
              <ClientsView
                clients={clients}
                appointments={appointments}
                onSaveClient={handleSaveClient}
                onDeleteClient={handleDeleteClient}
                onNewAppointmentWithClient={handleNewAppointmentWithClient}
              />
            )}

            {currentTab === 'servicos' && (
              <ServicesView
                services={services}
                onSaveService={handleSaveService}
                onDeleteService={handleDeleteService}
                onToggleActive={handleToggleActiveService}
              />
            )}

            {currentTab === 'financeiro' && (
              <FinancialView
                transactions={transactions}
                onAddTransaction={handleAddTransaction}
                onDeleteTransaction={handleDeleteTransaction}
              />
            )}

            {currentTab === 'estudio' && (
              <PolishStudioView
                polishes={polishes}
                onAddPolish={handleAddPolish}
                onToggleStock={handleToggleStockPolish}
                onDeletePolish={handleDeletePolish}
              />
            )}
          </main>

          {/* Footer */}
          <footer className="border-t border-stone-200/80 bg-white/70 py-4 mt-12 mb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
              <p>
                <strong>Kethelin Beauty Nails</strong> • Sistema de Gestão para Nail Designers
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleResetData}
                  className="inline-flex items-center gap-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restaurar dados demo</span>
                </button>
                <span>v2.0 • Supabase & LocalStorage</span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSave={handleSaveAppointment}
        appointmentToEdit={appointmentToEdit}
        clients={clients}
        services={services}
        defaultDate={defaultAppointmentDate}
      />

      {/* Quick Messages WhatsApp Modal */}
      <QuickMessagesModal
        isOpen={isQuickMessagesOpen}
        onClose={() => setIsQuickMessagesOpen(false)}
        clients={clients}
        appointments={appointments}
        preselectedClient={quickMessageClient}
        preselectedAppointment={quickMessageAppointment}
      />

      {/* Manicure Login Modal */}
      <ManicureLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccessLogin={handleSuccessLogin}
      />

      {/* Share Client Link Modal */}
      <ShareClientLinkModal
        isOpen={isShareClientLinkModalOpen}
        onClose={() => setIsShareClientLinkModalOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
