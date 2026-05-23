'use client';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  filterStatut: string;
  onFilterStatut: (v: string) => void;
  filterPriorite: string;
  onFilterPriorite: (v: string) => void;
  filterContacte: string;
  onFilterContacte: (v: string) => void;
  statutOptions: string[];
  totalCount: number;
}

export default function TopBar({
  search, onSearch,
  filterStatut, onFilterStatut,
  filterPriorite, onFilterPriorite,
  filterContacte, onFilterContacte,
  statutOptions,
  totalCount,
}: Props) {
  const selectClass =
    'px-3 py-2 rounded-lg border border-[#E6E9EE] text-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF] bg-white text-[#0A2540]';

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-[#E6E9EE] px-5 py-3 flex items-center gap-3 flex-wrap shadow-sm">
      <div className="flex items-center gap-2 mr-2">
        <span className="font-bold text-[#0A2540] text-base tracking-tight">Codorea CRM</span>
        <span className="text-xs text-gray-400 bg-[#F6F9FC] px-2 py-0.5 rounded-full border border-[#E6E9EE]">
          {totalCount} prospects
        </span>
      </div>

      <input
        type="text"
        placeholder="Rechercher nom, email, téléphone…"
        value={search}
        onChange={e => onSearch(e.target.value)}
        className="px-3 py-2 rounded-lg border border-[#E6E9EE] text-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF] w-56 text-[#0A2540] placeholder:text-gray-400"
      />

      <select value={filterStatut} onChange={e => onFilterStatut(e.target.value)} className={selectClass}>
        <option value="">Tous les statuts</option>
        {statutOptions.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select value={filterPriorite} onChange={e => onFilterPriorite(e.target.value)} className={selectClass}>
        <option value="">Toutes priorités</option>
        <option value="1">Priorité 1 — Haute</option>
        <option value="2">Priorité 2 — Moyenne</option>
        <option value="3">Priorité 3 — Basse</option>
      </select>

      <select value={filterContacte} onChange={e => onFilterContacte(e.target.value)} className={selectClass}>
        <option value="">Tous contacts</option>
        <option value="Oui">Déjà contacté</option>
        <option value="Non">Non contacté</option>
      </select>

      {(search || filterStatut || filterPriorite || filterContacte) && (
        <button
          onClick={() => { onSearch(''); onFilterStatut(''); onFilterPriorite(''); onFilterContacte(''); }}
          className="text-xs text-[#635BFF] hover:underline"
        >
          Effacer filtres
        </button>
      )}
    </header>
  );
}
