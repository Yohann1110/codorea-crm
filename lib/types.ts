export type KanbanStatus =
  | 'a_faire'
  | 'pas_de_reponse'
  | 'appele'
  | 'a_rappeler'
  | 'demo_a_faire'
  | 'valide'
  | 'refuse'
  | 'poubelle';

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
  callback_date: string | null;
  created_at: string;
}

export interface PostIt {
  id: string;
  content: string;
  color: 'yellow' | 'pink' | 'green' | 'blue';
  created_at: string;
}

export const COLUMNS: { id: KanbanStatus; label: string }[] = [
  { id: 'a_faire', label: 'À faire' },
  { id: 'pas_de_reponse', label: '🔇 Pas de réponse' },
  { id: 'appele', label: '📞 Appelé' },
  { id: 'a_rappeler', label: '🔄 À rappeler' },
  { id: 'demo_a_faire', label: '🌐 Démo à faire' },
  { id: 'valide', label: 'Validé' },
  { id: 'refuse', label: 'Refusé' },
  { id: 'poubelle', label: '🗑 Poubelle' },
];
