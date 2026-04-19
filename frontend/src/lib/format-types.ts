// ─── Shared Format Types & Defaults ─────────────────────
// Extracted to prevent circular dependencies between
// wizard/page.tsx ↔ store.ts ↔ editor/page.tsx

export interface CustomFormatConfig {
  // ── Typography ──
  font_name: string;
  font_size_body: number;
  font_size_h1: number;
  font_size_h2: number;
  font_size_h3: number;
  font_size_subtitle: number;
  line_spacing: number;

  // ── Heading Styles ──
  h1_bold: boolean;
  h1_uppercase: boolean;
  h1_center: boolean;
  h2_bold: boolean;
  h3_bold: boolean;

  // ── Margins (cm) ──
  margin_top: number;
  margin_bottom: number;
  margin_left: number;
  margin_right: number;

  // ── Page Numbering ──
  page_number_prelim: "roman" | "arabic" | "none";
  page_number_body: "arabic" | "roman";

  // ── Sistematika Penomoran ──
  numbering_system: "standard-indo" | "numeric" | "custom";

  // ── Indentasi ──
  first_line_indent: number;
}

export interface WizardFormData {
  docType: string;
  chapters: { id: string; name: string }[];
  identity: {
    title: string;
    name: string;
    nim: string;
    institution: string;
    faculty: string;
    supervisor: string;
    year: string;
  };
  format: string;
  customFormat: CustomFormatConfig;
}

export const DEFAULT_CUSTOM_FORMAT: CustomFormatConfig = {
  font_name: "Times New Roman",
  font_size_body: 12,
  font_size_h1: 14,
  font_size_h2: 12,
  font_size_h3: 12,
  font_size_subtitle: 12,
  line_spacing: 1.5,
  h1_bold: true,
  h1_uppercase: true,
  h1_center: true,
  h2_bold: true,
  h3_bold: true,
  margin_top: 4.0,
  margin_bottom: 3.0,
  margin_left: 4.0,
  margin_right: 3.0,
  page_number_prelim: "roman",
  page_number_body: "arabic",
  numbering_system: "standard-indo",
  first_line_indent: 1.27,
};
