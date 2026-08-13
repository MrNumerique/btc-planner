import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

const MAX_SIZE = 5 * 1024 * 1024;

async function uploadImage(bucket: string, file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Le fichier doit être une image.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("L'image ne doit pas dépasser 5 Mo.");
  }

  const extension = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabaseAdmin.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(`Échec de l'upload de l'image : ${error.message}`);
  }

  return supabaseAdmin.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

async function deleteImage(bucket: string, url: string): Promise<void> {
  const marker = `/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return;

  const path = url.slice(index + marker.length);
  await supabaseAdmin.storage.from(bucket).remove([path]);
}

export function uploadEventImage(file: File): Promise<string> {
  return uploadImage("event-images", file);
}

export function deleteEventImage(url: string): Promise<void> {
  return deleteImage("event-images", url);
}

export function uploadGeocacheImage(file: File): Promise<string> {
  return uploadImage("geocache-images", file);
}

export function deleteGeocacheImage(url: string): Promise<void> {
  return deleteImage("geocache-images", url);
}
