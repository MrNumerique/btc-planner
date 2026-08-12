import type { Category, Commune, Event } from "@/lib/types";
import { EventCard } from "@/components/EventCard";
import { resolveCategories } from "@/lib/events";

type Props = {
  categories: Category[];
  communes: Commune[];
  events: Event[];
};

const UNASSIGNED_LANE = "__sans-commune__";

export function Timeline({ categories, communes, events }: Props) {
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const communeIds = new Set(communes.map((c) => c.id));

  const eventsByLaneKey = new Map<string, Event[]>();
  for (const event of events) {
    const key = event.commune_id && communeIds.has(event.commune_id) ? event.commune_id : UNASSIGNED_LANE;
    const list = eventsByLaneKey.get(key) ?? [];
    list.push(event);
    eventsByLaneKey.set(key, list);
  }

  const sortByDate = (a: Event, b: Event) => a.start_date.localeCompare(b.start_date);

  const lanes = [
    ...communes.map((commune) => ({
      key: commune.id,
      title: commune.name,
      events: (eventsByLaneKey.get(commune.id) ?? []).sort(sortByDate),
    })),
    {
      key: UNASSIGNED_LANE,
      title: "Sans commune",
      events: (eventsByLaneKey.get(UNASSIGNED_LANE) ?? []).sort(sortByDate),
    },
  ].filter((lane) => lane.events.length > 0);

  if (lanes.length === 0) {
    return <p className="lane-empty">Aucune action pour le moment.</p>;
  }

  return (
    <div className="timeline">
      {lanes.map(({ key, title, events: laneEvents }) => (
        <section key={key} className="lane">
          <div className="lane-header">
            <span className="lane-title">{title}</span>
            <span className="lane-count">{laneEvents.length}</span>
          </div>

          <div className="lane-track">
            {laneEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                categories={resolveCategories(event.category_ids, categoryById)}
                communeName={title}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
