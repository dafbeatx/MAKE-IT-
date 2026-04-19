import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  FileText,
  CheckCircle,
  Settings2,
  Download,
  Upload,
  BarChart3,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const FEATURES = [
  {
    icon: FileText,
    title: "Template Akademik",
    desc: "Skripsi, Tesis, Makalah, Laporan, Surat — siap pakai.",
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  },
  {
    icon: Settings2,
    title: "Format Otomatis",
    desc: "Margin, spasi, font, heading — presisi standar akademik.",
    color: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
  },
  {
    icon: Download,
    title: "Ekspor .docx",
    desc: "Unduh langsung file Word siap cetak dan siap kumpul.",
    color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  },
  {
    icon: Upload,
    title: "Rapikan Dokumen",
    desc: "Upload file Word → otomatis rapi tanpa ubah isi.",
    color: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300",
  },
  {
    icon: BarChart3,
    title: "SPSS & Excel",
    desc: "Upload .sav/.xlsx → tabel rapi otomatis ke dokumen.",
    color: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <span className="text-xl font-black tracking-tight sm:text-2xl">
            <span className="text-brand-blue dark:text-blue-400">MAKE</span>
            <span className="text-brand-orange">!</span>
            <span className="text-brand-blue dark:text-blue-400">T</span>
          </span>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link href="/wizard">
              <Button
                size="sm"
                className="h-10 rounded-full bg-brand-orange px-4 text-sm font-semibold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.97] sm:h-11 sm:px-5 sm:text-base"
              >
                Mulai Gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pt-20 md:pt-28 lg:pb-24">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
            {/* Left text */}
            <div className="flex max-w-xl flex-col items-center gap-6 text-center lg:items-start lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground sm:text-sm">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                100% Gratis · Tanpa AI · Anda yang menulis
              </div>

              <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Buat Dokumen Rapi dalam{" "}
                <span className="relative inline-block text-brand-orange">
                  Sekejap
                  <svg
                    className="absolute -bottom-1 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                  >
                    <path
                      d="M2 8 C50 2, 150 2, 198 8"
                      stroke="#F97316"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                Isi konten di kolom yang tersedia, pilih format akademik, lalu unduh file{" "}
                <strong>.docx</strong> yang presisi. Untuk Skripsi, Makalah, Laporan, dan Surat
                resmi.
              </p>

              <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link href="/wizard" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="h-14 w-full rounded-xl bg-brand-orange px-8 text-base font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 hover:shadow-xl active:scale-[0.97] sm:w-auto"
                  >
                    Buat Dokumen Baru
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/rapikan" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 w-full rounded-xl border-2 px-8 text-base font-semibold sm:w-auto"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Rapikan File Word
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: mini preview mockup */}
            <div className="relative w-full max-w-sm shrink-0 lg:max-w-md">
              <div className="absolute -inset-4 rounded-3xl bg-linear-to-tr from-blue-500/10 via-orange-500/10 to-transparent blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-blue-900/10 dark:bg-gray-900">
                {/* Fake title bar */}
                <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  </div>
                  <span className="ml-2 text-[11px] font-medium text-muted-foreground">
                    Skripsi_Final.docx
                  </span>
                </div>
                {/* Fake doc content */}
                <div className="space-y-3 p-5 sm:p-6">
                  <div className="mx-auto h-5 w-3/4 rounded bg-blue-100 dark:bg-blue-900/40" />
                  <div className="mx-auto h-3 w-1/2 rounded bg-gray-100 dark:bg-gray-800" />
                  <div className="h-px bg-border" />
                  <div className="space-y-2 pt-2">
                    <div className="h-3 w-full rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="h-3 w-5/6 rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="h-3 w-4/6 rounded bg-gray-100 dark:bg-gray-800" />
                  </div>
                  <div className="pt-4">
                    <div className="h-4 w-2/5 rounded bg-blue-50 dark:bg-blue-900/30" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="h-3 w-3/4 rounded bg-gray-100 dark:bg-gray-800" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="border-t border-border bg-muted/30 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mb-10 text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Semua yang Anda Butuhkan
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${f.color}`}
                  >
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">{f.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA bottom */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold sm:text-3xl">Siap menyusun dokumen?</h2>
            <p className="mt-3 text-muted-foreground">
              Mulai sekarang — gratis, tanpa daftar akun, langsung pakai.
            </p>
            <Link href="/wizard">
              <Button
                size="lg"
                className="mt-8 h-14 w-full rounded-xl bg-brand-blue px-10 text-base font-bold text-white shadow-lg shadow-blue-900/20 hover:bg-blue-800 active:scale-[0.97] sm:w-auto"
              >
                Buat Dokumen Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground sm:px-6">
          <span className="font-bold text-foreground">MAKE!T</span> &mdash; Buat Dokumen Rapi dalam
          Sekejap. 100% Gratis.
        </div>
      </footer>
    </div>
  );
}
