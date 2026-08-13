import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Timeline } from "@/components/Timeline";
import type { Category, Commune, Event } from "@/lib/types";
import { groupCategoryIdsByEvent } from "@/lib/events";

export const revalidate = 60;

type PageData = {
  categories: Category[];
  communes: Commune[];
  events: Event[];
  neighborPairs: { commune_id: string; neighbor_id: string }[];
};

async function getData(): Promise<PageData | null> {
  try {
    const [
      { data: categories, error: catError },
      { data: communes, error: comError },
      { data: events, error: evError },
      { data: eventCategories, error: ecError },
      { data: neighborPairs, error: neError },
    ] = await Promise.all([
      supabase.from("categories").select("*").order("name"),
      supabase.from("communes").select("*").order("name"),
      supabase.from("events").select("*").order("start_date"),
      supabase.from("event_categories").select("event_id, category_id"),
      supabase.from("commune_neighbors").select("commune_id, neighbor_id"),
    ]);

    if (catError || comError || evError || ecError || neError) {
      console.error(catError ?? comError ?? evError ?? ecError ?? neError);
      return null;
    }

    const categoryIdsByEvent = groupCategoryIdsByEvent(eventCategories ?? []);

    const eventsWithCategories = (events ?? []).map((event) => ({
      ...event,
      category_ids: categoryIdsByEvent.get(event.id) ?? [],
    }));

    return {
      categories: categories ?? [],
      communes: communes ?? [],
      events: eventsWithCategories,
      neighborPairs: neighborPairs ?? [],
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default async function Home() {
  const data = await getData();

  return (
    <>
      <header className="site-header">
        <div className="header-logo">
          <Image
            src="/logo-btc.jpg"
            alt="Bouge ta Campagne !"
            width={1343}
            height={544}
            className="header-logo-img"
            priority
          />
        </div>
        <h1>
          Le planning de <span>nos actions</span>
        </h1>
        <p>Retrouvez ici toutes les actions du projet, classées par commune.</p>
      </header>

      <svg
        className="wave"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#ffffff"
          d="M0,32 C240,64 480,0 720,16 C960,32 1200,64 1440,32 L1440,0 L0,0 Z"
        />
      </svg>

      <main>
        {data === null ? (
          <p className="lane-empty">
            Le planning n&apos;est pas encore disponible. Vérifiez la configuration de la base de
            données.
          </p>
        ) : (
          <Timeline
            categories={data.categories}
            communes={data.communes}
            events={data.events}
            neighborPairs={data.neighborPairs}
          />
        )}
      </main>

      <footer className="site-footer">
        <Image
          src="/partenaires-btc.jpg"
          alt="Nos partenaires : Gouvernement, Itinéraire Emploi, Agglo du Saint-Quentinois, Communauté de Communes du Pays du Vermandois, Val d'Oise, P.L.I.E de l'Agglo du Saint-Quentinois, Plan Local pour l'Insertion et l'Emploi, Mission Locale du Saint-Quentinois, Union européenne"
          width={1235}
          height={103}
          sizes="100vw"
          className="partners-strip"
        />
        <p>
          Planning propulsé par <strong>Bouge ta Campagne !</strong>
        </p>
      </footer>
    </>
  );
}
