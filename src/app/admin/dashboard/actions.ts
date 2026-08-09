"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { uploadEventImage } from "@/lib/storage";
import type { FormState } from "@/lib/types";

function refreshPublicPages() {
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const color = String(formData.get("color") ?? "#3CAA3C");

  if (!name) return;

  await supabaseAdmin.from("categories").insert({ name, color });
  refreshPublicPages();
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabaseAdmin.from("categories").delete().eq("id", id);
  refreshPublicPages();
}

export async function createEvent(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const title = String(formData.get("title") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "");
  const startDate = String(formData.get("start_date") ?? "");

  if (!title || !categoryId || !startDate) {
    return { status: "error", message: "Merci de remplir les champs obligatoires." };
  }

  const description = String(formData.get("description") ?? "").trim() || null;
  const location = String(formData.get("location") ?? "").trim() || null;
  const endDate = String(formData.get("end_date") ?? "").trim() || null;
  const startTime = String(formData.get("start_time") ?? "").trim() || null;

  let imageUrl: string | null = null;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      imageUrl = await uploadEventImage(imageFile);
    } catch (err) {
      return { status: "error", message: (err as Error).message };
    }
  }

  const { error } = await supabaseAdmin.from("events").insert({
    title,
    category_id: categoryId,
    start_date: startDate,
    end_date: endDate,
    start_time: startTime,
    description,
    location,
    image_url: imageUrl,
  });

  if (error) {
    return { status: "error", message: "Erreur lors de l'ajout de l'événement." };
  }

  refreshPublicPages();
  return { status: "success", message: `« ${title} » a été ajouté au planning.` };
}

export async function updateEvent(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "");
  const startDate = String(formData.get("start_date") ?? "");

  if (!id || !title || !categoryId || !startDate) return;

  const description = String(formData.get("description") ?? "").trim() || null;
  const location = String(formData.get("location") ?? "").trim() || null;
  const endDate = String(formData.get("end_date") ?? "").trim() || null;
  const startTime = String(formData.get("start_time") ?? "").trim() || null;

  const update: Record<string, unknown> = {
    title,
    category_id: categoryId,
    start_date: startDate,
    end_date: endDate,
    start_time: startTime,
    description,
    location,
  };

  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      update.image_url = await uploadEventImage(imageFile);
    } catch (err) {
      redirect(`/admin/dashboard/events/${id}/edit?error=${encodeURIComponent((err as Error).message)}`);
    }
  }

  await supabaseAdmin.from("events").update(update).eq("id", id);

  refreshPublicPages();
  redirect("/admin/dashboard");
}

export async function deleteEvent(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabaseAdmin.from("events").delete().eq("id", id);
  refreshPublicPages();
}
