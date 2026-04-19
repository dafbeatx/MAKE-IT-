"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IdentityData {
  title: string;
  name: string;
  nim: string;
  institution: string;
  faculty: string;
  supervisor: string;
  year: string;
}

interface Props {
  value: IdentityData;
  onChange: (v: IdentityData) => void;
}

export default function Step3Identitas({ value, onChange }: Props) {
  const update = (key: keyof IdentityData, val: string) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">Data Identitas</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Informasi ini otomatis mengisi halaman sampul dan lembar pengesahan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            Institusi / Universitas
          </Label>
          <Input
            id="w-inst"
            value={value.institution}
            onChange={(e) => update("institution", e.target.value)}
            placeholder="Contoh: Universitas Indonesia"
            className="h-12 text-base sm:h-11 sm:text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="w-fak" className="text-sm font-semibold">
            Fakultas / Program Studi
          </Label>
          <Input
            id="w-fak"
            value={value.faculty}
            onChange={(e) => update("faculty", e.target.value)}
            placeholder="Contoh: Teknik Informatika"
            className="h-12 text-base sm:h-11 sm:text-sm"
          />
        </div>

        <div className="space-y-2">
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

        <div className="space-y-2">
          <Label htmlFor="w-year" className="text-sm font-semibold">
            Tahun
          </Label>
          <Input
            id="w-year"
            value={value.year}
            onChange={(e) => update("year", e.target.value)}
            placeholder="2024"
            className="h-12 text-base sm:h-11 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
}
