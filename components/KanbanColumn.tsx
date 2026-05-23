'use client';
import { useDroppable } from '@dnd-kit/core';
import type { Prospect, KanbanStatus } from '@/lib/types';
import ProspectCard from './ProspectCard';

interface Props {
  id: KanbanStatus;
  label: string;
  prospects: Prospect[];
  onCardClick: (p: Prospect) => void;
}

export default function KanbanColumn({ id, label, prospects, onCardClick }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col min-w-0">
      <div className="sticky top-[57px] z-10 bg-[#F6F9FC] pb-2">
        <div className="bg-white border border-[#E6E9EE] rounded-xl px-4 py-2.5 flex items-center justify-between">
          <span className="font-semibold text-[#0A2540] text-sm">{label}</span>
          <span className="text-xs text-gray-400 font-medium bg-[#F6F9FC] px-2 py-0.5 rounded-full border border-[#E6E9EE]">
            {prospects.length}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 p-2 rounded-xl min-h-[100px] transition-colors ${
          isOver
            ? 'bg-[#635BFF]/10 ring-2 ring-[#635BFF]/30 ring-inset'
            : 'bg-[#E6E9EE]/30'
        }`}
      >
        {prospects.map(p => (
          <ProspectCard key={p.id} prospect={p} onClick={() => onCardClick(p)} />
        ))}
        {prospects.length === 0 && (
          <div className="flex items-center justify-center h-16 text-xs text-gray-400 italic">
            Déposer ici
          </div>
        )}
      </div>
    </div>
  );
}
