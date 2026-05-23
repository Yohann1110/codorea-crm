'use client';
import { useDroppable } from '@dnd-kit/core';
import { useState } from 'react';
import type { Prospect, KanbanStatus } from '@/lib/types';
import ProspectCard from './ProspectCard';

interface Props {
  id: KanbanStatus;
  label: string;
  prospects: Prospect[];
  onCardClick: (p: Prospect) => void;
  onEmptyTrash?: () => Promise<void>;
}

export default function KanbanColumn({ id, label, prospects, onCardClick, onEmptyTrash }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const [confirming, setConfirming] = useState(false);
  const [emptying, setEmptying] = useState(false);
  const isTrash = id === 'poubelle';

  async function handleEmpty() {
    if (!confirming) { setConfirming(true); return; }
    setEmptying(true);
    setConfirming(false);
    await onEmptyTrash?.();
    setEmptying(false);
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="shrink-0 mb-2">
        <div
          className={`border rounded-xl px-4 py-2.5 flex items-center justify-between ${
            isTrash ? 'bg-red-50 border-red-200' : 'bg-white border-[#E6E9EE]'
          }`}
        >
          <span className={`font-semibold text-sm ${isTrash ? 'text-red-700' : 'text-[#0A2540]'}`}>
            {label}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                isTrash
                  ? 'bg-red-100 text-red-600 border-red-200'
                  : 'bg-[#F6F9FC] text-gray-400 border-[#E6E9EE]'
              }`}
            >
              {prospects.length}
            </span>
            {isTrash && prospects.length > 0 && onEmptyTrash && (
              <button
                onClick={handleEmpty}
                disabled={emptying}
                className={`text-xs px-2 py-0.5 rounded-lg font-medium transition-colors ${
                  confirming
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
              >
                {emptying ? '…' : confirming ? 'Confirmer' : 'Vider'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto flex flex-col gap-2 p-2 rounded-xl transition-colors ${
          isOver
            ? isTrash
              ? 'bg-red-100/50 ring-2 ring-red-400/40 ring-inset'
              : 'bg-[#635BFF]/10 ring-2 ring-[#635BFF]/30 ring-inset'
            : isTrash
            ? 'bg-red-50/40'
            : 'bg-[#E6E9EE]/30'
        }`}
      >
        {prospects.map(p => (
          <ProspectCard
            key={p.id}
            prospect={p}
            onClick={() => onCardClick(p)}
            isTrash={isTrash}
          />
        ))}
        {prospects.length === 0 && (
          <div className="flex items-center justify-center h-14 text-xs text-gray-400 italic select-none">
            {isTrash ? 'Glisser ici pour supprimer' : 'Déposer ici'}
          </div>
        )}
      </div>
    </div>
  );
}
