import type { Category, Commune, Event } from "@/lib/types";
import { EventCard } from "@/components/EventCard";

type Props = {
  categories: Category[];
  communes: Commune[];
  events: Event[];
};

export function Timeline({ categories, communes, events }: Props) {
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  const lanes = communes
    .map((commune) => ({
      commune,
      events: events
        .filter((event) => event.commune_id === commune.id)
        .sort((a, b) => a.start_date.localeCompare(b.start_date)),
    }))
    .filter((lane) => lane.events.length > 0);

  if (lanes.length === 0) {
    return <p className="lane-empty">Aucune action pour le moment.</p>;
  }

  return (
    <div className="timeline">
      {lanes.map(({ commune, events: communeEvents }) => (
        <section key={commune.id} className="lane">
          <div className="lane-header">
            <span className="lane-title">{commune.name}</span>
            <span className="lane-count">{communeEvents.length}</span>
          </div>

          <div className="lane-track">
            {communeEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                categories={event.category_ids
                  .map((id) => categoryById.get(id))
                  .filter((c): c is Category => c !== undefined)}
                communeName={commune.name}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
