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
  created_at    timestamptz not null default now(),

  constraint uq_nom_telephone unique (nom, telephone)
);

create index if not exists prospects_kanban_status_idx on prospects (kanban_status);
create index if not exists prospects_priorite_idx      on prospects (priorite);
