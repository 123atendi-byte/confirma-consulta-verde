# 🏥 Anna - Confirmação de Consultas

Sistema premium de confirmação de consultas com React + TypeScript + Tailwind CSS

---

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
# Acesse: http://localhost:8080

# Build para produção
npm run build

# Preview do build
npm run preview
```

---

## 📁 Estrutura do Projeto

```
src/
├── pages/
│   ├── Index.tsx           # Página principal de confirmação
│   └── NotFound.tsx        # Página 404
│
├── components/
│   ├── AppointmentCard.tsx # Card com dados da consulta
│   ├── RescheduleModal.tsx # Modal de confirmação de remarcação
│   └── ui/                 # Componentes shadcn/ui
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── toast.tsx
│       └── ...
│
├── services/
│   └── api.ts              # Integração com webhooks n8n
│
├── hooks/
│   └── use-toast.ts        # Hook de notificações
│
├── lib/
│   └── utils.ts            # Utilitários
│
└── assets/
    └── 123atendi-logo.png  # Logo
```

---

## 🔌 Integrações

### API Webhooks (n8n)

**Configuração (src/services/api.ts):**
```typescript
const API_CONFIG = {
  baseURL: 'https://webhook.123atendi.com.br/webhook/api',
  auth: {
    username: '123confirmei',
    password: 'UqHFQQ8HHjLc'
  }
};
```

**Endpoints:**
- `GET /confirmacao123?token={UUID}` - Buscar dados da consulta
- `POST /confirmaounao` - Confirmar ou remarcar consulta

---

## 🎨 Customização

### Cores (Tailwind)

Edite `tailwind.config.ts` para alterar o tema:

```typescript
theme: {
  extend: {
    colors: {
      // Cores principais Anna (verde saúde)
      primary: '#5EB561',
      // Adicione suas cores personalizadas
    }
  }
}
```

### Componentes UI

Os componentes estão em `src/components/ui/` e utilizam **shadcn/ui** com **Radix UI**.

Para adicionar novos componentes:
```bash
npx shadcn-ui@latest add [component-name]
```

---

## 🔄 Fluxo da Aplicação

1. **Usuário acessa URL com token**
   ```
   https://anna.123atendi.com.br/?token=550e8400-e29b-41d0-b4fb-426614174000
   ```

2. **App busca dados da consulta**
   ```typescript
   const data = await buscarConsulta(token);
   // Retorna: nome, data, hora, empresa, ja_confirmada
   ```

3. **Usuário pode:**
   - ✅ **Confirmar** → Chama API com `acao: 'confirma'`
   - 📅 **Remarcar** → Abre modal → Chama API com `acao: 'remarca'`

4. **Sistema atualiza:**
   - PostgreSQL (marca como confirmada/remarcada)
   - Feegow (atualiza status do agendamento)

---

## 🧩 Componentes Principais

### `<Index />` (src/pages/Index.tsx)
Página principal que gerencia todo o fluxo de confirmação.

**Estados:**
- `loading` - Carregando dados
- `consultaData` - Dados da consulta
- `isConfirmed` - Consulta confirmada/remarcada
- `error` - Erros

### `<AppointmentCard />` (src/components/AppointmentCard.tsx)
Card visual com informações da consulta.

**Props:**
```typescript
{
  clinicName: string;    // Nome da clínica
  patientName: string;   // Nome do paciente
  date: string;          // Data formatada
  time: string;          // Hora formatada
}
```

### `<RescheduleModal />` (src/components/RescheduleModal.tsx)
Modal de confirmação ao remarcar.

**Props:**
```typescript
{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}
```

---

## 🛠️ Tecnologias

### Core
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool

### UI/UX
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component Library
- **Radix UI** - Headless UI Components
- **Lucide Icons** - Icon System

### Estado e Data
- **React Query** - Server State Management
- **React Router** - Client Routing

### Notificações
- **Sonner** - Toast Notifications
- **React Hot Toast** - Toast System

---

## 📦 Build

```bash
# Build de produção
npm run build

# Saída em: ./dist/
# - index.html
# - assets/
#   - index-[hash].js
#   - index-[hash].css
```

### Deploy

1. Fazer build: `npm run build`
2. Upload da pasta `dist/` para servidor
3. Configurar servidor web (nginx exemplo):

```nginx
server {
    listen 80;
    server_name anna.123atendi.com.br;
    root /var/www/anna/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🧪 Desenvolvimento

### Variáveis de Ambiente

Crie `.env.local` para desenvolvimento:
```env
VITE_API_URL=https://webhook.123atendi.com.br/webhook/api
VITE_API_USERNAME=123confirmei
VITE_API_PASSWORD=UqHFQQ8HHjLc
```

### TypeScript

Configurações em `tsconfig.json` e `tsconfig.app.json`.

Para adicionar tipos:
```bash
npm install -D @types/[package-name]
```

---

## 🐛 Debug

### Console de Erros

Erros da API são logados no console:
```typescript
console.error('Erro ao buscar consulta:', error);
```

### React Query Devtools

Adicione em `App.tsx` (desenvolvimento):
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

---

## 📝 Scripts

```bash
npm run dev          # Dev server (http://localhost:8080)
npm run build        # Build de produção
npm run build:dev    # Build em modo desenvolvimento
npm run preview      # Preview do build
npm run lint         # ESLint
```

---

## 🔒 Segurança

- ✅ Basic Auth nos webhooks
- ✅ Tokens UUID únicos
- ✅ Validação de expiração de token
- ✅ Token single-use (não pode reutilizar)
- ✅ CORS configurado no backend

---

## 🚀 Deploy

### Docker (Produção)

Veja documentação completa em [DEPLOY.md](DEPLOY.md)

**Resumo rápido:**

```bash
# 1. Build da imagem
docker build -t 123atendi/anna-confirma-consulta:latest .

# 2. Testar localmente
docker-compose up

# 3. Push para Docker Hub
docker login
docker push 123atendi/anna-confirma-consulta:latest

# 4. Deploy no Swarm
docker stack deploy -c stack.yaml anna
```

### GitHub Actions (Automático)

O projeto está configurado com CI/CD:
- Push na branch `main` → Build e push automático
- Tags `v*` → Build com versionamento

---

## 📞 Suporte

**Desenvolvido por:** 123Atendi
**WhatsApp:** 555138401235
**Site:** https://123atendi.com.br

---

## 📄 Licença

Propriedade de 123Atendi - Todos os direitos reservados

**Versão:** 3.0 (Anna Premium)
**Última atualização:** Janeiro 2026
