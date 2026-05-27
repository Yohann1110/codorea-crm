import { createAdminClient } from '@/lib/supabase-admin';
import { fetchAllProspects } from '@/lib/fetch-all-prospects';
import KanbanBoardDynamic from '@/components/KanbanBoardDynamic';
import type { Prospect } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = createAdminClient();

  try {
    const data = await fetchAllProspects(supabase);
    return <KanbanBoardDynamic initialProspects={data as Prospect[]} />;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue';
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-sm">Erreur Supabase : {msg}</p>
      </div>
    );
  }
}
