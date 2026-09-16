import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Appointment, Client, ServiceItem, Transaction } from '../types';

const supabaseUrl: string | undefined = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey: string | undefined = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

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
    const { error } = await supabase.from('services').select('count', { count: 'exact', head: true });
    return !error;
  } catch {
    return false;
  }
}

// Database sync services
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
      return data as Appointment[];
    } catch (err) {
      console.warn('Supabase error:', err);
      return null;
    }
  },

  async saveAppointment(apt: Appointment): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('appointments').upsert(apt);
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
      if (error) return null;
      return data as Client[];
    } catch {
      return null;
    }
  },

  async saveClient(client: Client): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('clients').upsert(client);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase saveClient error:', err);
      return false;
    }
  },

  // Services
  async fetchServices(): Promise<ServiceItem[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('services').select('*').order('price', { ascending: true });
      if (error) return null;
      return data as ServiceItem[];
    } catch {
      return null;
    }
  },

  async saveService(service: ServiceItem): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('services').upsert(service);
      return !error;
    } catch {
      return false;
    }
  },

  // Transactions
  async fetchTransactions(): Promise<Transaction[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false });
      if (error) return null;
      return data as Transaction[];
    } catch {
      return null;
    }
  },

  async saveTransaction(tx: Transaction): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('transactions').upsert(tx);
      return !error;
    } catch {
      return false;
    }
  },
};
