import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Appointment, Client, ServiceItem, Transaction, AppointmentStatus, PaymentMethod } from '../types';

// Read from env or default to configured Supabase project
const defaultSupabaseUrl = 'https://sxmkkhcuxllayptcvdbr.supabase.co';
const defaultSupabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4bWtraGN1eGxsYXlwdGN2ZGJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1ODM0ODUsImV4cCI6MjEwNTE1OTQ4NX0.yaNuLyuCxzJuXY7oDuAOzPHXqFO1Q_Tf4gOPLyY7Gf8';

const supabaseUrl: string =
  (import.meta as any).env?.VITE_SUPABASE_URL || defaultSupabaseUrl;
const supabaseAnonKey: string =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || defaultSupabaseAnonKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://xyzcompany.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to check Supabase connection health
export async function checkSupabaseConnection(): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('services').select('id', { count: 'exact', head: true });
    return !error;
  } catch {
    return false;
  }
}

// Normalizers between PostgreSQL columns (which can be lowercase) and TypeScript camelCase models
function mapAppointmentFromDb(r: any): Appointment {
  return {
    id: r.id,
    clientId: r.clientid || r.clientId || '',
    clientName: r.clientname || r.clientName || '',
    clientPhone: r.clientphone || r.clientPhone || '',
    serviceIds: Array.isArray(r.serviceids) ? r.serviceids : (Array.isArray(r.serviceIds) ? r.serviceIds : []),
    serviceNames: Array.isArray(r.servicenames) ? r.servicenames : (Array.isArray(r.serviceNames) ? r.serviceNames : []),
    date: r.date,
    time: r.time,
    durationMinutes: Number(r.durationminutes || r.durationMinutes || 60),
    totalPrice: Number(r.totalprice || r.totalPrice || 0),
    status: (r.status || 'agendado') as AppointmentStatus,
    notes: r.notes || '',
    paymentMethod: (r.paymentmethod || r.paymentMethod || 'pendente') as PaymentMethod,
    paid: Boolean(r.paid),
  };
}

function mapAppointmentToDb(a: Appointment): any {
  return {
    id: a.id,
    clientid: a.clientId,
    clientname: a.clientName,
    clientphone: a.clientPhone,
    serviceids: a.serviceIds,
    servicenames: a.serviceNames,
    date: a.date,
    time: a.time,
    durationminutes: a.durationMinutes,
    totalprice: a.totalPrice,
    status: a.status,
    notes: a.notes,
    paymentmethod: a.paymentMethod,
    paid: a.paid,
  };
}

function mapClientFromDb(r: any): Client {
  let allergiesArray: string[] = [];
  if (Array.isArray(r.allergies)) {
    allergiesArray = r.allergies;
  } else if (typeof r.allergies === 'string' && r.allergies.trim() && r.allergies !== 'Nenhuma') {
    allergiesArray = r.allergies.split(',').map((s: string) => s.trim());
  }

  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    email: r.email || undefined,
    birthDate: r.birthdate || r.birthDate || undefined,
    allergies: allergiesArray,
    notes: r.notes || '',
    preferredNailShape: (r.preferrednailshape || r.preferredNailShape || 'amendoada') as any,
    preferredColors: r.preferredcolors || r.preferredColors || '',
    cuticleType: (r.cuticletype || r.cuticleType || 'normal') as any,
    nailIssues: Array.isArray(r.nailissues) ? r.nailissues : (Array.isArray(r.nailIssues) ? r.nailIssues : []),
    totalSpent: Number(r.totalspent || r.totalSpent || 0),
    appointmentsCount: Number(r.appointmentscount || r.appointmentsCount || 0),
    lastVisit: r.lastvisit || r.lastVisit || undefined,
    createdAt: r.createdat || r.createdAt || new Date().toISOString().split('T')[0],
  };
}

function mapClientToDb(c: Client): any {
  return {
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email || null,
    birthdate: c.birthDate || null,
    allergies: c.allergies && c.allergies.length > 0 ? c.allergies.join(', ') : 'Nenhuma',
    notes: c.notes || '',
    preferrednailshape: c.preferredNailShape || 'amendoada',
    cuticletype: c.cuticleType || 'normal',
    totalspent: c.totalSpent || 0,
    appointmentscount: c.appointmentsCount || 0,
    lastvisit: c.lastVisit || null,
    createdat: c.createdAt || new Date().toISOString().split('T')[0],
  };
}

