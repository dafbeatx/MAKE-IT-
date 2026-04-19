"use client";

import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Chapter {
  id: string;
  name: string;
}

interface Props {
  chapters: Chapter[];
  onChange: (v: Chapter[]) => void;
}

export default function Step2Sistematika({ chapters, onChange }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (ch: Chapter) => {
    setEditingId(ch.id);
    setEditValue(ch.name);
  };

  const saveEdit = () => {
    if (!editingId || !editValue.trim()) return;
    onChange(chapters.map((c) => (c.id === editingId ? { ...c, name: editValue.trim() } : c)));
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const remove = (id: string) => {
    onChange(chapters.filter((c) => c.id !== id));
  };

  const add = () => {
    const newId = Date.now().toString();
    onChange([...chapters, { id: newId, name: `Bab ${chapters.length + 1}: Judul Bab` }]);
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const arr = [...chapters];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    onChange(arr);
  };

  const moveDown = (idx: number) => {
    if (idx === chapters.length - 1) return;
    const arr = [...chapters];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    onChange(arr);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">Sistematika Penulisan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Atur struktur dan urutan bab dokumen Anda. Tap untuk mengedit, geser untuk mengubah
          urutan.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {chapters.map((ch, idx) => (
          <div
            key={ch.id}
            className="group flex items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-sm transition-colors hover:border-brand-orange/30 sm:gap-3 sm:p-4"
          >
            {/* Drag / reorder */}
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => moveUp(idx)}
                disabled={idx === 0}
                className="flex h-5 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted disabled:opacity-30"
                aria-label="Move up"
              >
                ▲
              </button>
              <button
                onClick={() => moveDown(idx)}
                disabled={idx === chapters.length - 1}
                className="flex h-5 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted disabled:opacity-30"
                aria-label="Move down"
              >
                ▼
              </button>
            </div>

            {/* Name */}
            {editingId === ch.id ? (
              <div className="flex flex-1 items-center gap-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-10 flex-1 text-sm"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 text-emerald-600"
                  onClick={saveEdit}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 text-muted-foreground"
                  onClick={cancelEdit}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <span className="flex-1 text-sm font-medium sm:text-base">{ch.name}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 text-muted-foreground hover:text-brand-blue"
                  onClick={() => startEdit(ch)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 text-muted-foreground hover:text-red-500"
                  onClick={() => remove(ch.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        className="h-12 w-full rounded-xl border-dashed text-sm font-semibold text-muted-foreground hover:border-brand-orange hover:text-brand-orange"
        onClick={add}
      >
        <Plus className="mr-2 h-4 w-4" /> Tambah Bab Baru
      </Button>
    </div>
  );
}
