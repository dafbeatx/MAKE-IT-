"use client";

import { WizardFormData } from "@/app/wizard/page";

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
  customFormat: {
    font_name: "Times New Roman",
    font_size_body: 12,
    font_size_heading: 14,
    line_spacing: 1.5,
    margin_top: 4.0,
    margin_bottom: 3.0,
    margin_left: 4.0,
    margin_right: 3.0,
  },
};

// State specifically for the Editor which has sections and content
export interface EditorChapter {
  id: string;
  title: string;
  sections: {
    id: string;
    title: string;
    content: string;
  }[];
}

export interface ProjectStore {
  wizard: WizardFormData;
  chapters: EditorChapter[];
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
  const chapters: EditorChapter[] = wizard.chapters.map((ch) => {
    // Basic structural defaults based on common academic standards
    let sections = [
      { id: `${ch.id}.1`, title: `${ch.id}.1 Subjek Pembahasan`, content: "" },
    ];

    if (ch.id === "1") {
      sections = [
        { id: "1.1", title: "1.1 Latar Belakang", content: "" },
        { id: "1.2", title: "1.2 Rumusan Masalah", content: "" },
        { id: "1.3", title: "1.3 Tujuan Penelitian", content: "" },
      ];
    } else if (ch.id === "5") {
      sections = [
        { id: "5.1", title: "5.1 Kesimpulan", content: "" },
        { id: "5.2", title: "5.2 Saran", content: "" },
      ];
    }

    return {
      id: ch.id,
      title: ch.name,
      sections,
    };
  });

  return {
    wizard,
    chapters,
    lastUpdated: new Date().toISOString(),
  };
}
