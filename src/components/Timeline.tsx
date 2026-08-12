import type { Category, Event } from "@/lib/types";
import { EventCard } from "@/components/EventCard";

type Props = {
  categories: Category[];
  events: Event[];
};

export function Timeline({ categories, events }: Props) {
  const lanes = categories
    .map((category) => ({
      category,
      events: events
        .filter((event) => event.category_ids.includes(category.id))
        .sort((a, b) => a.start_date.localeCompare(b.start_date)),
    }))
    .filter((lane) => lane.events.length > 0);

  if (lanes.length === 0) {
    return <p className="lane-empty">Aucune action pour le moment.</p>;
  }

  return (
    <div className="timeline">
      {lanes.map(({ category, events: categoryEvents }) => (
        <section
          key={category.id}
          className="lane"
          style={{ "--lane-color": category.color } as React.CSSProperties}
        >
          <div className="lane-header">
            <span className="lane-title">{category.name}</span>
            <span className="lane-count">{categoryEvents.length}</span>
          </div>

          <div className="lane-track">
            {categoryEvents.map((event) => (
              <EventCard key={event.id} event={event} categoryName={category.name} color={category.color} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
