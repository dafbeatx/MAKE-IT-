"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Download, FileText, CheckCircle, Loader2 } from "lucide-react";
import { rapikanDocument, downloadBlob } from "@/lib/api";

export default function RapikanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setResultBlob(null);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const blob = await rapikanDocument(file, "standar-a");
      setResultBlob(blob);
    } catch (err) {
      console.error(err);
      alert("Gagal merapikan dokumen. Pastikan file berformat .docx dan backend aktif.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (resultBlob && file) {
      downloadBlob(resultBlob, `RAPIKAN_${file.name}`);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-muted/30">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-sm font-bold sm:text-base">Rapikan Dokumen</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-lg space-y-8 text-center">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl text-brand-blue dark:text-blue-400">Upload File Word</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Upload dokumen .docx Anda. Sistem akan menerapkan format akademik standar tanpa mengubah
              isi teks sedikitpun.
            </p>
          </div>

          {/* Upload area */}
          <label
            htmlFor="file-upload"
            className={`flex cursor-pointer flex-col items-center gap-4 rounded-3xl border-2 border-dashed p-10 transition-all duration-300 sm:p-14 ${
              file
                ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/10 shadow-lg shadow-emerald-500/10"
                : "border-muted-foreground/30 bg-card hover:border-brand-orange hover:bg-orange-50/50 dark:hover:bg-orange-950/10"
            }`}
          >
            {resultBlob ? (
              <CheckCircle className="h-16 w-16 text-emerald-500 animate-in zoom-in duration-300" />
            ) : file ? (
              <FileText className="h-16 w-16 text-emerald-500 animate-in zoom-in duration-300" />
            ) : (
              <Upload className="h-16 w-16 text-muted-foreground" />
            )}
            
            <div className="space-y-1">
              {file ? (
                <>
                  <p className="text-sm font-bold uppercase tracking-wide">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB • {resultBlob ? "Selesai" : "Siap diproses"}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-base font-bold text-foreground">Tap untuk memilih file</p>
                  <p className="text-xs text-muted-foreground">Hanya menerima format .docx</p>
                </>
              )}
            </div>
            <input
              id="file-upload"
              type="file"
              accept=".docx"
              className="hidden"
              onChange={handleFileChange}
              disabled={processing}
            />
          </label>

          {/* Action button */}
          {!resultBlob ? (
            file && (
              <Button
                size="lg"
                className="h-14 w-full rounded-2xl bg-brand-orange text-base font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98] transition-all"
                onClick={handleProcess}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sedang Merapikan...
                  </>
                ) : (
                  "Rapikan Sekarang"
                )}
              </Button>
            )
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Button
                size="lg"
                className="h-14 w-full rounded-2xl bg-brand-blue text-base font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-800 active:scale-[0.98]"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-5 w-5" /> Unduh Hasil .docx
              </Button>
              <Button 
                variant="ghost" 
                className="text-muted-foreground text-xs"
                onClick={() => { setFile(null); setResultBlob(null); }}
              >
                Upload File Lainnya
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
