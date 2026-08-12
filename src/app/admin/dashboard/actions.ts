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

export async function updateCategory(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const color = String(formData.get("color") ?? "#3CAA3C");

  if (!id || !name) return;

  await supabaseAdmin.from("categories").update({ name, color }).eq("id", id);

  refreshPublicPages();
  redirect("/admin/dashboard");
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
  const categoryIds = formData.getAll("category_ids").map(String).filter(Boolean);
  const startDate = String(formData.get("start_date") ?? "");

  if (!title || !startDate) {
    return { status: "error", message: "Merci de remplir les champs obligatoires." };
  }

  if (categoryIds.length === 0) {
    return { status: "error", message: "Merci de sélectionner au moins une catégorie." };
  }

  const description = String(formData.get("description") ?? "").trim() || null;
  const location = String(formData.get("location") ?? "").trim() || null;
  const endDate = String(formData.get("end_date") ?? "").trim() || null;
  const startTime = String(formData.get("start_time") ?? "").trim() || null;
  const endTime = String(formData.get("end_time") ?? "").trim() || null;

  let imageUrl: string | null = null;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      imageUrl = await uploadEventImage(imageFile);
    } catch (err) {
      return { status: "error", message: (err as Error).message };
    }
  }

  const { data: inserted, error } = await supabaseAdmin
    .from("events")
    .insert({
      title,
      start_date: startDate,
      end_date: endDate,
      start_time: startTime,
      end_time: endTime,
      description,
      location,
      image_url: imageUrl,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return { status: "error", message: "Erreur lors de l'ajout de l'événement." };
  }

  const { error: linkError } = await supabaseAdmin
    .from("event_categories")
    .insert(categoryIds.map((categoryId) => ({ event_id: inserted.id, category_id: categoryId })));

  if (linkError) {
    return { status: "error", message: "Erreur lors de l'ajout de l'événement." };
  }

  refreshPublicPages();
  return { status: "success", message: `« ${title} » a été ajouté au planning.` };
}

export async function updateEvent(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const categoryIds = formData.getAll("category_ids").map(String).filter(Boolean);
  const startDate = String(formData.get("start_date") ?? "");

  if (!id || !title || categoryIds.length === 0 || !startDate) return;

  const description = String(formData.get("description") ?? "").trim() || null;
  const location = String(formData.get("location") ?? "").trim() || null;
  const endDate = String(formData.get("end_date") ?? "").trim() || null;
  const startTime = String(formData.get("start_time") ?? "").trim() || null;
  const endTime = String(formData.get("end_time") ?? "").trim() || null;

  const update: Record<string, unknown> = {
    title,
    start_date: startDate,
    end_date: endDate,
    start_time: startTime,
    end_time: endTime,
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

  await supabaseAdmin.from("event_categories").delete().eq("event_id", id);
  await supabaseAdmin
    .from("event_categories")
    .insert(categoryIds.map((categoryId) => ({ event_id: id, category_id: categoryId })));

  refreshPublicPages();
  redirect("/admin/dashboard");
}

export async function deleteEvent(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabaseAdmin.from("events").delete().eq("id", id);
  refreshPublicPages();
}
