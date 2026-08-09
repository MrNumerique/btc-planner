"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";

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

export async function createEvent(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "");
  const startDate = String(formData.get("start_date") ?? "");

  if (!title || !categoryId || !startDate) return;

  const description = String(formData.get("description") ?? "").trim() || null;
  const location = String(formData.get("location") ?? "").trim() || null;
  const imageUrl = String(formData.get("image_url") ?? "").trim() || null;
  const endDate = String(formData.get("end_date") ?? "").trim() || null;
  const startTime = String(formData.get("start_time") ?? "").trim() || null;

  await supabaseAdmin.from("events").insert({
    title,
    category_id: categoryId,
    start_date: startDate,
    end_date: endDate,
    start_time: startTime,
    description,
    location,
    image_url: imageUrl,
  });

  refreshPublicPages();
}

export async function updateEvent(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "");
  const startDate = String(formData.get("start_date") ?? "");

  if (!id || !title || !categoryId || !startDate) return;

  const description = String(formData.get("description") ?? "").trim() || null;
  const location = String(formData.get("location") ?? "").trim() || null;
  const imageUrl = String(formData.get("image_url") ?? "").trim() || null;
  const endDate = String(formData.get("end_date") ?? "").trim() || null;
  const startTime = String(formData.get("start_time") ?? "").trim() || null;

  await supabaseAdmin
    .from("events")
    .update({
      title,
      category_id: categoryId,
      start_date: startDate,
      end_date: endDate,
      start_time: startTime,
      description,
      location,
      image_url: imageUrl,
    })
    .eq("id", id);

  refreshPublicPages();
  redirect("/admin/dashboard");
}

export async function deleteEvent(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabaseAdmin.from("events").delete().eq("id", id);
  refreshPublicPages();
}
