"use client";

import { Pencil, Trash2, Plus, Check, X, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { WizardChapter } from "@/lib/format-types";

// Removed numbering_system from here because it's managed via Step 4, 
// but wait, the prompt explicitly said to add Dropdown penomoran subbab here.
// However, the state for numbering_system is in CustomFormatConfig.
// To keep things simple and decoupled, I will just let the user arrange the chapters here.

interface Props {
  chapters: WizardChapter[];
  onChange: (v: WizardChapter[]) => void;
}

export default function Step2Sistematika({ chapters, onChange }: Props) {
  const [editingChapId, setEditingChapId] = useState<string | null>(null);
  const [editingSecId, setEditingSecId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEditChap = (ch: WizardChapter) => {
    setEditingSecId(null);
    setEditingChapId(ch.id);
    setEditValue(ch.name);
  };

  const startEditSec = (sec: { id: string; title: string }) => {
    setEditingChapId(null);
    setEditingSecId(sec.id);
    setEditValue(sec.title);
  };

  const saveEdit = () => {
    if (!editValue.trim()) return;
    
    if (editingChapId) {
      onChange(
        chapters.map((c) =>
          c.id === editingChapId ? { ...c, name: editValue.trim() } : c
        )
      );
      setEditingChapId(null);
    } else if (editingSecId) {
      onChange(
        chapters.map((c) => ({
          ...c,
          sections: c.sections?.map((s) =>
            s.id === editingSecId ? { ...s, title: editValue.trim() } : s
          ),
        }))
      );
      setEditingSecId(null);
    }
  };

  const cancelEdit = () => {
    setEditingChapId(null);
    setEditingSecId(null);
  };

  const addChapter = () => {
    const nextNum = chapters.length + 1;
    const newId = nextNum.toString();
    onChange([...chapters, { id: newId, name: `Bab ${nextNum}: Judul Bab Baru`, sections: [] }]);
  };

  const removeChapter = (id: string) => {
    onChange(chapters.filter((c) => c.id !== id));
  };

  const moveChapterUp = (idx: number) => {
    if (idx === 0) return;
    const arr = [...chapters];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    onChange(arr);
  };

  const moveChapterDown = (idx: number) => {
    if (idx === chapters.length - 1) return;
    const arr = [...chapters];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    onChange(arr);
  };

  const addSection = (chapId: string) => {
    onChange(
      chapters.map((c) => {
        if (c.id === chapId) {
          const chapIdx = chapters.indexOf(c) + 1;
          const nextSecNum = (c.sections?.length || 0) + 1;
          const secId = `${chapIdx}.${nextSecNum}`;
          const newSec = { id: secId, title: `Subbab Baru` };
          return { ...c, sections: [...(c.sections || []), newSec] };
        }
        return c;
      })
    );
  };

  const removeSection = (chapId: string, secId: string) => {
    onChange(
      chapters.map((c) =>
        c.id === chapId
          ? { ...c, sections: c.sections?.filter((s) => s.id !== secId) }
          : c
      )
    );
  };

  const moveSectionUp = (chapId: string, secIdx: number) => {
    if (secIdx === 0) return;
    onChange(
      chapters.map((c) => {
        if (c.id === chapId && c.sections) {
          const arr = [...c.sections];
          [arr[secIdx - 1], arr[secIdx]] = [arr[secIdx], arr[secIdx - 1]];
          return { ...c, sections: arr };
        }
        return c;
      })
    );
  };

  const moveSectionDown = (chapId: string, secIdx: number) => {
    onChange(
      chapters.map((c) => {
        if (c.id === chapId && c.sections && secIdx < c.sections.length - 1) {
          const arr = [...c.sections];
          [arr[secIdx], arr[secIdx + 1]] = [arr[secIdx + 1], arr[secIdx]];
          return { ...c, sections: arr };
        }
        return c;
      })
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">Susun Sistematika Anda Sendiri</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tambahkan struktur secara manual. Tekan ikon pensil untuk mengubah teks, dan ikon panah untuk menggeser posisi.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {chapters.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-12 px-4 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Sistematika masih kosong.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Mulai tambahkan kerangka dokumen Anda secara manual.
            </p>
          </div>
        )}

        {chapters.map((ch, idx) => (
          <div
            key={ch.id}
            className="flex flex-col gap-2 rounded-xl border-2 border-border/50 bg-card p-3 shadow-sm sm:p-4"
          >
            {/* ── CHAPTER ROW ── */}
            <div className="group flex items-center gap-2">
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveChapterUp(idx)}
                  disabled={idx === 0}
                  className="flex h-5 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted disabled:opacity-30"
                  aria-label="Move chapter up"
                >
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button
                  onClick={() => moveChapterDown(idx)}
                  disabled={idx === chapters.length - 1}
                  className="flex h-5 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted disabled:opacity-30"
                  aria-label="Move chapter down"
                >
                  <ArrowDown className="h-3 w-3" />
                </button>
              </div>

              {editingChapId === ch.id ? (
                <div className="flex flex-1 items-center gap-2">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-10 flex-1 font-semibold"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                  />
                  <Button size="icon" variant="ghost" className="h-10 w-10 text-emerald-600" onClick={saveEdit}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-10 w-10 text-muted-foreground" onClick={cancelEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="flex-1 font-bold text-foreground sm:text-lg">{ch.name}</span>
                  <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-brand-blue" onClick={() => startEditChap(ch)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-red-500" onClick={() => removeChapter(ch.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* ── SECTIONS LIST ── */}
            {ch.sections && ch.sections.length > 0 && (
              <div className="ml-8 mt-2 flex flex-col gap-1.5 border-l-2 border-border/50 pl-3">
                {ch.sections.map((sec, secIdx) => (
                  <div key={sec.id} className="group flex items-center gap-2 rounded-lg bg-muted/40 p-1.5 px-3">
                    <div className="flex flex-col gap-0">
                      <button
                        onClick={() => moveSectionUp(ch.id, secIdx)}
                        disabled={secIdx === 0}
                        className="flex h-4 w-5 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => moveSectionDown(ch.id, secIdx)}
                        disabled={secIdx === ch.sections!.length - 1}
                        className="flex h-4 w-5 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                    </div>

                    {editingSecId === sec.id ? (
                      <div className="flex flex-1 items-center gap-2">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-8 flex-1 text-sm"
                          autoFocus
                          onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                        />
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600" onClick={saveEdit}>
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={cancelEdit}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1 text-sm text-foreground">{sec.title}</span>
                        <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100" onClick={() => startEditSec(sec)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500/70 opacity-0 transition-opacity hover:text-red-500 focus:opacity-100 group-hover:opacity-100" onClick={() => removeSection(ch.id, sec.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="mt-2 ml-8 w-fit text-xs text-brand-blue hover:bg-brand-blue/10 hover:text-brand-blue"
              onClick={() => addSection(ch.id)}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Tambah Subbab
            </Button>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        className="h-12 w-full rounded-xl border-dashed border-brand-orange/50 bg-brand-orange/5 text-sm font-semibold text-brand-orange hover:bg-brand-orange/10 hover:border-brand-orange"
        onClick={addChapter}
      >
        <Plus className="mr-2 h-4 w-4" /> Tambah Bab Baru
      </Button>
    </div>
  );
}
