import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { deleteGeocache } from "./actions";
import { AddGeocacheForm } from "./AddGeocacheForm";
import { EditLink } from "@/components/EditLink";
import type { Geocache } from "@/lib/types";

export const dynamic = "force-dynamic";

const DIFFICULTY_LABELS: Record<Geocache["difficulty"], string> = {
  easy: "Facile",
  medium: "Moyen",
  hard: "Difficile",
};

async function getGeocaches(): Promise<Geocache[]> {
  const { data } = await supabaseAdmin.from("geocaches").select("*").order("created_at");
  return data ?? [];
}

export default async function GeocachingAdminPage() {
  const geocaches = await getGeocaches();

  return (
    <div className="admin-shell" style={{ maxWidth: 900 }}>
      <div className="admin-topbar">
        <h1 style={{ marginBottom: 0 }}>Chasse aux trésors</h1>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/admin/dashboard">← Retour au back office</Link>
          <Link href="/geocaching" target="_blank">
            Voir la carte publique →
          </Link>
        </div>
      </div>

      <div className="admin-card">
        <h1>Caches</h1>

        <div className="admin-list">
          {geocaches.length === 0 && <p className="lane-empty">Aucun cache.</p>}
          {geocaches.map((cache) => (
            <div key={cache.id} className="admin-list-item">
              <div className="admin-list-item-info">
                <span className="admin-list-item-title">{cache.name}</span>
                <span className="admin-list-item-meta">
                  {DIFFICULTY_LABELS[cache.difficulty]} · {cache.latitude.toFixed(5)},{" "}
                  {cache.longitude.toFixed(5)}
                </span>
              </div>
              <div className="admin-list-item-actions">
                <EditLink href={`/admin/dashboard/geocaching/${cache.id}/edit`} />
                <form action={deleteGeocache}>
                  <input type="hidden" name="id" value={cache.id} />
                  <button type="submit" className="btn btn-danger">
                    Supprimer
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        <h2>Ajouter un cache</h2>
        <AddGeocacheForm />
      </div>
    </div>
  );
}
