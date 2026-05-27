'use client';
import { useState, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core';
import type { Prospect, KanbanStatus } from '@/lib/types';
import { COLUMNS } from '@/lib/types';
import KanbanColumn from './KanbanColumn';
import { CardContent } from './ProspectCard';
import SlideOver from './SlideOver';
import TopBar from './TopBar';
import PostItBoard from './PostItBoard';

export default function KanbanBoard({ initialProspects }: { initialProspects: Prospect[] }) {
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterPriorite, setFilterPriorite] = useState('');
  const [filterContacte, setFilterContacte] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [showPostIts, setShowPostIts] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const validStatuses = new Set(COLUMNS.map(c => c.id));

  // Filters only apply to the "À faire" column
  const aFaireFiltered = useMemo(() => {
    return prospects.filter(p => {
      if (p.kanban_status !== 'a_faire' && validStatuses.has(p.kanban_status)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (![p.nom, p.email, p.telephone, p.adresse, p.recherche].some(v => v?.toLowerCase().includes(q)))
          return false;
      }
      if (filterStatut && p.statut_site !== filterStatut) return false;
      if (filterPriorite && String(p.priorite) !== filterPriorite) return false;
      if (filterContacte && p.contacte !== filterContacte) return false;
      if (filterEmail === 'avec' && !p.email) return false;
      if (filterEmail === 'sans' && p.email) return false;
      return true;
    });
  }, [prospects, search, filterStatut, filterPriorite, filterContacte, filterEmail, validStatuses]);

  // Other columns: no filtering applied
  const colProspects = (status: KanbanStatus) =>
    prospects.filter(p => p.kanban_status === status);

  const colProspectsWithFallback = (status: KanbanStatus) =>
    status === 'a_faire' ? aFaireFiltered : colProspects(status);

  const activeDrag = activeId ? prospects.find(p => p.id === activeId) : null;

  const statutOptions = [
    ...new Set(prospects.map(p => p.statut_site).filter((s): s is string => !!s)),
  ].sort();

  function handleDragStart(e: DragStartEvent) {
    setActiveId(e.active.id as string);
  }

  async function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;

    const newStatus = over.id as KanbanStatus;
    if (!validStatuses.has(newStatus)) return;
    const id = active.id as string;
    const prospect = prospects.find(p => p.id === id);
    if (!prospect || prospect.kanban_status === newStatus) return;

    setProspects(prev =>
      prev.map(p => (p.id === id ? { ...p, kanban_status: newStatus } : p))
    );
    if (selectedProspect?.id === id) {
      setSelectedProspect(prev => (prev ? { ...prev, kanban_status: newStatus } : null));
    }

    try {
      const res = await fetch(`/api/prospects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kanban_status: newStatus }),
      });
      if (!res.ok) throw new Error('update failed');
    } catch {
      setProspects(prev =>
        prev.map(p => (p.id === id ? { ...p, kanban_status: prospect.kanban_status } : p))
      );
    }
  }

  function handleProspectUpdate(updated: Prospect) {
    setProspects(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    setSelectedProspect(updated);
  }

  async function handleDelete(id: string) {
    setProspects(prev => prev.filter(p => p.id !== id));
    setSelectedProspect(null);
    await fetch(`/api/prospects/${id}`, { method: 'DELETE' });
  }

  async function handleEmptyTrash() {
    setProspects(prev => prev.filter(p => p.kanban_status !== 'poubelle'));
    if (selectedProspect?.kanban_status === 'poubelle') setSelectedProspect(null);
    await fetch('/api/prospects', { method: 'DELETE' });
  }

  // Main columns: first 5 (a_faire, appele, a_rappeler, demo_a_faire, email_envoye)
  const mainCols = COLUMNS.slice(0, 5);

  return (
    <div className="flex flex-col h-screen">
      <TopBar
        search={search}
        onSearch={setSearch}
        filterStatut={filterStatut}
        onFilterStatut={setFilterStatut}
        filterPriorite={filterPriorite}
        onFilterPriorite={setFilterPriorite}
        filterContacte={filterContacte}
        onFilterContacte={setFilterContacte}
        filterEmail={filterEmail}
        onFilterEmail={setFilterEmail}
        statutOptions={statutOptions}
        totalCount={aFaireFiltered.length}
        onTogglePostIts={() => setShowPostIts(v => !v)}
        postItsOpen={showPostIts}
      />

      <div className="flex-1 overflow-x-auto overflow-y-hidden min-h-0">
        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 p-4 h-full min-w-max">
            {/* 5 main call columns */}
            {mainCols.map(col => (
              <div key={col.id} className="w-72 flex flex-col h-full min-h-0">
                <KanbanColumn
                  id={col.id}
                  label={col.label}
                  prospects={colProspectsWithFallback(col.id)}
                  onCardClick={setSelectedProspect}
                />
              </div>
            ))}

            {/* Validé + Refusé stacked */}
            <div className="w-72 flex flex-col h-full min-h-0 gap-4">
              <div className="flex-1 flex flex-col min-h-0">
                <KanbanColumn
                  id="valide"
                  label="✅ Validé"
                  prospects={colProspects('valide')}
                  onCardClick={setSelectedProspect}
                />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <KanbanColumn
                  id="refuse"
                  label="❌ Refusé"
                  prospects={colProspects('refuse')}
                  onCardClick={setSelectedProspect}
                />
              </div>
            </div>

            {/* Trash column */}
            <div className="w-72 flex flex-col h-full min-h-0">
              <KanbanColumn
                id="poubelle"
                label="🗑 Poubelle"
                prospects={colProspects('poubelle')}
                onCardClick={setSelectedProspect}
                onEmptyTrash={handleEmptyTrash}
              />
            </div>
          </div>

          <DragOverlay>
            {activeDrag && (
              <div className="w-72 rotate-1 shadow-2xl opacity-95">
                <CardContent prospect={activeDrag} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {selectedProspect && (
        <SlideOver
          prospect={selectedProspect}
          onClose={() => setSelectedProspect(null)}
          onUpdate={handleProspectUpdate}
          onDelete={handleDelete}
        />
      )}

      {showPostIts && (
        <PostItBoard onClose={() => setShowPostIts(false)} />
      )}
    </div>
  );
}
