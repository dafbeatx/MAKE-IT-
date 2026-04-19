"use client";

import {
  BookOpen,
  GraduationCap,
  FileText,
  Briefcase,
  FlaskConical,
  Mail,
  MoreHorizontal,
} from "lucide-react";

const DOC_TYPES = [
  { id: "skripsi", name: "Skripsi", icon: GraduationCap },
  { id: "tesis", name: "Tesis", icon: BookOpen },
  { id: "makalah", name: "Makalah", icon: FileText },
  { id: "laporan-kp", name: "Laporan KP", icon: Briefcase },
  { id: "laporan-pkl", name: "PKL / Magang", icon: Briefcase },
  { id: "laporan-praktikum", name: "Praktikum Lab", icon: FlaskConical },
  { id: "surat", name: "Surat Resmi", icon: Mail },
  { id: "lainnya", name: "Lainnya", icon: MoreHorizontal },
];

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function Step1TipeDokumen({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">Pilih Tipe Dokumen</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Jenis dokumen menentukan template sistematika bab bawaan.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {DOC_TYPES.map((doc) => {
          const active = value === doc.id;
          return (
            <button
              key={doc.id}
              onClick={() => onChange(doc.id)}
              className={`flex flex-col items-center gap-3 rounded-xl border-2 p-4 text-center transition-all active:scale-[0.96] sm:p-5 ${
                active
                  ? "border-brand-orange bg-orange-50 shadow-md shadow-orange-500/10 dark:bg-orange-950/20"
                  : "border-border bg-card hover:border-brand-blue/30 hover:bg-muted/50"
              }`}
            >
              <doc.icon
                className={`h-7 w-7 sm:h-8 sm:w-8 ${
                  active ? "text-brand-orange" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm font-semibold leading-tight ${
                  active ? "text-brand-orange" : "text-foreground"
                }`}
              >
                {doc.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
