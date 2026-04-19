"use client";

import { useState } from "react";
import {
  Check,
  Settings2,
  ChevronDown,
  Type,
  Heading1,
  AlignCenter,
  RulerIcon,
  Hash,
  IndentIncrease,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomFormatConfig, DEFAULT_CUSTOM_FORMAT } from "@/lib/format-types";

// ── Preset Definitions ──────────────────────────────────

const PRESET_CONFIGS: Record<string, CustomFormatConfig> = {
  "standar-a": {
    ...DEFAULT_CUSTOM_FORMAT,
  },
  "standar-b": {
    font_name: "Arial",
    font_size_body: 11,
    font_size_h1: 12,
    font_size_h2: 11,
    font_size_h3: 11,
    font_size_subtitle: 11,
    line_spacing: 1.15,
    h1_bold: true,
    h1_uppercase: true,
    h1_center: true,
    h2_bold: true,
    h3_bold: true,
    margin_top: 2.54,
    margin_bottom: 2.54,
    margin_left: 2.54,
    margin_right: 2.54,
    page_number_prelim: "none",
    page_number_body: "arabic",
    numbering_system: "numeric",
    first_line_indent: 1.27,
    has_quran: false,
    has_footnote: false,
    has_abstract: false,
  },
  "standar-c": {
    font_name: "Calibri",
    font_size_body: 11,
    font_size_h1: 13,
    font_size_h2: 12,
    font_size_h3: 11,
    font_size_subtitle: 11,
    line_spacing: 1.5,
    h1_bold: true,
    h1_uppercase: true,
    h1_center: true,
    h2_bold: true,
    h3_bold: true,
    margin_top: 2.5,
    margin_bottom: 2.5,
    margin_left: 3.0,
    margin_right: 2.5,
    page_number_prelim: "roman",
    page_number_body: "arabic",
    numbering_system: "numeric",
    first_line_indent: 1.27,
    has_quran: false,
    has_footnote: false,
    has_abstract: false,
  },
};

const FORMATS = [
  {
    id: "standar-a",
    name: "Standar A — Times New Roman",
    desc: "Pedoman skripsi Indonesia umum (UIN/UNPAD/UI style)",
    specs: [
      "Font: Times New Roman 12pt",
      "Heading Bab: 14pt Bold Center UPPERCASE",
      "Spasi: 1.5 lines",
      "Margin: Kiri 4cm · Atas 4cm · Kanan 3cm · Bawah 3cm",
      "Nomor: Roman (i, ii) + Arab (1, 2)",
      "Penomoran: Bab I → A. → a. → 1). → a).",
    ],
  },
  {
    id: "standar-b",
    name: "Standar B — Arial",
    desc: "Format ringkas untuk makalah & laporan",
    specs: [
      "Font: Arial 11pt",
      "Heading Bab: 12pt Bold Center",
      "Spasi: 1.15 lines",
      "Margin: Normal 2.54cm semua sisi",
      "Nomor: Arab saja",
      "Penomoran: 1. → 1.1 → 1.1.1",
    ],
  },
  {
    id: "standar-c",
    name: "Standar C — Calibri Modern",
    desc: "Gaya modern untuk tesis & disertasi",
    specs: [
      "Font: Calibri 11pt",
      "Heading Bab: 13pt Bold Center",
      "Spasi: 1.5 lines",
      "Margin: Kiri 3cm · Sisanya 2.5cm",
      "Nomor: Roman + Arab",
      "Penomoran: 1. → 1.1 → 1.1.1",
    ],
  },
];

const FONT_OPTIONS = [
  "Times New Roman",
  "Arial",
  "Calibri",
  "Georgia",
  "Cambria",
  "Garamond",
];

// ── Section Toggle Component ──────────────────────────

