import { z } from "zod";

export const identitySchema = z.object({
  title: z.string().min(3, "Judul tidak boleh kosong atau terlalu pendek"),
  name: z.string().min(2, "Nama tidak valid"),
  nim: z.string().min(3, "NIM/ID tidak valid"),
  institution: z.string().min(2, "Institusi tidak boleh kosong"),
  faculty: z.string().min(2, "Fakultas tidak boleh kosong"),
  year: z.string().min(4, "Tahun tidak valid").max(4, "Tahun harus 4 digit"),
});

export const chapterSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string().min(4, "Nama Bab terlalu pendek"),
  })
).min(1, "Minimal harus ada 1 bab");

export const wizardValidation = {
  validateStep2: (chapters: any[]) => {
    return chapterSchema.safeParse(chapters);
  },
  validateStep3: (identity: any) => {
    return identitySchema.safeParse(identity);
  }
};
