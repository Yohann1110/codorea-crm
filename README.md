# Codorea CRM

Internal Kanban board for tracking ~3000 prospects. Password-protected, shared between Yohann and Nicole.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Supabase (PostgreSQL)
- @dnd-kit — drag and drop
- Vercel — deploy target

## Setup

### 1. Create Supabase project

Go to [supabase.com](https://supabase.com), create a new project, then open the **SQL Editor** and run the contents of `supabase/schema.sql`.

### 2. Set environment variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Where to find |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → service_role key |
| `ADMIN_PASSWORD` | Choose any password |

### 3. Import CSV

Copy `final.csv` (from the parent folder) to the project root and rename it `prospects.csv`, then run:

```bash
cp ../final.csv prospects.csv
npx tsx scripts/import-csv.ts
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/login`.

### 5. Deploy to Vercel

```bash
npx vercel --prod
```

Add the four environment variables in the Vercel project settings (Settings → Environment Variables).

## Usage

- **Drag cards** between columns to update status (saved instantly to Supabase)
- **Click a card** to open the detail panel — change column, add notes (auto-saved on blur)
- **Top bar** — search by name/email/phone, filter by statut site, priority, or contacté status
- Each column header shows the live count of visible cards

## Kanban columns

| Column | `kanban_status` value |
|---|---|
| À faire | `a_faire` |
| Yohann | `yohann` |
| Nicole | `nicole` |
| Email envoyé | `email_envoye` |
| Validé | `valide` |
| Refusé | `refuse` |
