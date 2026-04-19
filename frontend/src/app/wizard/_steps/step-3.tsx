"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IdentityData {
  title: string;
  docSubtype?: string;
  name: string;
  nim: string;
  institution: string;
  faculty: string;
  prodi?: string;
  supervisor: string;
  year: string;
  year_hijri?: string;
  degree_purpose?: string;
  logo?: string;
  address?: string;
}

interface Props {
  value: IdentityData;
  onChange: (v: IdentityData) => void;
  hasCover?: boolean;
}

export default function Step3Identitas({ value, onChange, hasCover }: Props) {
  const update = (key: keyof IdentityData, val: string) => {
    onChange({ ...value, [key]: val });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran logo maksimal 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        update("logo", ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">Data Identitas</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Informasi ini otomatis mengisi halaman sampul dan lembar pengesahan.
        </p>
      </div>

      {hasCover && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex-1 space-y-2">
              <Label htmlFor="w-logo" className="text-sm font-semibold text-emerald-700">Logo Institusi (Opsional)</Label>
              <Input
                id="w-logo"
                type="file"
                accept="image/png, image/jpeg, image/svg+xml"
                onChange={handleLogoUpload}
                className="h-10 cursor-pointer bg-white dark:bg-zinc-900"
              />
              <p className="text-[11px] text-muted-foreground">Rekomendasi file PNG transparan. Maks 2MB.</p>
            </div>
            {value.logo && (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white p-1 shadow-sm sm:h-20 sm:w-20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={value.logo} alt="Logo" className="max-h-full max-w-full object-contain" />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {hasCover && (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="w-docSubtype" className="text-sm font-semibold">
              Jenis Tulisan / Dokumen
            </Label>
            <Input
              id="w-docSubtype"
              value={value.docSubtype || ""}
              onChange={(e) => update("docSubtype", e.target.value)}
              placeholder="Contoh: SKRIPSI / SEMINAR HASIL / MAKALAH (kosongkan jika tidak ada)"
              className="h-12 text-base sm:h-11 sm:text-sm uppercase"
            />
          </div>
        )}

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="w-title" className="text-sm font-semibold">
            Judul Dokumen
          </Label>
          <Input
            id="w-title"
            value={value.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Contoh: Analisis Efektivitas Metode Pembelajaran..."
            className="h-12 text-base sm:h-11 sm:text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="w-name" className="text-sm font-semibold">
            Nama Lengkap
          </Label>
          <Input
            id="w-name"
            value={value.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Nama Anda"
            className="h-12 text-base sm:h-11 sm:text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="w-nim" className="text-sm font-semibold">
            NIM / NIP / ID
          </Label>
          <Input
            id="w-nim"
            value={value.nim}
            onChange={(e) => update("nim", e.target.value)}
            placeholder="ID identitas"
            className="h-12 text-base sm:h-11 sm:text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="w-inst" className="text-sm font-semibold">
            Nama Institusi / Universitas
          </Label>
          <Input
            id="w-inst"
            value={value.institution}
            onChange={(e) => update("institution", e.target.value)}
            placeholder="Contoh: Institut Ummul Quro Al-Islami Bogor"
            className="h-12 text-base sm:h-11 sm:text-sm uppercase"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="w-fak" className="text-sm font-semibold">
            Fakultas
          </Label>
          <Input
            id="w-fak"
            value={value.faculty}
            onChange={(e) => update("faculty", e.target.value)}
            placeholder="Contoh: Fakultas Tarbiyah dan Ilmu Keguruan"
            className="h-12 text-base sm:h-11 sm:text-sm uppercase"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="w-prodi" className="text-sm font-semibold">
            Program Studi / Prodi
          </Label>
          <Input
            id="w-prodi"
            value={value.prodi || ""}
            onChange={(e) => update("prodi", e.target.value)}
            placeholder="Contoh: Pendidikan Guru Madrasah Ibtidaiyah"
            className="h-12 text-base sm:h-11 sm:text-sm uppercase"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="w-degree" className="text-sm font-semibold">
            Teks Gelar / Syarat Penulisan
          </Label>
          <Input
            id="w-degree"
            value={value.degree_purpose || ""}
            onChange={(e) => update("degree_purpose", e.target.value)}
            placeholder="Contoh: Diajukan Untuk Memenuhi Syarat Memperoleh Gelar Sarjana Pendidikan"
            className="h-12 text-base sm:h-11 sm:text-sm"
          />
        </div>

        {hasCover && (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="w-address" className="text-sm font-semibold">
              Alamat Kampus
            </Label>
            <Input
              id="w-address"
              value={value.address || ""}
              onChange={(e) => update("address", e.target.value)}
              placeholder="Contoh: Jl. Leuwiliang No. 1, Bogor"
              className="h-12 text-base sm:h-11 sm:text-sm"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="w-year" className="text-sm font-semibold">
            Tahun Masehi
          </Label>
          <Input
            id="w-year"
            value={value.year}
            onChange={(e) => update("year", e.target.value)}
            placeholder="2026"
            className="h-12 text-base sm:h-11 sm:text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="w-hijri" className="text-sm font-semibold">
            Tahun Hijriah
          </Label>
          <Input
            id="w-hijri"
            value={value.year_hijri || ""}
            onChange={(e) => update("year_hijri", e.target.value)}
            placeholder="1447 H"
            className="h-12 text-base sm:h-11 sm:text-sm"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="w-dosen" className="text-sm font-semibold">
            Dosen Pembimbing
          </Label>
          <Input
            id="w-dosen"
            value={value.supervisor}
            onChange={(e) => update("supervisor", e.target.value)}
            placeholder="Nama pembimbing"
            className="h-12 text-base sm:h-11 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
}
