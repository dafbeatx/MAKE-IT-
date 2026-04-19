"use client";

import { Check } from "lucide-react";

const FORMATS = [
  {
    id: "standar-a",
    name: "Standar A — Times New Roman",
    specs: [
      "Font: Times New Roman",
      "Isi: 12pt · Judul Bab: 14pt Bold",
      "Spasi: 1.5 lines",
      "Margin: Kiri 4cm · Atas 4cm · Kanan 3cm · Bawah 3cm",
      "Halaman: Roman (i, ii...) + Arab (1, 2...)",
    ],
  },
  {
    id: "standar-b",
    name: "Standar B — Arial",
    specs: [
      "Font: Arial",
      "Isi: 11pt · Judul Bab: 12pt Bold",
      "Spasi: 1.15 lines",
      "Margin: Normal 2.54cm semua sisi",
      "Halaman: Arab saja",
    ],
  },
  {
    id: "standar-c",
    name: "Standar C — Calibri Modern",
    specs: [
      "Font: Calibri",
      "Isi: 11pt · Judul Bab: 13pt Bold",
      "Spasi: 1.5 lines",
      "Margin: Kiri 3cm · Sisanya 2.5cm",
      "Halaman: Roman + Arab",
    ],
  },
];

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function Step4Format({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">Format Global</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pilih standar format penulisan. Semua heading, spasi, margin, dan nomor halaman akan
          mengikuti pilihan ini.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {FORMATS.map((f) => {
          const active = value === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onChange(f.id)}
              className={`relative w-full rounded-xl border-2 p-4 text-left transition-all active:scale-[0.98] sm:p-5 ${
                active
                  ? "border-brand-orange bg-orange-50/50 shadow-md shadow-orange-500/10 dark:bg-orange-950/10"
                  : "border-border bg-card hover:border-brand-blue/30"
              }`}
            >
              {active && (
                <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange text-white sm:right-4 sm:top-4">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}
              <h3
                className={`text-sm font-bold sm:text-base ${
                  active ? "text-brand-orange" : "text-foreground"
                }`}
              >
                {f.name}
              </h3>
              <ul className="mt-2 space-y-1">
                {f.specs.map((s, i) => (
                  <li key={i} className="text-xs text-muted-foreground sm:text-sm">
                    • {s}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}
