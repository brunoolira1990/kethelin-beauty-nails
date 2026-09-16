export type NailShape = 'quadrada' | 'amendoada' | 'bailarina' | 'stiletto' | 'oval' | 'redonda';

export type CuticleType = 'normal' | 'fina' | 'grossa' | 'ressecada';

export type AppointmentStatus = 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';

export type PaymentMethod = 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro' | 'pendente';

export interface Client {
  id: string;
  name: string;
  phone: string;
  instagram?: string;
  email?: string;
  birthDate?: string;
  notes?: string;
  allergies?: string[];
  preferredNailShape?: NailShape;
  preferredColors?: string;
  cuticleType?: CuticleType;
  nailIssues?: string[];
  createdAt: string;
  totalSpent: number;
  appointmentsCount: number;
  lastVisit?: string;
}

export type ServiceCategory = 'manicure' | 'pedicure' | 'combo' | 'alongamento' | 'nailart' | 'spa';

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  durationMinutes: number;
  description: string;
  active: boolean;
  popular?: boolean;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  serviceIds: string[];
  serviceNames: string[];
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  totalPrice: number;
  status: AppointmentStatus;
  notes?: string;
  nailArtNotes?: string;
  paymentMethod?: PaymentMethod;
  paid: boolean;
}

export type TransactionType = 'entrada' | 'saida';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: TransactionType;
  description: string;
  amount: number;
  category: 'servico' | 'produto' | 'materiais' | 'aluguel_fixo' | 'cursos' | 'outros';
  paymentMethod: PaymentMethod;
  appointmentId?: string;
}

export interface PolishItem {
  id: string;
  name: string;
  brand: string;
  colorHex: string;
  finish: 'cremoso' | 'cintilante' | 'glitter' | 'fosco' | 'gel';
  inStock: boolean;
  category: 'nude' | 'vermelho' | 'rosa' | 'escuro' | 'colorido' | 'francesinha';
}
