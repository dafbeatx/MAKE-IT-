"use client";

import { WizardFormData, DEFAULT_CUSTOM_FORMAT } from "@/lib/format-types";

const STORAGE_KEY = "makeit_current_project";

export const DefaultProject: WizardFormData = {
  docType: "Skripsi",
  chapters: [
    { id: "1", name: "Bab 1: Pendahuluan" },
    { id: "2", name: "Bab 2: Tinjauan Pustaka" },
    { id: "3", name: "Bab 3: Metode Penelitian" },
    { id: "4", name: "Bab 4: Hasil dan Pembahasan" },
    { id: "5", name: "Bab 5: Kesimpulan dan Saran" },
  ],
  identity: {
    title: "",
    name: "",
    nim: "",
    institution: "",
    faculty: "",
    supervisor: "",
    year: new Date().getFullYear().toString(),
  },
  format: "standar-a",
  customFormat: { ...DEFAULT_CUSTOM_FORMAT },
};

// State specifically for the Editor which has sections and content
export interface EditorSection {
  id: string;
  title: string;
  content: string;
  quran?: string;
  footnote?: string;
}

export interface EditorChapter {
  id: string;
  title: string;
  sections: EditorSection[];
}

export interface ProjectStore {
  wizard: WizardFormData;
  chapters: EditorChapter[];
  abstract_paragraphs?: string[]; // 6 strings max if abstract is activated
  lastUpdated: string;
}

export function saveProject(data: ProjectStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getProject(): ProjectStore | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearProject() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function createInitialProjectFromWizard(wizard: WizardFormData): ProjectStore {
  const chapters: EditorChapter[] = wizard.chapters.map((ch, chIndex) => {
    const chapNum = chIndex + 1; // Always use sequential number
    let sections: EditorSection[] = ch.sections 
      ? [...ch.sections].map((s, sIndex) => ({ 
          ...s, 
          id: `${chapNum}.${sIndex + 1}`,
          content: "",
          quran: "",
          footnote: ""
        })) 
      : [];

    // Jika kosong (yakni bukan skripsi / tipe doc lain), generate otomatis
    if (sections.length === 0) {
      if (chapNum === 1) {
        sections = [
          { id: "1.1", title: "1.1 Latar Belakang", content: "" },
          { id: "1.2", title: "1.2 Rumusan Masalah", content: "" },
          { id: "1.3", title: "1.3 Tujuan Penelitian", content: "" },
        ];
      } else if (chapNum === 5) {
        sections = [
          { id: "5.1", title: "5.1 Kesimpulan", content: "" },
          { id: "5.2", title: "5.2 Saran", content: "" },
        ];
      } else {
        sections = [
          { id: `${chapNum}.1`, title: `${chapNum}.1 Subjek Pembahasan`, content: "" },
        ];
      }
    }

    return {
      id: chapNum.toString(),
      title: ch.name,
      sections,
    };
  });

  return {
    wizard,
    chapters,
    abstract_paragraphs: wizard.customFormat.has_abstract ? ["", "", "", "", "", ""] : undefined,
    lastUpdated: new Date().toISOString(),
  };
}