function SectionToggle({
  icon: Icon,
  title,
  open,
  onToggle,
  children,
}: {
  icon: React.ElementType;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/60 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 text-brand-orange" />
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && <div className="border-t border-border px-4 py-4">{children}</div>}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────

interface Props {
  docType: string;
  chapters?: any[];
  value: string;
  onChange: (v: string) => void;
  customFormat?: CustomFormatConfig;
  onChangeCustom?: (v: CustomFormatConfig) => void;
}

export default function Step4Format({
  docType,
  chapters,
  value,
  onChange,
  customFormat,
  onChangeCustom,
}: Props) {
  const isCustom = value === "custom";
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    typography: true,
    headingStyle: false,
    margin: false,
    pageNumber: false,
    numbering: false,
    indent: false,
    features: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const cfg = isCustom
    ? customFormat || DEFAULT_CUSTOM_FORMAT
    : PRESET_CONFIGS[value] || DEFAULT_CUSTOM_FORMAT;

  const updateCustom = (field: keyof CustomFormatConfig, val: string | number | boolean) => {
    if (!onChangeCustom) return;
    const current = customFormat || DEFAULT_CUSTOM_FORMAT;
    onChangeCustom({ ...current, [field]: val });
  };

  const handlePresetClick = (id: string) => {
    onChange(id);
    // Auto-fill customFormat with preset values so "custom" panel has correct values if user switches later
    if (id !== "custom" && onChangeCustom && PRESET_CONFIGS[id]) {
      onChangeCustom({ ...PRESET_CONFIGS[id] });
    }
  };

  // Dynamic strings from chapters array if available
  const previewChapterTitle = chapters?.[0]?.name || "Bab I : Pendahuluan";
  const parts = previewChapterTitle.split(":");
  const babNum = parts[0]?.trim() || "Bab I";
  const babName = parts.slice(1).join(":")?.trim() || "";
  const previewSectionTitle = chapters?.[0]?.sections?.[0]?.title 
    || (cfg.numbering_system === "standard-indo" ? "A. Latar Belakang" : "1.1 Latar Belakang");


  return (
    <div className="flex flex-col gap-5">
      {/* ── Header ── */}
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">Format Global</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pilih standar format penulisan atau kustomisasi manual sesuai buku panduan kampus Anda.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* ── LEFT: Preset + Custom Panel ── */}
        <div className="flex flex-1 flex-col gap-3">
          
          {docType !== "skripsi" && (
            <>
              {/* Preset Cards */}
              {FORMATS.map((f) => {
                const active = value === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => handlePresetClick(f.id)}
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
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{f.desc}</p>
                    <ul className="mt-2 space-y-0.5">
                      {f.specs.map((s, i) => (
                        <li
                          key={i}
                          className="text-[11px] text-muted-foreground sm:text-xs"
                        >
                          • {s}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}

              {/* Custom Option Card */}
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
                  ⚙️ Kustomisasi Manual
                </h3>
                <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                  Tentukan semua pengaturan format sesuai buku panduan kampus Anda sendiri.
                </p>
              </button>
            </>
          )}

          {/* ── Custom Config Panel ── */}
          {(isCustom || docType === "skripsi") && (
            <div className="mt-1 flex flex-col gap-2.5 rounded-2xl border-2 border-brand-orange/20 bg-muted/30 p-3 sm:p-4">
              {/* Typography */}
              <SectionToggle
                icon={Type}
                title="Tipografi"
                open={openSections.typography}
                onToggle={() => toggleSection("typography")}
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs">Font Utama</Label>
                    <select
                      value={cfg.font_name}
                      onChange={(e) => updateCustom("font_name", e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                    >
                      {FONT_OPTIONS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Isi Teks (pt)</Label>
                    <Input
                      type="number"
                      value={cfg.font_size_body}
                      onChange={(e) =>
                        updateCustom("font_size_body", parseInt(e.target.value) || 12)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Judul Bab / H1 (pt)</Label>
                    <Input
                      type="number"
                      value={cfg.font_size_h1}
                      onChange={(e) =>
                        updateCustom("font_size_h1", parseInt(e.target.value) || 14)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Subjudul / H2 (pt)</Label>
                    <Input
                      type="number"
                      value={cfg.font_size_h2}
                      onChange={(e) =>
                        updateCustom("font_size_h2", parseInt(e.target.value) || 12)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Sub-subjudul / H3 (pt)</Label>
                    <Input
                      type="number"
                      value={cfg.font_size_h3}
                      onChange={(e) =>
                        updateCustom("font_size_h3", parseInt(e.target.value) || 12)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Spasi Baris</Label>
                    <select
                      value={cfg.line_spacing}
                      onChange={(e) =>
                        updateCustom(
                          "line_spacing",
                          parseFloat(e.target.value) || 1.5
                        )
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                    >
                      <option value="1">1.0 (Single)</option>
                      <option value="1.15">1.15</option>
                      <option value="1.5">1.5</option>
                      <option value="2">2.0 (Double)</option>
                    </select>
                  </div>
                </div>
              </SectionToggle>

              {/* Heading Styles */}
              <SectionToggle
                icon={Heading1}
                title="Gaya Heading"
                open={openSections.headingStyle}
                onToggle={() => toggleSection("headingStyle")}
              >
                <div className="space-y-3">
                  <fieldset className="rounded-lg border border-border p-3">
                    <legend className="px-1.5 text-[11px] font-semibold text-muted-foreground">
                      Heading Bab (H1)
                    </legend>
                    <div className="flex flex-wrap gap-3">
                      <ToggleChip
                        label="Bold"
                        active={cfg.h1_bold}
                        onClick={() => updateCustom("h1_bold", !cfg.h1_bold)}
                      />
                      <ToggleChip
                        label="UPPERCASE"
                        active={cfg.h1_uppercase}
                        onClick={() =>
                          updateCustom("h1_uppercase", !cfg.h1_uppercase)
                        }
                      />
                      <ToggleChip
                        label="Center"
                        active={cfg.h1_center}
                        onClick={() => updateCustom("h1_center", !cfg.h1_center)}
                      />
                    </div>
                  </fieldset>
                  <fieldset className="rounded-lg border border-border p-3">
                    <legend className="px-1.5 text-[11px] font-semibold text-muted-foreground">
                      Subjudul (H2)
                    </legend>
                    <ToggleChip
                      label="Bold"
                      active={cfg.h2_bold}
                      onClick={() => updateCustom("h2_bold", !cfg.h2_bold)}
                    />
                  </fieldset>
                  <fieldset className="rounded-lg border border-border p-3">
                    <legend className="px-1.5 text-[11px] font-semibold text-muted-foreground">
                      Sub-subjudul (H3)
                    </legend>
                    <ToggleChip
                      label="Bold"
                      active={cfg.h3_bold}
                      onClick={() => updateCustom("h3_bold", !cfg.h3_bold)}
                    />
                  </fieldset>
                </div>
              </SectionToggle>

              {/* Margin */}
              <SectionToggle
                icon={RulerIcon}
                title="Margin"
                open={openSections.margin}
                onToggle={() => toggleSection("margin")}
              >
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      ["margin_top", "Atas"],
                      ["margin_bottom", "Bawah"],
                      ["margin_left", "Kiri"],
                      ["margin_right", "Kanan"],
                    ] as const
                  ).map(([field, label]) => (
                    <div key={field} className="space-y-1.5">
                      <Label className="text-xs">{label} (cm)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={cfg[field]}
                        onChange={(e) =>
                          updateCustom(field, parseFloat(e.target.value) || 3)
                        }
                      />
                    </div>
                  ))}
                </div>
              </SectionToggle>

              {/* Page Numbering */}
              <SectionToggle
                icon={AlignCenter}
                title="Nomor Halaman"
                open={openSections.pageNumber}
                onToggle={() => toggleSection("pageNumber")}
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Bagian Awal (Cover, Pengesahan)</Label>
                    <select
                      value={cfg.page_number_prelim}
                      onChange={(e) =>
                        updateCustom(
                          "page_number_prelim",
                          e.target.value as "roman" | "arabic" | "none"
                        )
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                    >
                      <option value="roman">Roman (i, ii, iii...)</option>
                      <option value="arabic">Arab (1, 2, 3...)</option>
                      <option value="none">Tanpa Nomor</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Bagian Isi (Bab I dst.)</Label>
                    <select
                      value={cfg.page_number_body}
                      onChange={(e) =>
                        updateCustom(
                          "page_number_body",
                          e.target.value as "arabic" | "roman"
                        )
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                    >
                      <option value="arabic">Arab (1, 2, 3...)</option>
                      <option value="roman">Roman (I, II, III...)</option>
                    </select>
                  </div>
                </div>
              </SectionToggle>

              {/* Numbering System */}
              <SectionToggle
                icon={Hash}
                title="Sistematika Penomoran"
                open={openSections.numbering}
                onToggle={() => toggleSection("numbering")}
              >
                <div className="space-y-3">
                  <select
                    value={cfg.numbering_system}
                    onChange={(e) =>
                      updateCustom(
                        "numbering_system",
                        e.target.value as
                          | "standard-indo"
                          | "numeric"
                          | "custom"
                      )
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                  >
                    <option value="standard-indo">
                      Standar Indonesia (Bab I → A. → a. → 1). → a).)
                    </option>
                    <option value="numeric">
                      Numerik (1. → 1.1 → 1.1.1 → 1.1.1.1)
                    </option>
                    <option value="custom">Custom (atur sendiri di editor)</option>
                  </select>
                  {cfg.numbering_system === "standard-indo" && (
                    <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                      <p className="font-semibold text-foreground">
                        Hierarki Penomoran:
                      </p>
                      <ul className="mt-1.5 space-y-0.5 font-mono">
                        <li>BAB I · PENDAHULUAN</li>
                        <li className="pl-4">A. Latar Belakang</li>
                        <li className="pl-8">a. Sub-pembahasan</li>
                        <li className="pl-12">1). Detail poin</li>
                        <li className="pl-16">a). Sub-detail</li>
                      </ul>
                    </div>
                  )}
                  {cfg.numbering_system === "numeric" && (
                    <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                      <p className="font-semibold text-foreground">
                        Hierarki Penomoran:
                      </p>
                      <ul className="mt-1.5 space-y-0.5 font-mono">
                        <li>BAB 1 · PENDAHULUAN</li>
                        <li className="pl-4">1.1 Latar Belakang</li>
                        <li className="pl-8">1.1.1 Sub-pembahasan</li>
                        <li className="pl-12">1.1.1.1 Detail poin</li>
                      </ul>
                    </div>
                  )}
                </div>
              </SectionToggle>

              {/* Indent */}
              <SectionToggle
                icon={IndentIncrease}
                title="Indentasi"
                open={openSections.indent}
                onToggle={() => toggleSection("indent")}
              >
                <div className="space-y-1.5">
                  <Label className="text-xs">Indent Baris Pertama (cm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={cfg.first_line_indent}
                    onChange={(e) =>
                      updateCustom(
                        "first_line_indent",
                        parseFloat(e.target.value) || 1.27
                      )
                    }
                  />
                </div>
              </SectionToggle>

              {/* Fitur Khusus */}
              <SectionToggle
                icon={Settings2}
                title="Fitur Khusus"
                open={openSections.features}
                onToggle={() => toggleSection("features")}
              >
                <div className="space-y-3">
                  <fieldset className="rounded-lg border border-border p-3">
                    <legend className="px-1.5 text-[11px] font-semibold text-muted-foreground">
                      Komponen Tambahan Skripsi
                    </legend>
                    <div className="flex flex-wrap gap-3">
                      <ToggleChip
                        label="Ayat Al-Qur'an"
                        active={cfg.has_quran}
                        onClick={() => updateCustom("has_quran", !cfg.has_quran)}
                      />
                      <ToggleChip
                        label="Footnote"
                        active={cfg.has_footnote}
                        onClick={() => updateCustom("has_footnote", !cfg.has_footnote)}
                      />
                      <ToggleChip
                        label="Abstrak (6 Paragraf)"
                        active={cfg.has_abstract}
                        onClick={() => updateCustom("has_abstract", !cfg.has_abstract)}
                      />
                    </div>
                  </fieldset>
                </div>
              </SectionToggle>
            </div>
          )}
        </div>

        {/* ── RIGHT: Real-Time Preview ── */}
        <div className="w-full shrink-0 lg:w-72 xl:w-80">
          <div className="sticky top-20">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Pratinjau Format
            </p>
            <div
              className="overflow-hidden rounded-xl border-2 border-border bg-white shadow-sm dark:bg-zinc-900"
              style={{
                padding: `${Math.max(cfg.margin_top * 4, 8)}px ${Math.max(cfg.margin_right * 4, 8)}px ${Math.max(cfg.margin_bottom * 4, 8)}px ${Math.max(cfg.margin_left * 4, 8)}px`,
              }}
            >
              {/* Chapter heading */}
              <p
                style={{
                  fontFamily: cfg.font_name,
                  fontSize: `${Math.min(cfg.font_size_h1, 18)}px`,
                  fontWeight: cfg.h1_bold ? 700 : 400,
                  textAlign: cfg.h1_center ? "center" : "left",
                  textTransform: cfg.h1_uppercase ? "uppercase" : "none",
                  lineHeight: cfg.line_spacing,
                }}
                className="text-foreground"
              >
                {babNum}
              </p>
              {babName && (
                <p
                  style={{
                    fontFamily: cfg.font_name,
                    fontSize: `${Math.min(cfg.font_size_h1, 18)}px`,
                    fontWeight: cfg.h1_bold ? 700 : 400,
                    textAlign: cfg.h1_center ? "center" : "left",
                    textTransform: cfg.h1_uppercase ? "uppercase" : "none",
                    lineHeight: cfg.line_spacing,
                  }}
                  className="mb-3 text-foreground"
                >
                  {babName}
                </p>
              )}

              {/* Section heading */}
              <p
                style={{
                  fontFamily: cfg.font_name,
                  fontSize: `${Math.min(cfg.font_size_h2, 16)}px`,
                  fontWeight: cfg.h2_bold ? 700 : 400,
                  lineHeight: cfg.line_spacing,
                }}
                className="mb-1 mt-3 text-foreground"
              >
                {previewSectionTitle}
              </p>

              {/* Body text */}
              <p
                style={{
                  fontFamily: cfg.font_name,
                  fontSize: `${Math.min(cfg.font_size_body, 14)}px`,
                  lineHeight: cfg.line_spacing,
                  textAlign: "justify",
                  textIndent: `${cfg.first_line_indent * 8}px`,
                }}
                className="text-muted-foreground"
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>

              {/* Sub-section (omitted for cleaner mini preview) */}
              <p
                style={{
                  fontFamily: cfg.font_name,
                  fontSize: `${Math.min(cfg.font_size_body, 14)}px`,
                  lineHeight: cfg.line_spacing,
                  textAlign: "justify",
                  textIndent: `${cfg.first_line_indent * 8}px`,
                }}
                className="text-muted-foreground"
              >
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>

              {/* Page number indicator */}
              <div className="mt-4 border-t border-border pt-1.5 text-center">
                <span
                  style={{ fontFamily: cfg.font_name }}
                  className="text-[10px] text-muted-foreground"
                >
                  {cfg.page_number_body === "arabic" ? "— 1 —" : "— I —"}
                </span>
              </div>
            </div>

            {/* Info Catatan */}
            <div className="mt-3 rounded-lg bg-muted/50 p-3">
              <p className="text-[11px] font-medium text-muted-foreground">
                💡 Cover, halaman pengesahan, gambar, tabel, chart, dan diagram
                harus dimasukkan & diatur manual oleh Anda di Editor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Toggle Chip Sub-Component ──────────────────────────
function ToggleChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
        active
          ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
          : "border-border bg-background text-muted-foreground hover:border-brand-blue/30"
      }`}
    >
      {active && <Check className="mr-1 inline-block h-3 w-3" />}
      {label}
    </button>
  );
}
