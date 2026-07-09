"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/auth";

export type ActionState = { error?: string } | null;

const materialSchema = z
  .object({
    title: z.string().trim().min(1, "Bitte einen Titel angeben."),
    description: z.string().trim().max(2000).optional(),
    category: z.string().trim().max(100).optional(),
    url: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || z.url().safeParse(v).success, {
        message: "Bitte eine gültige URL angeben (https://...).",
      }),
    content: z.string().trim().max(20000).optional(),
  })
  .refine((data) => data.url || data.content, {
    message: "Bitte entweder einen Link oder einen Text hinterlegen.",
  });

export async function createMaterialAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const staff = await requireStaff();

  const parsed = materialSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    category: formData.get("category") || undefined,
    url: formData.get("url") || undefined,
    content: formData.get("content") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  await prisma.material.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      category: parsed.data.category || null,
      url: parsed.data.url || null,
      content: parsed.data.content || null,
      uploadedById: staff.id,
    },
  });

  revalidatePath("/team/material");
  revalidatePath("/programm/material");
  return null;
}

export async function deleteMaterialAction(materialId: string) {
  await requireStaff();
  await prisma.material.delete({ where: { id: materialId } });
  revalidatePath("/team/material");
  revalidatePath("/programm/material");
}
