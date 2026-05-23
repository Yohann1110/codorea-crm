import { createClient } from '@supabase/supabase-js';
import { parse } from 'papaparse';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { config } from 'dotenv';

config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const csvPath = resolve(process.cwd(), 'prospects.csv');
const csv = readFileSync(csvPath, 'utf-8');

const result = parse<string[]>(csv, { skipEmptyLines: true });
const [, ...dataRows] = result.data;

console.log(`Parsing ${dataRows.length} rows…`);

const prospects = dataRows.map(row => {
  const [
    priorite,
    statut_site,
    nom,
    email,
    telephone,
    site_web,
    adresse,
    note_google,
    nb_avis,
    recherche,
    commentaire_ai,
    contacte,
    notes,
  ] = row;

  return {
    priorite: priorite?.trim() ? parseInt(priorite.trim(), 10) : null,
    statut_site: statut_site?.trim() || null,
    nom: nom?.trim() || null,
    email: email?.trim() || null,
    telephone: telephone?.trim() || null,
    site_web: site_web?.trim() || null,
    adresse: adresse?.trim().replace(/\s+/g, ' ') || null,
    note_google: note_google?.trim() ? parseFloat(note_google.trim()) : null,
    nb_avis: nb_avis?.trim() ? parseInt(nb_avis.trim().replace(/\s/g, ''), 10) : null,
    recherche: recherche?.trim() || null,
    commentaire_ai: commentaire_ai?.trim() || null,
    contacte: contacte?.trim() || null,
    notes: notes?.trim() || null,
  };
});

const BATCH = 100;
let inserted = 0;
let skipped = 0;

for (let i = 0; i < prospects.length; i += BATCH) {
  const batch = prospects.slice(i, i + BATCH);

  const { data, error } = await supabase
    .from('prospects')
    .upsert(batch, { onConflict: 'nom,telephone', ignoreDuplicates: true })
    .select('id');

  if (error) {
    console.error(`Batch ${i}–${i + BATCH}: ${error.message}`);
  } else {
    inserted += data?.length ?? 0;
    skipped += batch.length - (data?.length ?? 0);
  }

  process.stdout.write(`\r  ${Math.min(i + BATCH, prospects.length)} / ${prospects.length}`);
}

console.log(`\n\n✅  Inserted: ${inserted}   Skipped (duplicates): ${skipped}`);
