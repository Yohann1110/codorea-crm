import type { SupabaseClient } from '@supabase/supabase-js';

export async function fetchAllProspects(supabase: SupabaseClient) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const all: any[] = [];
  const BATCH = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .order('priorite', { ascending: true, nullsFirst: false })
      .range(from, from + BATCH - 1);

    if (error) throw error;
    all.push(...data);
    if (data.length < BATCH) break;
    from += BATCH;
  }

  return all;
}
