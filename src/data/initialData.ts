import { Client, ServiceItem, Appointment, Transaction, PolishItem } from '../types';

export const STUDIO_INFO = {
  name: 'Kethelin Beauty Nails',
  phone: '(11) 95251-7402',
  phoneRaw: '5511952517402',
  instagram: '@Nail_kethelinxz',
  instagramUrl: 'https://instagram.com/Nail_kethelinxz',
  address: 'Rua Edmar Matosinho, 10 - Parque Bandeirantes, Mauá - SP',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rua+Edmar+Matosinho+10+Maua+SP',
  googleReviewsUrl: 'https://www.google.com/maps/search/?api=1&query=Kethelin+Beauty+Nails+Rua+Edmar+Matosinho+10+Maua+SP',
  googleRating: 5.0,
  googleReviewCount: 0,
};

export interface GoogleReview {
  id: string;
  author: string;
  avatarColor: string;
  avatarLetter: string;
  rating: number;
  date: string;
  service: string;
  comment: string;
  verified: boolean;
}

// Inicialmente vazio para não exibir avaliações fakes/fictícias
export const GOOGLE_REVIEWS: GoogleReview[] = [];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-fibra',
    name: 'Alongamento em Fibra de Vidro',
    category: 'alongamento',
    price: 70,
    durationMinutes: 120,
    description: 'Alongamento resistente com aspecto fino e natural, curvatura impecável e acabamento duradouro.',
    active: true,
    popular: true,
  },
  {
    id: 'srv-molde-f1',
    name: 'Alongamento no Molde F1',
    category: 'alongamento',
    price: 65,
    durationMinutes: 90,
    description: 'Técnica express com molde dual form F1, estrutura pré-nivelada e brilho espelhado.',
    active: true,
    popular: true,
  },
  {
    id: 'srv-banho-gel',
    name: 'Banho em Gel / Blindagem',
    category: 'alongamento',
    price: 55,
    durationMinutes: 60,
    description: 'Camada protetora estruturada sobre a unha natural para fortalecimento, brilho e prevenção de quebras.',
    active: true,
    popular: true,
  },
  {
    id: 'srv-esmalte-gel',
    name: 'Esmaltação em Gel',
    category: 'manicure',
    price: 45,
    durationMinutes: 50,
    description: 'Secagem instantânea na cabine UV/LED, cor uniforme e durabilidade de até 20 dias sem descascar.',
    active: true,
    popular: true,
  },
  {
    id: 'srv-manutencao',
    name: 'Manutenção de Alongamento',
    category: 'alongamento',
    price: 55,
    durationMinutes: 80,
    description: 'Reposição do crescimento, nivelação da lâmina e troca de esmaltação.',
    active: true,
  },
  {
    id: 'srv-nail-art',
    name: 'Nail Art & Decoração (por unha)',
    category: 'nailart',
    price: 10,
    durationMinutes: 15,
    description: 'Francesinha reversa, babyboomer, encapsuladas, folhas de ouro ou pedrarias delicadas.',
    active: true,
  },
  {
    id: 'srv-remocao',
    name: 'Remoção Segura',
    category: 'alongamento',
    price: 30,
    durationMinutes: 40,
    description: 'Remoção cuidadosa com brocas específicas sem danificar as unhas naturais.',
    active: true,
  },
];

// Iniciar zerado para uso real de produção
export const INITIAL_CLIENTS: Client[] = [];

export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_POLISHES: PolishItem[] = [
  { id: 'pol-1', name: 'Renda Clássico', brand: 'Risqué', colorHex: '#FDFCF7', finish: 'cremoso', inStock: true, category: 'francesinha' },
  { id: 'pol-2', name: 'Preto Sépia', brand: 'Risqué', colorHex: '#1C1917', finish: 'cremoso', inStock: true, category: 'escuro' },
  { id: 'pol-3', name: 'Vermelho Carmim', brand: 'Impala', colorHex: '#B91C1C', finish: 'cremoso', inStock: true, category: 'vermelho' },
  { id: 'pol-4', name: 'Doce Pérola', brand: 'Impala', colorHex: '#F5EBE6', finish: 'cintilante', inStock: true, category: 'nude' },
  { id: 'pol-5', name: 'Taça de Vinho', brand: 'Dailus', colorHex: '#7F1D1D', finish: 'cremoso', inStock: true, category: 'escuro' },
  { id: 'pol-6', name: 'Nude Rosado Clássico', brand: 'Colorama', colorHex: '#E2B8A8', finish: 'cremoso', inStock: true, category: 'nude' },
  { id: 'pol-7', name: 'Chic Pele', brand: 'Colorama', colorHex: '#D4A390', finish: 'cremoso', inStock: true, category: 'nude' },
  { id: 'pol-8', name: 'Rosa Vintage', brand: 'Risqué', colorHex: '#DB7093', finish: 'cremoso', inStock: true, category: 'rosa' },
  { id: 'pol-9', name: 'As Mil Purpurinas', brand: 'Risqué', colorHex: '#E0E7FF', finish: 'glitter', inStock: true, category: 'colorido' },
  { id: 'pol-10', name: 'Classic Cover Gel', brand: 'Vòlia', colorHex: '#E8A598', finish: 'gel', inStock: true, category: 'nude' },
  { id: 'pol-11', name: 'Verde Menta Pastel', brand: 'Dailus', colorHex: '#A7F3D0', finish: 'cremoso', inStock: true, category: 'colorido' },
  { id: 'pol-12', name: 'Lavanda Relax', brand: 'Impala', colorHex: '#DDD6FE', finish: 'cremoso', inStock: true, category: 'colorido' },
  { id: 'pol-13', name: 'Top Coat Efeito Fosco', brand: 'Risqué', colorHex: '#E5E7EB', finish: 'fosco', inStock: true, category: 'nude' },
  { id: 'pol-14', name: 'Carmim Intenso', brand: 'Anita', colorHex: '#991B1B', finish: 'cremoso', inStock: false, category: 'vermelho' },
];
