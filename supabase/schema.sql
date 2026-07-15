create table if not exists prospects (
  id            uuid        primary key default gen_random_uuid(),
  priorite      integer,
  statut_site   text,
  nom           text,
  email         text,
  telephone     text,
  site_web      text,
  adresse       text,
  note_google   numeric,
  nb_avis       integer,
  recherche     text,
  commentaire_ai text,
  contacte      text,
  notes         text,
  kanban_status text        not null default 'a_faire',
  callback_date timestamptz,
  created_at    timestamptz not null default now(),

  constraint uq_nom_telephone unique (nom, telephone)
);

create index if not exists prospects_kanban_status_idx on prospects (kanban_status);
create index if not exists prospects_priorite_idx      on prospects (priorite);

-- Migration: remap old person-specific columns to a_faire
-- UPDATE prospects SET kanban_status = 'a_faire' WHERE kanban_status IN ('yohann', 'nicole');

-- Migration: the "Email envoyé" column was removed
-- UPDATE prospects SET kanban_status = 'a_faire' WHERE kanban_status = 'email_envoye';

-- Migration: add callback_date column to existing table
-- ALTER TABLE prospects ADD COLUMN IF NOT EXISTS callback_date timestamptz;

create table if not exists post_its (
  id         uuid        primary key default gen_random_uuid(),
  content    text        not null default '',
  color      text        not null default 'yellow',
  created_at timestamptz not null default now()
);
