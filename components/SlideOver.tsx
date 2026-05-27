'use client';
import { useState, useRef, useEffect } from 'react';
import type { Prospect, KanbanStatus } from '@/lib/types';
import { COLUMNS } from '@/lib/types';

interface Props {
  prospect: Prospect;
  onClose: () => void;
  onUpdate: (updated: Prospect) => void;
  onDelete: (id: string) => Promise<void>;
}

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return '';
  // Convert UTC ISO to local datetime-local value
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatCallbackDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleString('fr-CH', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function SlideOver({ prospect, onClose, onUpdate, onDelete }: Props) {
  const [notes, setNotes] = useState(prospect.notes ?? '');
  const [status, setStatus] = useState<KanbanStatus>(prospect.kanban_status);
  const [callbackDate, setCallbackDate] = useState(toDatetimeLocal(prospect.callback_date));
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const savedNotes = useRef(prospect.notes ?? '');

  useEffect(() => {
    setStatus(prospect.kanban_status);
  }, [prospect.kanban_status]);

  useEffect(() => {
    setNotes(prospect.notes ?? '');
    savedNotes.current = prospect.notes ?? '';
    setCallbackDate(toDatetimeLocal(prospect.callback_date));
  }, [prospect.id]);

  async function patch(updates: Partial<{ kanban_status: KanbanStatus; notes: string; callback_date: string | null }>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/prospects/${prospect.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        onUpdate(updated);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(v: KanbanStatus) {
    setStatus(v);
    const updates: Parameters<typeof patch>[0] = { kanban_status: v };
    // clear callback_date when leaving a_rappeler
    if (v !== 'a_rappeler') {
      updates.callback_date = null;
      setCallbackDate('');
    }
    await patch(updates);
  }

  async function handleNotesBlur() {
    if (notes !== savedNotes.current) {
      savedNotes.current = notes;
      await patch({ notes });
    }
  }

  async function handleCallbackDateChange(v: string) {
    setCallbackDate(v);
    await patch({ callback_date: v ? new Date(v).toISOString() : null });
  }

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    await onDelete(prospect.id);
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/25 z-30" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-40 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#E6E9EE] shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-xl font-bold text-[#0A2540] leading-tight">{prospect.nom || '—'}</h2>
            {prospect.adresse && (
              <p className="text-sm text-gray-400 mt-1 leading-snug">{prospect.adresse}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Kanban status */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Colonne Kanban
            </label>
            <select
              value={status}
              onChange={e => handleStatusChange(e.target.value as KanbanStatus)}
              className="w-full px-3 py-2 border border-[#E6E9EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF] bg-white text-[#0A2540]"
            >
              {COLUMNS.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Callback date — only for À rappeler */}
          {status === 'a_rappeler' && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Date de rappel
                {saving && (
                  <span className="ml-2 text-[#635BFF] font-normal normal-case">enregistrement…</span>
                )}
              </label>
              <input
                type="datetime-local"
                value={callbackDate}
                onChange={e => handleCallbackDateChange(e.target.value)}
                className="w-full px-3 py-2 border border-[#E6E9EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF] bg-white text-[#0A2540]"
              />
              {callbackDate && (
                <p className="text-xs text-[#635BFF] mt-1">
                  🔔 {formatCallbackDate(new Date(callbackDate).toISOString())}
                </p>
              )}
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {prospect.statut_site && (
              <InfoField label="Statut site" value={prospect.statut_site} />
            )}
            {prospect.priorite != null && (
              <InfoField label="Priorité" value={String(prospect.priorite)} />
            )}
            {prospect.note_google != null && (
              <InfoField
                label="Note Google"
                value={`⭐ ${prospect.note_google} (${prospect.nb_avis?.toLocaleString('fr-CH') ?? '—'} avis)`}
              />
            )}
            {prospect.contacte && (
              <InfoField label="Contacté" value={prospect.contacte} />
            )}
            {prospect.recherche && (
              <InfoField label="Recherche" value={prospect.recherche} />
            )}
          </div>

          {/* Contact links */}
          <div className="space-y-2">
            {prospect.telephone && (
              <a
                href={`tel:${prospect.telephone}`}
                className="flex items-center gap-2 text-sm text-[#635BFF] hover:underline"
              >
                📞 {prospect.telephone}
              </a>
            )}
            {prospect.email && (
              <a
                href={`mailto:${prospect.email}`}
                className="flex items-center gap-2 text-sm text-[#635BFF] hover:underline break-all"
              >
                ✉ {prospect.email}
              </a>
            )}
            {prospect.site_web && (
              <a
                href={prospect.site_web}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[#635BFF] hover:underline break-all"
              >
                🔗 {prospect.site_web}
              </a>
            )}
          </div>

          {/* AI analysis */}
          {prospect.commentaire_ai && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Analyse IA
              </p>
              <div className="bg-[#635BFF]/5 border border-[#635BFF]/20 rounded-xl p-3 text-sm text-gray-700 leading-relaxed">
                {prospect.commentaire_ai}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Notes
              {saving && (
                <span className="ml-2 text-[#635BFF] font-normal normal-case">
                  enregistrement…
                </span>
              )}
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Ajouter des notes…"
              rows={5}
              className="w-full px-3 py-2 border border-[#E6E9EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF] resize-none"
            />
          </div>

          {/* Delete */}
          <div className="pt-2 border-t border-[#E6E9EE]">
            <button
              onClick={handleDelete}
              disabled={deleting}
              onBlur={() => setConfirmDelete(false)}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                confirmDelete
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
              }`}
            >
              {deleting ? 'Suppression…' : confirmDelete ? '⚠ Confirmer la suppression' : '🗑 Supprimer définitivement'}
            </button>
            {confirmDelete && (
              <p className="text-xs text-red-500 text-center mt-1">Cette action est irréversible</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-[#0A2540]">{value}</p>
    </div>
  );
}
