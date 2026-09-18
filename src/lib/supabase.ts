import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Appointment, Client, ServiceItem, Transaction, AppointmentStatus, PaymentMethod } from '../types';
import { GoogleBusinessConfig } from '../utils/googleBusiness';

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

  // Google Business Configuration
  async fetchGoogleConfig(): Promise<Partial<GoogleBusinessConfig> | null> {
    if (!supabase) return null;
    try {
      // 1. First attempt: google_business_config table
      const { data, error } = await supabase
        .from('google_business_config')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (!error && data) {
        return {
          apiKey: data.api_key || data.apiKey || '',
          locationId: data.location_id || data.locationId || data.place_id || '',
          placeId: data.place_id || data.placeId || data.location_id || '',
          businessName: data.business_name || data.businessName || 'Kethelin Beauty Nails',
          reviewUrl: data.review_url || data.reviewUrl || '',
          updatedAt: data.updated_at || data.updatedAt || undefined,
        };
      }

      // 2. Fallback attempt: app_settings or settings table
      const { data: settingsData, error: settingsError } = await supabase
        .from('app_settings')
        .select('*')
        .eq('key', 'google_business')
        .maybeSingle();

      if (!settingsError && settingsData && settingsData.value) {
        const val = typeof settingsData.value === 'string' ? JSON.parse(settingsData.value) : settingsData.value;
        return {
          apiKey: val.apiKey || val.api_key || '',
          locationId: val.locationId || val.location_id || '',
          placeId: val.placeId || val.location_id || '',
          businessName: val.businessName || 'Kethelin Beauty Nails',
          reviewUrl: val.reviewUrl || '',
          updatedAt: val.updatedAt,
        };
      }

      return null;
    } catch (err) {
      console.warn('Supabase fetchGoogleConfig error:', err);
      return null;
    }
  },

  async saveGoogleConfig(config: GoogleBusinessConfig): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
      return { success: false, error: 'Supabase não inicializado' };
    }

    try {
      const now = new Date().toISOString();
      const payload = {
        id: 'default',
        api_key: config.apiKey || '',
        location_id: config.locationId || config.placeId || '',
        place_id: config.placeId || config.locationId || '',
        business_name: config.businessName || 'Kethelin Beauty Nails',
        review_url: config.reviewUrl || '',
        updated_at: now,
      };

      // 1. Try upserting to google_business_config table
      const { error } = await supabase
        .from('google_business_config')
        .upsert(payload, { onConflict: 'id' });

      if (!error) {
        return { success: true };
      }

      // 2. If table doesn't exist (error code 42P01 or similar), try app_settings table
      console.info('google_business_config table note, trying app_settings:', error.message);
      const { error: settingsError } = await supabase
        .from('app_settings')
        .upsert(
          {
            key: 'google_business',
            value: {
              apiKey: config.apiKey,
              locationId: config.locationId || config.placeId,
              placeId: config.placeId || config.locationId,
              businessName: config.businessName,
              reviewUrl: config.reviewUrl,
              updatedAt: now,
            },
            updated_at: now,
          },
          { onConflict: 'key' }
        );

      if (!settingsError) {
        return { success: true };
      }

      return {
        success: false,
        error: error.message || settingsError.message || 'Erro ao gravar no Supabase',
      };
    } catch (err: any) {
      console.warn('Supabase saveGoogleConfig exception:', err);
      return {
        success: false,
        error: err?.message || 'Falha de comunicação com o Supabase',
      };
    }
  },
};
