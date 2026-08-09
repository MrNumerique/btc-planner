import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { updateEvent } from "../../../actions";
import type { Category, Event } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [{ data: event }, { data: categories }] = await Promise.all([
    supabaseAdmin.from("events").select("*").eq("id", id).single<Event>(),
    supabaseAdmin.from("categories").select("*").order("name").returns<Category[]>(),
  ]);

  if (!event) {
    notFound();
  }

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <h1 style={{ marginBottom: 0 }}>Modifier l&apos;événement</h1>
        <Link href="/admin/dashboard">← Retour</Link>
      </div>

      <div className="admin-card">
        <form action={updateEvent}>
          <input type="hidden" name="id" value={event.id} />

          <div className="form-field">
            <label htmlFor="ev-title">Titre</label>
            <input type="text" id="ev-title" name="title" defaultValue={event.title} required />
          </div>

          <div className="form-field">
            <label htmlFor="ev-category">Catégorie</label>
            <select id="ev-category" name="category_id" defaultValue={event.category_id} required>
              {(categories ?? []).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="ev-start">Date de début</label>
              <input
                type="date"
                id="ev-start"
                name="start_date"
                defaultValue={event.start_date}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="ev-end">Date de fin (optionnel)</label>
              <input type="date" id="ev-end" name="end_date" defaultValue={event.end_date ?? ""} />
            </div>
            <div className="form-field">
              <label htmlFor="ev-time">Heure (optionnel)</label>
              <input
                type="time"
                id="ev-time"
                name="start_time"
                defaultValue={event.start_time?.slice(0, 5) ?? ""}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="ev-location">Lieu</label>
            <input type="text" id="ev-location" name="location" defaultValue={event.location ?? ""} />
          </div>

          <div className="form-field">
            <label htmlFor="ev-desc">Description</label>
            <textarea id="ev-desc" name="description" rows={3} defaultValue={event.description ?? ""} />
          </div>

          <div className="form-field">
            <label htmlFor="ev-image">URL de l&apos;image (optionnel)</label>
            <input type="url" id="ev-image" name="image_url" defaultValue={event.image_url ?? ""} />
          </div>

          <button type="submit" className="btn btn-primary">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}
