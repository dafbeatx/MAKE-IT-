"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { DEFAULT_CUSTOM_FORMAT } from "@/lib/format-types";
import type { WizardFormData } from "@/lib/format-types";
import { wizardValidation } from "@/lib/validations";

// Re-export types so existing imports from this file still work
export type { CustomFormatConfig, WizardFormData } from "@/lib/format-types";
export { DEFAULT_CUSTOM_FORMAT } from "@/lib/format-types";

import Step1TipeDokumen from "./_steps/step-1";
import Step2Sistematika from "./_steps/step-2";
import Step3Identitas from "./_steps/step-3";
import Step4Format from "./_steps/step-4";

const STEPS = [
  { id: 1, name: "Tipe Dokumen", shortName: "Tipe" },
  { id: 2, name: "Sistematika", shortName: "Bab" },
  { id: 3, name: "Identitas", shortName: "Data" },
  { id: 4, name: "Format", shortName: "Format" },
];

const DEFAULT_FORM: WizardFormData = {
  docType: "",
  hasCover: false,
  chapters: [
    { id: "1", name: "Bab 1: Pendahuluan" },
    { id: "2", name: "Bab 2: Tinjauan Pustaka" },
    { id: "3", name: "Bab 3: Metode Penelitian" },
    { id: "4", name: "Bab 4: Hasil dan Pembahasan" },
    { id: "5", name: "Bab 5: Kesimpulan dan Saran" },
  ],
  identity: {
    title: "",
    docSubtype: "",
    name: "",
    nim: "",
    institution: "",
    faculty: "",
    prodi: "",
    supervisor: "",
    year: new Date().getFullYear().toString(),
    year_hijri: "",
    degree_purpose: "Diajukan Untuk Memenuhi Syarat Memperoleh Gelar Sarjana Pendidikan",
    logo: "",
  },
  format: "standar-a",
  customFormat: { ...DEFAULT_CUSTOM_FORMAT },
};



