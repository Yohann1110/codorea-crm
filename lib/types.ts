export type KanbanStatus = 'a_faire' | 'yohann' | 'nicole' | 'email_envoye' | 'valide' | 'refuse';

export interface Prospect {
  id: string;
  priorite: number | null;
  statut_site: string | null;
  nom: string | null;
  email: string | null;
  telephone: string | null;
  site_web: string | null;
  adresse: string | null;
  note_google: number | null;
  nb_avis: number | null;
  recherche: string | null;
  commentaire_ai: string | null;
  contacte: string | null;
  notes: string | null;
  kanban_status: KanbanStatus;
  created_at: string;
}

export const COLUMNS: { id: KanbanStatus; label: string }[] = [
  { id: 'a_faire', label: 'À faire' },
  { id: 'yohann', label: 'Yohann' },
  { id: 'nicole', label: 'Nicole' },
  { id: 'email_envoye', label: 'Email envoyé' },
  { id: 'valide', label: 'Validé' },
  { id: 'refuse', label: 'Refusé' },
];
