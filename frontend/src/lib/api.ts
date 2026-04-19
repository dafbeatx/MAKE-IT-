const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export interface Section {
  id: string;
  title: string;
  content: string;
}

export interface Chapter {
  id: string;
  title: string;
  sections: Section[];
}

export interface Identity {
  title: string;
  name: string;
  nim: string;
  institution: string;
  faculty: string;
  supervisor: string;
  year: string;
}

export interface FormatConfig {
  font_name: string;
  font_size_body: number;
  font_size_heading: number;
  line_spacing: number;
  margin_top: number;
  margin_bottom: number;
  margin_left: number;
  margin_right: number;
}

export interface GenerateRequest {
  identity: Identity;
  chapters: Chapter[];
  format_config?: FormatConfig;
}

export async function generateDocument(req: GenerateRequest): Promise<Blob> {
  const res = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Generate failed: ${error}`);
  }

  return res.blob();
}

export async function rapikanDocument(file: File, formatPreset: string = "standar-a"): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("format_preset", formatPreset);

  const res = await fetch(`${API_BASE}/api/rapikan`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Rapikan failed: ${error}`);
  }

  return res.blob();
}

export async function processSpss(file: File): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/spss-table`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`SPSS processing failed: ${error}`);
  }

  return res.blob();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
