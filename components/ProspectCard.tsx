'use client';
import { useDraggable } from '@dnd-kit/core';
import type { Prospect } from '@/lib/types';

const STATUT_COLORS: Record<string, string> = {
  'AUCUN SITE': 'bg-purple-100 text-purple-700',
  'BUILDER AMATEUR': 'bg-amber-100 text-amber-700',
  'SITE MEDIOCRE': 'bg-red-100 text-red-700',
  'FACEBOOK SEULEMENT': 'bg-orange-100 text-orange-700',
};

const PRIORITE_COLORS: Record<number, string> = {
  1: 'bg-red-100 text-red-700',
  2: 'bg-orange-100 text-orange-700',
  3: 'bg-gray-100 text-gray-500',
};

function hostname(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch { return url; }
}

export function CardContent({
  prospect,
  onClick,
  isTrash,
}: {
  prospect: Prospect;
  onClick?: () => void;
  isTrash?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`border rounded-xl p-3 shadow-sm cursor-pointer transition-all select-none ${
        isTrash
          ? 'bg-gray-50 border-gray-200 opacity-60 hover:opacity-80'
          : 'bg-white border-[#E6E9EE] hover:shadow-md hover:border-[#635BFF]/40'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className={`font-semibold text-sm leading-tight ${prospect.nom ? 'text-[#0A2540]' : 'text-gray-400 italic'}`}>
          {prospect.nom || 'Sans nom'}
        </span>
        {prospect.priorite != null && (
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
              PRIORITE_COLORS[prospect.priorite] ?? 'bg-gray-100 text-gray-500'
            }`}
          >
            P{prospect.priorite}
          </span>
        )}
      </div>

      {prospect.statut_site && (
        <span
          className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium mb-2 ${
            STATUT_COLORS[prospect.statut_site] ?? 'bg-gray-100 text-gray-500'
          }`}
        >
          {prospect.statut_site}
        </span>
      )}

      {(prospect.note_google != null || prospect.nb_avis != null) && (
        <div className="text-xs text-gray-500 mb-1.5">
          ⭐ {prospect.note_google ?? '—'} ·{' '}
          {prospect.nb_avis != null ? prospect.nb_avis.toLocaleString('fr-CH') : '—'} avis
        </div>
      )}

      {prospect.telephone && (
        <a
          href={`tel:${prospect.telephone}`}
          onClick={e => e.stopPropagation()}
          className="block text-xs text-[#635BFF] hover:underline mb-0.5"
        >
          📞 {prospect.telephone}
        </a>
      )}
      {prospect.email && (
        <a
          href={`mailto:${prospect.email}`}
          onClick={e => e.stopPropagation()}
          className="block text-xs text-[#635BFF] hover:underline mb-0.5 truncate"
        >
          ✉ {prospect.email}
        </a>
      )}
      {prospect.site_web && (
        <a
          href={prospect.site_web}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="block text-xs text-[#635BFF] hover:underline truncate"
        >
          🔗 {hostname(prospect.site_web)}
        </a>
      )}
    </div>
  );
}

export default function ProspectCard({
  prospect,
  onClick,
  isTrash,
}: {
  prospect: Prospect;
  onClick: () => void;
  isTrash?: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: prospect.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={isDragging ? 'opacity-30' : ''}
    >
      <CardContent prospect={prospect} onClick={onClick} isTrash={isTrash} />
    </div>
  );
}
