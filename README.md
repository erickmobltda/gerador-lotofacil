# Gerador Lotofácil

Gerador de desdobramentos e fechamentos para a Lotofácil brasileira. Maximize suas chances calculando todas as combinações possíveis a partir de um conjunto de números escolhidos.

## Stack

- React 19 + Vite 7 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- TanStack Router v1 + TanStack Query v5
- Supabase (auth + database)
- Vercel (deploy)

## Configuração local

```bash
pnpm install
cp .env.example .env.local
# Preencha as variáveis em .env.local
pnpm dev
```

## Variáveis de ambiente

Veja `.env.example` para a lista completa de variáveis necessárias.

| Variável | Descrição |
|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave pública do Supabase |
| `VITE_APP_TITLE` | Título da aplicação |
| `INTERNAL_SECRET` | Segredo para a função de email |

## Deploy

O projeto é automaticamente deployado no Vercel a cada push para a branch `main`.