function mapServiceFromDb(r: any): ServiceItem {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    price: Number(r.price),
    durationMinutes: Number(r.durationminutes || r.durationMinutes || 60),
    description: r.description || '',
    active: r.active !== false,
    popular: Boolean(r.popular),
  };
}

function mapServiceToDb(s: ServiceItem): any {
  return {
    id: s.id,
    name: s.name,
    category: s.category,
    price: s.price,
    durationminutes: s.durationMinutes,
    description: s.description,
    active: s.active,
    popular: s.popular,
  };
}

function mapTransactionFromDb(r: any): Transaction {
  return {
    id: r.id,
    date: r.date,
    time: r.time,
    type: r.type as any,
    description: r.description,
    amount: Number(r.amount),
    category: r.category as any,
    paymentMethod: (r.paymentmethod || r.paymentMethod) as any,
    appointmentId: r.appointmentid || r.appointmentId || undefined,
  };
}

function mapTransactionToDb(t: Transaction): any {
  return {
    id: t.id,
    date: t.date,
    time: t.time,
    type: t.type,
    description: t.description,
    amount: t.amount,
    category: t.category,
    paymentmethod: t.paymentMethod,
    appointmentid: t.appointmentId || null,
  };
}

// Database sync operations
export const db = {
  // Appointments
  async fetchAppointments(): Promise<Appointment[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('appointments').select('*').order('date', { ascending: true });
      if (error) {
        console.warn('Supabase fetchAppointments error:', error.message);
        return null;
      }
      return (data || []).map(mapAppointmentFromDb);
    } catch (err) {
      console.warn('Supabase error:', err);
      return null;
    }
  },

  async saveAppointment(apt: Appointment): Promise<boolean> {
    if (!supabase) return false;
    try {
      const payload = mapAppointmentToDb(apt);
      const { error } = await supabase.from('appointments').upsert(payload);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase saveAppointment error:', err);
      return false;
    }
  },

  async deleteAppointment(id: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase deleteAppointment error:', err);
      return false;
    }
  },

  // Clients
  async fetchClients(): Promise<Client[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('clients').select('*').order('name', { ascending: true });
      if (error) {
        console.warn('Supabase fetchClients error:', error.message);
        return null;
      }
      return (data || []).map(mapClientFromDb);
    } catch (err) {
      console.warn('Supabase error:', err);
      return null;
    }
  },

  async saveClient(client: Client): Promise<boolean> {
    if (!supabase) return false;
    try {
      const payload = mapClientToDb(client);
      const { error } = await supabase.from('clients').upsert(payload);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase saveClient error:', err);
      return false;
    }
  },

  async deleteClient(id: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase deleteClient error:', err);
      return false;
    }
  },

  // Services
  async fetchServices(): Promise<ServiceItem[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('services').select('*').order('price', { ascending: true });
      if (error) {
        console.warn('Supabase fetchServices error:', error.message);
        return null;
      }
      return (data || []).map(mapServiceFromDb);
    } catch (err) {
      console.warn('Supabase error:', err);
      return null;
    }
  },

  async saveService(service: ServiceItem): Promise<boolean> {
    if (!supabase) return false;
    try {
      const payload = mapServiceToDb(service);
      const { error } = await supabase.from('services').upsert(payload);
      return !error;
    } catch (err) {
      console.warn('Supabase saveService error:', err);
      return false;
    }
  },

  async deleteService(id: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      return !error;
    } catch (err) {
      console.warn('Supabase deleteService error:', err);
      return false;
    }
  },

  // Transactions
  async fetchTransactions(): Promise<Transaction[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false });
      if (error) {
        console.warn('Supabase fetchTransactions error:', error.message);
        return null;
      }
      return (data || []).map(mapTransactionFromDb);
    } catch (err) {
      console.warn('Supabase error:', err);
      return null;
    }
  },

  async saveTransaction(tx: Transaction): Promise<boolean> {
    if (!supabase) return false;
    try {
      const payload = mapTransactionToDb(tx);
      const { error } = await supabase.from('transactions').upsert(payload);
      return !error;
    } catch (err) {
      console.warn('Supabase saveTransaction error:', err);
      return false;
    }
  },

  async deleteTransaction(id: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      return !error;
    } catch (err) {
      console.warn('Supabase deleteTransaction error:', err);
      return false;
    }
  },
};
