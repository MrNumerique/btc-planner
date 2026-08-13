import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { updateGeocache } from "../../actions";
import type { Geocache } from "@/lib/types";
import { DynamicLocationPicker } from "@/components/DynamicLocationPicker";

export const dynamic = "force-dynamic";

export default async function EditGeocachePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const { data: cache } = await supabaseAdmin
    .from("geocaches")
    .select("*")
    .eq("id", id)
    .single<Geocache>();

  if (!cache) {
    notFound();
  }

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <h1 style={{ marginBottom: 0 }}>Modifier le cache</h1>
        <Link href="/admin/dashboard/geocaching">← Retour</Link>
      </div>

      <div className="admin-card">
        {error && <p className="error-message">{error}</p>}
        <form action={updateGeocache}>
          <input type="hidden" name="id" value={cache.id} />

          <div className="form-field">
            <label htmlFor="gc-name">Nom</label>
            <input type="text" id="gc-name" name="name" defaultValue={cache.name} required />
          </div>

          <div className="form-field">
            <label htmlFor="gc-difficulty">Difficulté</label>
            <select id="gc-difficulty" name="difficulty" defaultValue={cache.difficulty}>
              <option value="easy">Facile</option>
              <option value="medium">Moyen</option>
              <option value="hard">Difficile</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="gc-desc">Description / indice</label>
            <textarea id="gc-desc" name="description" rows={3} defaultValue={cache.description ?? ""} />
          </div>

          <div className="form-field">
            <label htmlFor="gc-image">Image (optionnel)</label>
            {cache.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cache.image_url} alt="" className="event-image" style={{ maxWidth: 200 }} />
            )}
            <input type="file" id="gc-image" name="image" accept="image/*" />
            <span className="admin-list-item-meta">
              Laisser vide pour conserver l&apos;image actuelle.
            </span>
          </div>

          <div className="form-field">
            <label>Emplacement</label>
            <DynamicLocationPicker defaultLatitude={cache.latitude} defaultLongitude={cache.longitude} />
          </div>

          <button type="submit" className="btn btn-primary">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}
