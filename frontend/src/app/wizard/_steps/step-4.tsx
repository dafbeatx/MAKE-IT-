"use client";

import { Check, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FORMATS = [
  {
    id: "standar-a",
    name: "Standar A — Times New Roman",
    specs: [
      "Font: Times New Roman",
      "Isi: 12pt · Judul Bab: 14pt Bold",
      "Spasi: 1.5 lines",
      "Margin: Kiri 4cm · Atas 4cm · Kanan 3cm · Bawah 3cm",
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
    ],
  },
];

interface CustomFormat {
  font_name: string;
  font_size_body: number;
  font_size_heading: number;
  line_spacing: number;
  margin_top: number;
  margin_bottom: number;
  margin_left: number;
  margin_right: number;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  customFormat?: CustomFormat;
  onChangeCustom?: (v: CustomFormat) => void;
}

export default function Step4Format({ value, onChange, customFormat, onChangeCustom }: Props) {
  const isCustom = value === "custom";

  const updateCustom = (field: keyof CustomFormat, val: CustomFormat[keyof CustomFormat]) => {
    if (!customFormat || !onChangeCustom) return;
    onChangeCustom({ ...customFormat, [field]: val });
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">Format Global</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pilih standar format penulisan. Dokumen final akan menggunakan margin dan opsi ini.
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

        {/* Custom Option */}
        <button
          onClick={() => onChange("custom")}
          className={`relative w-full rounded-xl border-2 p-4 text-left transition-all active:scale-[0.98] sm:p-5 ${
            isCustom
              ? "border-brand-orange bg-orange-50/50 shadow-md shadow-orange-500/10 dark:bg-orange-950/10"
              : "border-border bg-card hover:border-brand-blue/30"
          }`}
        >
          {isCustom && (
            <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange text-white sm:right-4 sm:top-4">
              <Settings2 className="h-3.5 w-3.5" />
            </div>
          )}
          <h3
            className={`text-sm font-bold sm:text-base ${
              isCustom ? "text-brand-orange" : "text-foreground"
            }`}
          >
            Manual Kustomisasi
          </h3>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Tentukan jenis font, spasi garis, dan margin kustom sesuai buku panduan kampus Anda sendiri.
          </p>
        </button>

        {isCustom && customFormat && (
          <div className="mt-2 grid grid-cols-1 gap-4 rounded-xl border-2 border-brand-orange/30 bg-card p-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Font Name</Label>
              <Input 
                value={customFormat.font_name} 
                onChange={(e) => updateCustom("font_name", e.target.value)}
                placeholder="Times New Roman, Arial..."
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Line Spacing</Label>
              <Input 
                type="number" step="0.1"
                value={customFormat.line_spacing} 
                onChange={(e) => updateCustom("line_spacing", parseFloat(e.target.value) || 1.5)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Font Size (Isi)</Label>
              <Input 
                type="number" 
                value={customFormat.font_size_body} 
                onChange={(e) => updateCustom("font_size_body", parseInt(e.target.value) || 12)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Font Size (Judul Bab)</Label>
              <Input 
                type="number" 
                value={customFormat.font_size_heading} 
                onChange={(e) => updateCustom("font_size_heading", parseInt(e.target.value) || 14)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Margin Atas (cm)</Label>
              <Input 
                type="number" step="0.1"
                value={customFormat.margin_top} 
                onChange={(e) => updateCustom("margin_top", parseFloat(e.target.value) || 4)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Margin Bawah (cm)</Label>
              <Input 
                type="number" step="0.1"
                value={customFormat.margin_bottom} 
                onChange={(e) => updateCustom("margin_bottom", parseFloat(e.target.value) || 3)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Margin Kiri (cm)</Label>
              <Input 
                type="number" step="0.1"
                value={customFormat.margin_left} 
                onChange={(e) => updateCustom("margin_left", parseFloat(e.target.value) || 4)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Margin Kanan (cm)</Label>
              <Input 
                type="number" step="0.1"
                value={customFormat.margin_right} 
                onChange={(e) => updateCustom("margin_right", parseFloat(e.target.value) || 3)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
