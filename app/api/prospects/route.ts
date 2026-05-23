import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { fetchAllProspects } from '@/lib/fetch-all-prospects';

export async function GET() {
  const supabase = createAdminClient();
  try {
    const data = await fetchAllProspects(supabase);
    return NextResponse.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// Empty the trash: delete all prospects with kanban_status = 'poubelle'
export async function DELETE() {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('prospects')
    .delete()
    .eq('kanban_status', 'poubelle');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
