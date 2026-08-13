import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

const BUCKET = "event-images";
const MAX_SIZE = 5 * 1024 * 1024;

export async function uploadEventImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Le fichier doit être une image.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("L'image ne doit pas dépasser 5 Mo.");
  }

  const extension = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(`Échec de l'upload de l'image : ${error.message}`);
  }

  return supabaseAdmin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function deleteEventImage(url: string): Promise<void> {
  const marker = `/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return;

  const path = url.slice(index + marker.length);
  await supabaseAdmin.storage.from(BUCKET).remove([path]);
}
