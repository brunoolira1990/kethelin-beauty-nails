-- Schema para o Banco de Dados Supabase - Kethelin Beauty Nails
-- Execute este script no SQL Editor do seu projeto Supabase (https://supabase.com/dashboard)

-- 1. Tabela de Clientes
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  birthDate TEXT,
  allergies TEXT,
  notes TEXT,
  preferredNailShape TEXT,
  cuticleType TEXT,
  totalSpent NUMERIC DEFAULT 0,
  appointmentsCount INTEGER DEFAULT 0,
  lastVisit TEXT,
  createdAt TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabela de Serviços / Procedimentos
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  durationMinutes INTEGER NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  popular BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tabela de Agendamentos (Appointments)
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  clientId TEXT,
  clientName TEXT NOT NULL,
  clientPhone TEXT NOT NULL,
  serviceIds JSONB DEFAULT '[]'::jsonb,
  serviceNames JSONB DEFAULT '[]'::jsonb,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  durationMinutes INTEGER NOT NULL,
  totalPrice NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendado',
  notes TEXT,
  paymentMethod TEXT DEFAULT 'pendente',
  paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Tabela Financeira (Transações)
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  type TEXT NOT NULL, -- 'entrada' ou 'saida'
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  paymentMethod TEXT NOT NULL,
  appointmentId TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Inserir os serviços oficiais da Kethelin por padrão
INSERT INTO public.services (id, name, category, price, durationMinutes, description, active, popular)
VALUES
  ('srv-fibra', 'Alongamento em Fibra de Vidro', 'alongamento', 70, 120, 'Aspecto fino e natural com alta resistência e curvatura perfeita.', true, true),
  ('srv-molde-f1', 'Alongamento no Molde F1', 'alongamento', 65, 90, 'Técnica rápida e simétrica com molde dual form e brilho espelhado.', true, true),
  ('srv-banho-gel', 'Banho em Gel / Blindagem', 'alongamento', 55, 60, 'Camada fortalecedora sobre a unha natural evitando quebras e lascas.', true, true),
  ('srv-esmalte-gel', 'Esmaltação em Gel', 'manicure', 45, 50, 'Durabilidade de até 20 dias com secagem instantânea na cabine.', true, true),
  ('srv-manutencao', 'Manutenção de Alongamento', 'alongamento', 55, 80, 'Reposição do crescimento e nivelamento estrutural.', true, false),
  ('srv-nail-art', 'Nail Art & Decoração', 'nailart', 10, 15, 'Francesinha, babyboomer, encapsuladas ou pedrarias.', true, false),
  ('srv-remocao', 'Remoção Segura', 'alongamento', 30, 40, 'Remoção com brocas especiais sem danificar a lâmina.', true, false)
ON CONFLICT (id) DO UPDATE
SET price = EXCLUDED.price, name = EXCLUDED.name, description = EXCLUDED.description;

-- Ativar Row Level Security (RLS) com políticas de acesso público para o app
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso público total a clientes" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público total a servicos" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público total a agendamentos" ON public.appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público total a transacoes" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
