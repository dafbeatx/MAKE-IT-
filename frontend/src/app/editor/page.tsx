"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Download,
  ArrowLeft,
  Upload,
  Loader2,
} from "lucide-react";
import { getProject, saveProject, ProjectStore } from "@/lib/store";
import { generateDocument, downloadBlob, processSpss } from "@/lib/api";

export default function EditorPage() {
  const [project, setProject] = useState<ProjectStore | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>("1");
  const [expandedSection, setExpandedSection] = useState<string | null>("1.1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingSpss, setIsProcessingSpss] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load project on mount
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const data = getProject();
      if (data && isMounted) {
        setProject(data);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-save on project changes
  useEffect(() => {
    if (project) {
      saveProject({
        ...project,
        lastUpdated: new Date().toISOString(),
      });
    }
  }, [project]);

  if (!project) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-muted/30">
        <p className="text-muted-foreground transition-all animate-pulse">Memuat project...</p>
        <Link href="/wizard">
          <Button variant="outline">Mulai dari Wizard</Button>
        </Link>
      </div>
    );
  }

  const toggleChapter = (id: string) => {
    setExpandedChapter(expandedChapter === id ? null : id);
  };

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const updateContent = (chapterIdx: number, sectionIdx: number, content: string) => {
    setProject((prev) => {
      if (!prev) return null;
      const next = { ...prev };
      const nextChapters = [...next.chapters];
      nextChapters[chapterIdx] = {
        ...nextChapters[chapterIdx],
        sections: nextChapters[chapterIdx].sections.map((s, i) =>
          i === sectionIdx ? { ...s, content } : s
        ),
      };
      return { ...next, chapters: nextChapters };
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateDocument({
        identity: project.wizard.identity,
        chapters: project.chapters,
      });
      const filename = `MAKEIT_${project.wizard.identity.name.replace(/\s+/g, "_") || "Dokumen"}.docx`;
      downloadBlob(blob, filename);
    } catch (err) {
      console.error(err);
      alert("Gagal membuat dokumen. Pastikan backend berjalan.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSpssClick = () => {
    fileInputRef.current?.click();
  };

  const handleSpssChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingSpss(true);
    try {
      const blob = await processSpss(file);
      downloadBlob(blob, `Tabel_${file.name}.docx`);
      alert("Tabel berhasil dibuat! Silakan buka file tersebut dan copy tabelnya ke bab yang sesuai.");
    } catch (err) {
      console.error(err);
      alert("Gagal memproses file statistik.");
    } finally {
      setIsProcessingSpss(false);
      if (e.target) e.target.value = "";
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/wizard">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-sm font-bold leading-tight sm:text-base">Editor Dokumen</h1>
              <p className="text-[11px] text-muted-foreground">
                {project.wizard.docType} — {project.chapters.length} Bab
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/preview">
              <Button
                variant="outline"
                size="sm"
                className="h-10 gap-1.5 rounded-lg px-3 text-xs font-semibold sm:px-4 sm:text-sm"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Pratinjau</span>
              </Button>
            </Link>
            <Button
              size="sm"
              className="h-10 gap-1.5 rounded-lg bg-brand-orange px-3 text-xs font-semibold text-white hover:bg-orange-600 sm:px-4 sm:text-sm"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span className="hidden sm:inline">Generate</span> .docx
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-5 sm:py-8">
        {/* Upload SPSS/Excel bar */}
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-dashed border-border bg-card p-3 sm:p-4">
          <Upload className="h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-xs font-medium sm:text-sm">Upload file SPSS (.sav) atau Excel (.xlsx)</p>
            <p className="text-[11px] text-muted-foreground">
              Sistem akan otomatis membuat tabel statistik deskriptif rapi.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-10 shrink-0 rounded-lg px-3 text-xs"
            onClick={handleSpssClick}
            disabled={isProcessingSpss}
          >
            {isProcessingSpss ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pilih File"}
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleSpssChange} 
            className="hidden" 
            accept=".sav,.xlsx,.xls"
          />
        </div>

        {/* Accordion chapters */}
        <div className="flex flex-col gap-3">
          {project.chapters.map((chapter, chIdx) => (
            <div
              key={chapter.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50 active:bg-muted sm:p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue/10 text-xs font-bold text-brand-blue dark:bg-blue-900/30 dark:text-blue-400">
                    {chapter.id}
                  </div>
                  <span className="text-sm font-bold sm:text-base">{chapter.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {chapter.sections.filter((s) => s.content.trim()).length}/{chapter.sections.length}
                  </span>
                  {expandedChapter === chapter.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {expandedChapter === chapter.id && (
                <div className="border-t border-border">
                  {chapter.sections.map((section, sIdx) => (
                    <div key={section.id} className="border-b border-border last:border-b-0">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/30 active:bg-muted/50 sm:px-5"
                      >
                        <span className="text-sm font-medium text-foreground">
                          {section.title}
                        </span>
                        <div className="flex items-center gap-2">
                          {section.content.trim() && (
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          )}
                          {expandedSection === section.id ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </button>

                      {expandedSection === section.id && (
                        <div className="px-4 pb-4 sm:px-5">
                          <textarea
                            className="w-full rounded-xl border border-border bg-background p-4 text-base leading-relaxed placeholder:text-muted-foreground/60 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 sm:text-sm"
                            rows={8}
                            placeholder={`Ketik atau paste isi bagian "${section.title}" di sini...`}
                            value={section.content}
                            onChange={(e) => updateContent(chIdx, sIdx, e.target.value)}
                          />
                          <p className="mt-2 text-right text-[11px] text-muted-foreground">
                            {section.content.length} karakter ·{" "}
                            {section.content.split(/\s+/).filter(Boolean).length} kata
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Fixed bottom bar on mobile */}
      <div className="sticky bottom-0 z-40 flex gap-3 border-t border-border bg-background/95 p-3 backdrop-blur-lg sm:hidden">
        <Link href="/preview" className="flex-1">
          <Button
            variant="outline"
            className="h-12 w-full rounded-xl text-sm font-semibold"
          >
            <Eye className="mr-2 h-4 w-4" /> Pratinjau
          </Button>
        </Link>
        <Button 
          className="h-12 flex-1 rounded-xl bg-brand-orange text-sm font-semibold text-white hover:bg-orange-600"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Generate .docx
        </Button>
      </div>
    </div>
  );
}
