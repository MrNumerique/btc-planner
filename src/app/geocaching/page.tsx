import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { DynamicGeocacheMap } from "@/components/DynamicGeocacheMap";
import type { Geocache } from "@/lib/types";

export const revalidate = 60;

async function getGeocaches(): Promise<Geocache[] | null> {
  const { data, error } = await supabase.from("geocaches").select("*").order("created_at");
  if (error) {
    console.error(error);
    return null;
  }
  return data ?? [];
}

export default async function GeocachingPage() {
  const geocaches = await getGeocaches();

  return (
    <>
      <header className="site-header">
        <h1>
          Chasse aux <span>trésors</span>
        </h1>
        <p>Retrouvez tous les caches à découvrir sur la carte.</p>
      </header>

      <main>
        <p style={{ textAlign: "center", marginBottom: 20 }}>
          <Link href="/">← Retour au planning</Link>
        </p>

        {geocaches === null ? (
          <p className="lane-empty">
            La carte n&apos;est pas encore disponible. Vérifiez la configuration de la base de données.
          </p>
        ) : geocaches.length === 0 ? (
          <p className="lane-empty">Aucun cache pour le moment.</p>
        ) : (
          <DynamicGeocacheMap geocaches={geocaches} />
        )}
      </main>
    </>
  );
}
