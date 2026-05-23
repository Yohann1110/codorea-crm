import { createAdminClient } from '@/lib/supabase-admin';
import KanbanBoard from '@/components/KanbanBoard';
import type { Prospect } from '@/lib/types';

export default async function HomePage() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('prospects')
    .select('*')
    .order('priorite', { ascending: true, nullsFirst: false });

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-sm">Erreur Supabase : {error.message}</p>
      </div>
    );
  }

  return <KanbanBoard initialProspects={(data ?? []) as Prospect[]} />;
}
