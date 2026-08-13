"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { uploadGeocacheImage, deleteGeocacheImage } from "@/lib/storage";
import type { Difficulty, FormState } from "@/lib/types";

function refreshPublicPages() {
  revalidatePath("/geocaching");
  revalidatePath("/admin/dashboard/geocaching");
}

function parseDifficulty(value: FormDataEntryValue | null): Difficulty {
  const str = String(value ?? "");
  return str === "easy" || str === "hard" ? str : "medium";
}

export async function createGeocache(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const latitude = Number(formData.get("latitude"));
  const longitude = Number(formData.get("longitude"));

  if (!name || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return {
      status: "error",
      message: "Merci de remplir le nom et de choisir un emplacement sur la carte.",
    };
  }

  const description = String(formData.get("description") ?? "").trim() || null;
  const difficulty = parseDifficulty(formData.get("difficulty"));

  let imageUrl: string | null = null;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      imageUrl = await uploadGeocacheImage(imageFile);
    } catch (err) {
      return { status: "error", message: (err as Error).message };
    }
  }

  const { error } = await supabaseAdmin.from("geocaches").insert({
    name,
    description,
    difficulty,
    latitude,
    longitude,
    image_url: imageUrl,
  });

  if (error) {
    return { status: "error", message: "Erreur lors de l'ajout du cache." };
  }

  refreshPublicPages();
  return { status: "success", message: `« ${name} » a été ajouté à la carte.` };
}

export async function updateGeocache(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const latitude = Number(formData.get("latitude"));
  const longitude = Number(formData.get("longitude"));

  if (!id) return;

  if (!name || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    redirect(
      `/admin/dashboard/geocaching/${id}/edit?error=${encodeURIComponent(
        "Merci de remplir le nom et de choisir un emplacement sur la carte.",
      )}`,
    );
  }

  const description = String(formData.get("description") ?? "").trim() || null;
  const difficulty = parseDifficulty(formData.get("difficulty"));

  const update: Record<string, unknown> = {
    name,
    description,
    difficulty,
    latitude,
    longitude,
  };

  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      update.image_url = await uploadGeocacheImage(imageFile);
    } catch (err) {
      redirect(
        `/admin/dashboard/geocaching/${id}/edit?error=${encodeURIComponent((err as Error).message)}`,
      );
    }

    const { data: current } = await supabaseAdmin
      .from("geocaches")
      .select("image_url")
      .eq("id", id)
      .single();
    if (current?.image_url) {
      await deleteGeocacheImage(current.image_url);
    }
  }

  const { error } = await supabaseAdmin.from("geocaches").update(update).eq("id", id);
  if (error) {
    redirect(
      `/admin/dashboard/geocaching/${id}/edit?error=${encodeURIComponent(
        "Erreur lors de la mise à jour du cache.",
      )}`,
    );
  }

  refreshPublicPages();
  redirect("/admin/dashboard/geocaching");
}

export async function deleteGeocache(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { data: current } = await supabaseAdmin
    .from("geocaches")
    .select("image_url")
    .eq("id", id)
    .single();

  await supabaseAdmin.from("geocaches").delete().eq("id", id);

  if (current?.image_url) {
    await deleteGeocacheImage(current.image_url);
  }

  refreshPublicPages();
}