export default function WizardPage() {
  const [step, setStep] = useState(1);
  const [mounted, setMounted] = useState(false);

  const form = useStore((state) => state.wizard);
  const setWizard = useStore((state) => state.setWizard);
  const setProject = useStore((state) => state.setProject);
  const createProject = useStore((state) => state.createInitialProjectFromWizard);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const pct = (step / STEPS.length) * 100;

  const next = useCallback(() => {
    if (step === 2) {
      const result = wizardValidation.validateStep2(form.chapters);
      if (!result.success) {
        alert("Validasi Gagal: " + result.error.issues[0].message);
        return;
      }
    } else if (step === 3 && form.hasCover) {
      const result = wizardValidation.validateStep3(form.identity);
      if (!result.success) {
        const errorMessages = result.error.issues.map((issue) => issue.message).join("\n- ");
        alert("Periksa kembali form Identitas:\n- " + errorMessages);
        return;
      }
    }
    setStep((s) => Math.min(s + 1, STEPS.length));
  }, [step, form]);

  const prev = useCallback(() => setStep((s) => Math.max(s - 1, 1)), []);

  const updateForm = useCallback(
    <K extends keyof WizardFormData>(key: K, value: WizardFormData[K]) => {
      const prevWizard = useStore.getState().wizard;
      const newState: Partial<WizardFormData> = { [key]: value };
      
      // Wipe state clean if user switches to "skripsi"
      if (key === "docType" && value === "skripsi" && prevWizard.docType !== "skripsi") {
        newState.hasCover = false;
        newState.chapters = [];
        newState.identity = {
          title: "", docSubtype: "", name: "", nim: "", institution: "", faculty: "", prodi: "", supervisor: "", year: "", year_hijri: "", degree_purpose: "Diajukan Untuk Memenuhi Syarat Memperoleh Gelar Sarjana Pendidikan", logo: ""
        };
        newState.format = "custom"; // Force strictly manual format
      } else if (key === "docType" && value !== "skripsi" && prevWizard.docType === "skripsi") {
        // Restore basic layout for other docs
        newState.chapters = DEFAULT_FORM.chapters;
        newState.format = "standar-a";
      }

      setWizard(newState);
    },
    [setWizard]
  );

  const handleFinish = () => {
    // Save to the store so the editor component can pick it up
    const project = createProject(form);
    setProject(project);
  };

  if (!mounted) {
    return <div className="flex min-h-dvh flex-col bg-muted/30"></div>;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-muted/30">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link
            href="/"
            className="text-lg font-black tracking-tight"
          >
            <span className="text-brand-blue dark:text-blue-400">MAKE</span>
            <span className="text-brand-orange">!</span>
            <span className="text-brand-blue dark:text-blue-400">T</span>
          </Link>
          <span className="text-xs font-medium text-muted-foreground sm:text-sm">
            Langkah {step}/{STEPS.length}
          </span>
        </div>
      </header>

      {/* ── Progress + step indicators ── */}
      <div className="mx-auto w-full max-w-3xl px-4 pt-5">
        <Progress value={pct} className="h-1.5 sm:h-2" />
        <div className="mt-3 flex justify-between">
          {STEPS.map((s) => (
            <button
              key={s.id}
              onClick={() => s.id < step && setStep(s.id)}
              className="flex flex-col items-center gap-1"
              disabled={s.id > step}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors sm:h-9 sm:w-9 sm:text-sm ${
                  step > s.id
                    ? "bg-emerald-500 text-white"
                    : step === s.id
                    ? "bg-brand-orange text-white shadow-md shadow-orange-500/30"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s.id ? <CheckCircle2 className="h-4 w-4" /> : s.id}
              </div>
              <span
                className={`hidden text-[10px] font-medium sm:block sm:text-xs ${
                  step >= s.id ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s.shortName}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Form area ── */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:py-8">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
          {step === 1 && (
            <Step1TipeDokumen
              value={form.docType}
              onChange={(v) => updateForm("docType", v)}
            />
          )}
          {step === 2 && (
            <Step2Sistematika
              chapters={form.chapters}
              onChange={(v) => updateForm("chapters", v)}
              hasCover={form.hasCover || false}
              onToggleCover={(v) => updateForm("hasCover", v)}
            />
          )}
          {step === 3 && (
            <Step3Identitas
              hasCover={form.hasCover || false}
              value={form.identity}
              onChange={(v) => updateForm("identity", v)}
            />
          )}
          {step === 4 && (
            <Step4Format
              docType={form.docType}
              chapters={form.chapters}
              value={form.format}
              onChange={(v) => updateForm("format", v)}
              customFormat={form.customFormat}
              onChangeCustom={(v) => updateForm("customFormat", v)}
            />
          )}
        </div>
      </div>

      {/* ── Bottom nav (fixed on mobile) ── */}
      <div className="sticky bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-lg sm:relative sm:border-0 sm:bg-transparent sm:backdrop-blur-none">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <Button
            variant="outline"
            size="lg"
            className="h-12 flex-1 rounded-xl text-sm font-semibold sm:flex-none sm:px-8"
            disabled={step === 1}
            onClick={prev}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Sebelumnya
          </Button>

          {step < STEPS.length ? (
            <Button
              size="lg"
              className="h-12 flex-1 rounded-xl bg-brand-orange text-sm font-semibold text-white hover:bg-orange-600 active:scale-[0.97] sm:flex-none sm:px-8"
              onClick={next}
            >
              Lanjutkan <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Link href={`/editor`} className="flex-1 sm:flex-none">
              <Button
                size="lg"
                className="h-12 w-full rounded-xl bg-brand-blue text-sm font-semibold text-white hover:bg-blue-800 active:scale-[0.97] sm:w-auto sm:px-8"
                onClick={handleFinish}
              >
                Selesai & Buat Dokumen
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
