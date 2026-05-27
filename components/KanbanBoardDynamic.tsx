'use client';
import dynamic from 'next/dynamic';
import type { Prospect } from '@/lib/types';

const KanbanBoard = dynamic(() => import('./KanbanBoard'), { ssr: false });

export default function KanbanBoardDynamic({ initialProspects }: { initialProspects: Prospect[] }) {
  return <KanbanBoard initialProspects={initialProspects} />;
}
