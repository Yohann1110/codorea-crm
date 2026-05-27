'use client';
import { useState, useEffect, useRef } from 'react';
import type { PostIt } from '@/lib/types';

const COLOR_OPTIONS: { id: PostIt['color']; bg: string; border: string; text: string }[] = [
  { id: 'yellow', bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-900' },
  { id: 'pink',   bg: 'bg-pink-100',   border: 'border-pink-300',   text: 'text-pink-900' },
  { id: 'green',  bg: 'bg-green-100',  border: 'border-green-300',  text: 'text-green-900' },
  { id: 'blue',   bg: 'bg-blue-100',   border: 'border-blue-300',   text: 'text-blue-900' },
];

function colorStyle(color: PostIt['color']) {
  return COLOR_OPTIONS.find(c => c.id === color) ?? COLOR_OPTIONS[0];
}

interface PostItCardProps {
  postIt: PostIt;
  onUpdate: (id: string, updates: Partial<Pick<PostIt, 'content' | 'color'>>) => void;
  onDelete: (id: string) => void;
}

function PostItCard({ postIt, onUpdate, onDelete }: PostItCardProps) {
  const [content, setContent] = useState(postIt.content);
  const savedContent = useRef(postIt.content);
  const style = colorStyle(postIt.color);

  function handleBlur() {
    if (content !== savedContent.current) {
      savedContent.current = content;
      onUpdate(postIt.id, { content });
    }
  }

  return (
    <div className={`relative rounded-xl border-2 p-3 flex flex-col gap-2 shadow-sm ${style.bg} ${style.border}`}>
      {/* Delete button */}
      <button
        onClick={() => onDelete(postIt.id)}
        className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/10 hover:bg-black/20 text-black/50 hover:text-black/80 text-xs flex items-center justify-center transition-colors leading-none"
        aria-label="Supprimer"
      >
        ✕
      </button>

      {/* Color picker */}
      <div className="flex gap-1 pr-6">
        {COLOR_OPTIONS.map(c => (
          <button
            key={c.id}
            onClick={() => onUpdate(postIt.id, { color: c.id })}
            className={`w-4 h-4 rounded-full border-2 transition-transform ${c.bg} ${
              postIt.color === c.id ? `${c.border} scale-125` : 'border-transparent opacity-60 hover:opacity-100'
            }`}
            aria-label={c.id}
          />
        ))}
      </div>

      {/* Content */}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        onBlur={handleBlur}
        placeholder="Écrire une note…"
        rows={4}
        className={`w-full bg-transparent resize-none text-sm focus:outline-none placeholder:opacity-50 ${style.text}`}
      />
    </div>
  );
}

interface Props {
  onClose: () => void;
}

export default function PostItBoard({ onClose }: Props) {
  const [postIts, setPostIts] = useState<PostIt[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/postits')
      .then(r => r.json())
      .then(data => { setPostIts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleAdd(color: PostIt['color'] = 'yellow') {
    setAdding(true);
    const res = await fetch('/api/postits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: '', color }),
    });
    if (res.ok) {
      const created = await res.json();
      setPostIts(prev => [...prev, created]);
    }
    setAdding(false);
  }

  async function handleUpdate(id: string, updates: Partial<Pick<PostIt, 'content' | 'color'>>) {
    const res = await fetch(`/api/postits/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      setPostIts(prev => prev.map(p => (p.id === id ? updated : p)));
    }
  }

  async function handleDelete(id: string) {
    setPostIts(prev => prev.filter(p => p.id !== id));
    await fetch(`/api/postits/${id}`, { method: 'DELETE' });
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#FFFDF0] shadow-2xl z-50 flex flex-col border-l border-yellow-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-yellow-200 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">📝</span>
            <h2 className="font-bold text-[#0A2540] text-base">Post-its</h2>
            <span className="text-xs text-gray-400 bg-yellow-100 px-2 py-0.5 rounded-full border border-yellow-200">
              {postIts.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Quick add buttons per color */}
            <div className="flex gap-1">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleAdd(c.id)}
                  disabled={adding}
                  title={`Nouveau post-it ${c.id}`}
                  className={`w-6 h-6 rounded-full border-2 ${c.bg} ${c.border} hover:scale-110 transition-transform disabled:opacity-50`}
                />
              ))}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:bg-yellow-100 hover:text-gray-700 transition-colors text-lg leading-none"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">
              Chargement…
            </div>
          ) : postIts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
              <span className="text-4xl">📌</span>
              <p className="text-sm">Aucun post-it pour l&apos;instant</p>
              <button
                onClick={() => handleAdd('yellow')}
                className="text-sm text-yellow-700 bg-yellow-100 hover:bg-yellow-200 border border-yellow-300 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                + Créer un post-it
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {postIts.map(p => (
                <PostItCard
                  key={p.id}
                  postIt={p}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {postIts.length > 0 && (
          <div className="px-5 py-4 border-t border-yellow-200 shrink-0">
            <button
              onClick={() => handleAdd('yellow')}
              disabled={adding}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-yellow-800 bg-yellow-100 hover:bg-yellow-200 border border-yellow-300 transition-colors disabled:opacity-50"
            >
              {adding ? 'Création…' : '+ Nouveau post-it'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
