"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, ZoomIn, ZoomOut, Loader2 } from "lucide-react";
import { getProject, ProjectStore } from "@/lib/store";
import { generateDocument, downloadBlob } from "@/lib/api";
import { DEFAULT_CUSTOM_FORMAT, CustomFormatConfig } from "@/lib/format-types";

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

  // ── Resolve format config ──
  const fmt: CustomFormatConfig = project.wizard.customFormat || DEFAULT_CUSTOM_FORMAT;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateDocument({
        identity: project.wizard.identity,
        chapters: project.chapters,
        format_config: {
          font_name: fmt.font_name,
          font_size_body: fmt.font_size_body,
          font_size_h1: fmt.font_size_h1,
          font_size_h2: fmt.font_size_h2,
          font_size_h3: fmt.font_size_h3,
          font_size_subtitle: fmt.font_size_subtitle,
          font_size_heading: fmt.font_size_h1,
          line_spacing: fmt.line_spacing,
          h1_bold: fmt.h1_bold,
          h1_uppercase: fmt.h1_uppercase,
          h1_center: fmt.h1_center,
          h2_bold: fmt.h2_bold,
          h3_bold: fmt.h3_bold,
          margin_top: fmt.margin_top,
          margin_bottom: fmt.margin_bottom,
          margin_left: fmt.margin_left,
          margin_right: fmt.margin_right,
          page_number_prelim: fmt.page_number_prelim,
          page_number_body: fmt.page_number_body,
          numbering_system: fmt.numbering_system,
          first_line_indent: fmt.first_line_indent,
          has_quran: fmt.has_quran,
          has_footnote: fmt.has_footnote,
          has_abstract: fmt.has_abstract,
        },
        abstract_paragraphs: project.abstract_paragraphs,
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

  // ── Page style derived from wizard format ──
  const pageStyle = (extraMarginTop?: string) => ({
    width: `${(210 / 25.4) * 96}px`,
    minHeight: `${(297 / 25.4) * 96}px`,
    transform: `scale(${zoom / 100})`,
    transformOrigin: "top center" as const,
    padding: `${Math.round(fmt.margin_top * 37.8)}px ${Math.round(fmt.margin_right * 37.8)}px ${Math.round(fmt.margin_bottom * 37.8)}px ${Math.round(fmt.margin_left * 37.8)}px`,
    fontFamily: `'${fmt.font_name}', Times, serif`,
    marginTop: extraMarginTop || "0",
  });

  const bodyFontSize = `${fmt.font_size_body}pt`;
  const h1FontSize = `${fmt.font_size_h1}pt`;
  const h2FontSize = `${fmt.font_size_h2}pt`;

  // ── Count pages for numbering ──
  let pageCounter = 1; // Cover is page 1

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
            style={pageStyle()}
          >
            <div className="flex h-full flex-col items-center text-center">
              <p className="mb-12 font-bold leading-tight uppercase" style={{ fontSize: h1FontSize }}>
                {project.wizard.identity.title || "JUDUL DOKUMEN BELUM DIISI"}
              </p>

              <p className="mb-24 uppercase" style={{ fontSize: bodyFontSize }}>
                {project.wizard.docType || "SKRIPSI"}
              </p>

              <div className="mx-auto mb-24 flex h-24 w-24 items-center justify-center rounded-lg border-2 border-gray-300 text-[10pt] text-gray-400">
                Logo Institusi
              </div>

              <p className="mb-2" style={{ fontSize: bodyFontSize }}>Disusun oleh:</p>
              <p className="mb-1 font-bold uppercase" style={{ fontSize: bodyFontSize }}>
                {project.wizard.identity.name || "NAMA MAHASISWA"}
              </p>
              <p className="mb-14" style={{ fontSize: bodyFontSize }}>
                NIM: {project.wizard.identity.nim || "-"}
              </p>

              <p className="mb-1 font-bold uppercase" style={{ fontSize: bodyFontSize }}>
                {project.wizard.identity.faculty || "FAKULTAS"}
              </p>
              <p className="mb-1 font-bold uppercase" style={{ fontSize: bodyFontSize }}>
                {project.wizard.identity.institution || "UNIVERSITAS"}
              </p>
              <p className="font-bold" style={{ fontSize: bodyFontSize }}>
                {project.wizard.identity.year || "2024"}
              </p>
            </div>
          </div>

          {/* Page 2: Abstrak (if enabled) */}
          {fmt.has_abstract && project.abstract_paragraphs && (
            <div
              className="doc-preview relative origin-top overflow-hidden bg-white text-black shadow-xl"
              style={pageStyle(`${(zoom / 100) * 40}px`)}
            >
              <h1
                className="mb-8 whitespace-pre-wrap text-center leading-tight"
                style={{
                  fontSize: h1FontSize,
                  fontWeight: fmt.h1_bold ? "bold" : "normal",
                  textTransform: fmt.h1_uppercase ? "uppercase" : "none",
                  textAlign: fmt.h1_center ? "center" : "left",
                }}
              >
                ABSTRAK
              </h1>

              <div style={{ fontSize: bodyFontSize, lineHeight: fmt.line_spacing }}>
                {project.abstract_paragraphs.map((para, i) => (
                  para.trim() ? (
                    <p
                      key={`abs-${i}`}
                      className="mb-4 text-justify"
                      style={{ textIndent: `${fmt.first_line_indent}cm` }}
                    >
                      {para.trim()}
                    </p>
                  ) : null
                ))}
                {project.abstract_paragraphs.every(p => !p.trim()) && (
                  <p className="text-gray-300 italic">Abstrak belum diisi...</p>
                )}
              </div>

              {/* Page Number */}
              <div className="absolute bottom-[56px] right-[113px]" style={{ fontSize: bodyFontSize }}>
                {fmt.page_number_prelim === "roman" ? "ii" : fmt.page_number_prelim === "arabic" ? "2" : ""}
              </div>
            </div>
          )}

          {/* Chapters */}
          {project.chapters.map((chapter) => {
            pageCounter++;
            const pageNum = fmt.page_number_body === "roman"
              ? toRoman(pageCounter)
              : pageCounter.toString();

            return (
              <div
                key={chapter.id}
                className="doc-preview relative origin-top overflow-hidden bg-white text-black shadow-xl"
                style={pageStyle(`${(zoom / 100) * 40}px`)}
              >
                {/* Chapter heading */}
                <h1
                  className="mb-8 whitespace-pre-wrap leading-tight"
                  style={{
                    fontSize: h1FontSize,
                    fontWeight: fmt.h1_bold ? "bold" : "normal",
                    textTransform: fmt.h1_uppercase ? "uppercase" : "none",
                    textAlign: fmt.h1_center ? "center" : "left",
                  }}
                >
                  {chapter.title.replace(": ", "\n")}
                </h1>

                {chapter.sections.map((section) => (
                  <div key={section.id} className="mb-6">
                    <h2
                      className="mb-3"
                      style={{
                        fontSize: h2FontSize,
                        fontWeight: fmt.h2_bold ? "bold" : "normal",
                      }}
                    >
                      {section.title}
                    </h2>
                    <div
                      className="text-justify"
                      style={{
                        fontSize: bodyFontSize,
                        lineHeight: fmt.line_spacing,
                      }}
                    >
                      {section.content ? (
                        section.content.split("\n").map((para, i) =>
                          para.trim() ? (
                            <p
                              key={i}
                              className="mb-4"
                              style={{ textIndent: `${fmt.first_line_indent}cm` }}
                            >
                              {para.trim()}
                            </p>
                          ) : null
                        )
                      ) : (
                        <p className="text-gray-300 italic">Belum ada konten untuk bagian ini...</p>
                      )}
                    </div>

                    {/* Quran (RTL) */}
                    {fmt.has_quran && section.quran?.trim() && (
                      <div className="my-4" dir="rtl" style={{ textAlign: "right", fontSize: `${fmt.font_size_body + 6}pt`, lineHeight: "2" }}>
                        {section.quran.trim()}
                      </div>
                    )}

                    {/* Footnote */}
                    {fmt.has_footnote && section.footnote?.trim() && (
                      <div className="mt-3 border-t border-gray-400 pt-2" style={{ fontSize: "10pt" }}>
                        {section.footnote.trim()}
                      </div>
                    )}
                  </div>
                ))}

                {/* Page Number */}
                <div className="absolute bottom-[56px] right-[113px]" style={{ fontSize: bodyFontSize }}>
                  {pageNum}
                </div>
              </div>
            );
          })}
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

// ── Roman numeral helper ──
function toRoman(num: number): string {
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const literals = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let result = "";
  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      result += literals[i];
      num -= values[i];
    }
  }
  return result;
}
