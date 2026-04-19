"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, ZoomIn, ZoomOut, Loader2 } from "lucide-react";
import { getProject, ProjectStore } from "@/lib/store";
import { generateDocument, downloadBlob } from "@/lib/api";

export default function PreviewPage() {
  const [project, setProject] = useState<ProjectStore | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);

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

  if (!project) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-muted/30">
        <p className="text-muted-foreground animate-pulse">Memuat pratinjau...</p>
        <Link href="/editor">
          <Button variant="outline">Kembali ke Editor</Button>
        </Link>
      </div>
    );
  }

  const zoomIn = () => setZoom((z) => Math.min(z + 20, 200));
  const zoomOut = () => setZoom((z) => Math.max(z - 20, 40));

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
      alert("Gagal mengunduh dokumen.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-gray-200 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/editor">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-sm font-bold sm:text-base">Pratinjau Dokumen</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={zoomOut}
                disabled={zoom <= 40}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-xs font-medium">{zoom}%</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={zoomIn}
                disabled={zoom >= 200}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <Button
              size="sm"
              className="h-10 gap-1.5 rounded-lg bg-brand-orange px-3 text-xs font-semibold text-white hover:bg-orange-600 sm:px-4 sm:text-sm"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span className="hidden sm:inline">Unduh</span> .docx
            </Button>
          </div>
        </div>
      </header>

      {/* Preview area */}
      <main className="flex-1 overflow-auto p-4 sm:p-8">
        <div className="mx-auto flex flex-col items-center gap-8 pb-10">
          
          {/* Page 1: Cover */}
          <div
            className="doc-preview origin-top overflow-hidden bg-white text-black shadow-xl"
            style={{
              width: `${(210 / 25.4) * 96}px`,
              minHeight: `${(297 / 25.4) * 96}px`,
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
              padding: "151px 113px 113px 151px",
              fontFamily: "'Times New Roman', Times, serif",
            }}
          >
            <div className="flex h-full flex-col items-center text-center">
              <p className="mb-12 text-[14pt] font-bold leading-tight uppercase">
                {project.wizard.identity.title || "JUDUL DOKUMEN BELUM DIISI"}
              </p>

              <p className="mb-24 text-[12pt] uppercase">{project.wizard.docType || "SKRIPSI"}</p>

              <div className="mx-auto mb-24 flex h-24 w-24 items-center justify-center rounded-lg border-2 border-gray-300 text-[10pt] text-gray-400">
                Logo Institusi
              </div>

              <p className="mb-2 text-[12pt]">Disusun oleh:</p>
              <p className="mb-1 text-[12pt] font-bold uppercase">{project.wizard.identity.name || "NAMA MAHASISWA"}</p>
              <p className="mb-14 text-[12pt]">NIM: {project.wizard.identity.nim || "-"}</p>

              <p className="mb-1 text-[12pt] font-bold uppercase">
                {project.wizard.identity.faculty || "FAKULTAS"}
              </p>
              <p className="mb-1 text-[12pt] font-bold uppercase">
                {project.wizard.identity.institution || "UNIVERSITAS"}
              </p>
              <p className="text-[12pt] font-bold">{project.wizard.identity.year || "2024"}</p>
            </div>
          </div>

          {/* Chapters */}
          {project.chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="doc-preview relative origin-top overflow-hidden bg-white text-black shadow-xl"
              style={{
                width: `${(210 / 25.4) * 96}px`,
                minHeight: `${(297 / 25.4) * 96}px`,
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                padding: "151px 113px 113px 151px",
                fontFamily: "'Times New Roman', Times, serif",
                marginTop: index === 0 ? "0" : `${(zoom / 100) * 40}px`,
              }}
            >
              <h1 className="mb-10 whitespace-pre-wrap text-center text-[14pt] font-bold leading-tight uppercase">
                {chapter.title.replace(": ", "\n")}
              </h1>

              {chapter.sections.map((section) => (
                <div key={section.id} className="mb-6">
                  <h2 className="mb-3 text-[12pt] font-bold">{section.title}</h2>
                  <div className="text-justify text-[12pt] leading-normal">
                    {section.content ? (
                      section.content.split("\n").map((para, i) => (
                        para.trim() && (
                          <p key={i} className="mb-4 indent-[1.27cm]">
                            {para.trim()}
                          </p>
                        )
                      ))
                    ) : (
                      <p className="text-gray-300 italic">Belum ada konten untuk bagian ini...</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Page Number mockup */}
              <div className="absolute bottom-[56px] right-[113px] text-[12pt]">
                {index + 2}
              </div>
            </div>
          ))}
        </div>

        {/* Spacer for mobile bottom bar */}
        <div className="h-20 sm:hidden" />
      </main>

      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-3 border-t border-border bg-background/95 p-3 backdrop-blur-lg sm:hidden">
        <Link href="/editor" className="flex-1">
          <Button variant="outline" className="h-12 w-full rounded-xl text-sm font-semibold">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </Link>
        <Button 
          className="h-12 flex-1 rounded-xl bg-brand-orange text-sm font-semibold text-white hover:bg-orange-600"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Unduh .docx
        </Button>
      </div>
    </div>
  );
}
