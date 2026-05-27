import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  if (body.content !== undefined) updates.content = body.content;
  if (body.color !== undefined) updates.color = body.color;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('post_its')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase.from('post_its').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
