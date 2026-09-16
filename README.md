# Kethelin Beauty Nails 💅✨

Sistema web completo desenvolvido para o estúdio **Kethelin Beauty Nails**, combinando **Landing Page oficial**, **Portal da Cliente** (com agendamento online e fidelidade) e **Painel de Gestão da Manicure** (agenda, clientes, serviços, esmalteca e fluxo de caixa).

---

## 🚀 Funcionalidades

### 1. 🌐 Landing Page Oficial
- Apresentação da marca, fotos e diferenciais
- Tabela oficial de procedimentos (Molde F1, Fibra de Vidro, Banho em Gel, Esmaltação)
- Localização (*Rua Edmar Matosinho, 10*) e link direto para WhatsApp e Instagram

### 2. 💅 Portal da Cliente
- **Agendamento Online**: Seleção de procedimento, adicionais, dia e horário disponível
- **Link Compartilhável**: Acesso direto pelo link com parâmetro `?p=cliente`
- **Meus Horários**: Consulta por número de telefone
- **Cartão Fidelidade Digital**: 10 procedimentos com recompensa
- **Guia de Cuidados**: Dicas para maior durabilidade do alongamento

### 3. 🔒 Painel Administrativo da Manicure (Kethelin Pro)
- **Acesso Protegido por Senha**: Exige login (senha padrão: `kethelin123` ou PIN `1234`)
- **Gestão de Agenda**: Status dos atendimentos (*agendado, em atendimento, concluído, cancelado*)
- **Fichas de Clientes & Anamnese**: Histórico e formato de unhas favorito
- **Serviços & Preços**: Edição de tabela e tempos de mesa
- **Controle Financeiro**: Receitas por Pix/Cartão/Dinheiro e registro de despesas
- **Esmalteca & Simulador**: Catálogo de cores e formatos
- **Botão Compartilhar Link**: Copia e envia o link direto da cliente no WhatsApp ou gera QR Code

---

## 🛠️ Tecnologias
- **React 19 + TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Lucide React** (Ícones)
- **Supabase** (opcional, com fallback automático para LocalStorage)

---

## 📦 Como Rodar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🚀 Como Subir para o GitHub e Vercel

### Passo 1: Inicializar o Repositório Git e Subir no GitHub

1. No terminal do seu computador (ou aqui no projeto):
```bash
git init
git add .
git commit -m "feat: Kethelin Beauty Nails completo com login e portal de clientes"
```

2. Crie um novo repositório no seu GitHub (ex: `kethelin-beauty-nails`).
3. Conecte e envie os arquivos:
```bash
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/kethelin-beauty-nails.git
git push -u origin main
```

*(Ou utilize o menu do Google AI Studio **Settings > Export to GitHub** para exportar diretamente com 1 clique!)*

---

### Passo 2: Importar e Publicar na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta do GitHub.
2. Clique em **"Add New..."** > **"Project"**.
3. Selecione o repositório **`kethelin-beauty-nails`**.
4. A Vercel detectará automaticamente o framework **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `vite build` (ou `npm run build`)
   - **Output Directory**: `dist`
5. *(Opcional)* Em **Environment Variables**, se for utilizar o Supabase em nuvem, adicione:
   - `VITE_SUPABASE_URL`: `sua_url_do_supabase`
   - `VITE_SUPABASE_ANON_KEY`: `sua_chave_anon_do_supabase`
6. Clique em **"Deploy"**.

Em menos de 1 minuto seu site estará no ar com domínio grátis HTTPS da Vercel (e você poderá adicionar seu domínio personalizado se desejar)!
