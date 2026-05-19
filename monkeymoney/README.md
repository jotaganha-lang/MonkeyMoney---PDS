# MonkeyMoney

Plataforma de literacia financeira com foco academico/profissional.

Slogan: **Aprender a gerir hoje para viver melhor amanha.**

## Stack

- Next.js 16 + TypeScript
- Tailwind CSS
- Supabase (Auth, MFA, Database)
- React Hook Form + Zod
- Recharts

## Rotas principais

- Publicas: `/`, `/auth/login`, `/auth/register`, `/auth/verify-mfa`, `/auth/forgot-password`
- Privadas: `/dashboard`, `/transactions`, `/goals`, `/learn`, `/quiz`, `/profile`, `/security`, `/settings`

## Configuracao

1. Copiar `.env.example` para `.env.local`
2. Preencher:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Executar schema SQL em Supabase: `supabase/schema.sql`

## Desenvolvimento

```bash
npm install
npm run dev
```

Build de verificacao:

```bash
npm run lint
npm run build
```
