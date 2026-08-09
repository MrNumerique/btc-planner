import type { Category, Event } from "@/lib/types";
import { formatEventDate } from "@/lib/format";

type Props = {
  categories: Category[];
  events: Event[];
};

export function Timeline({ categories, events }: Props) {
  const lanes = categories
    .map((category) => ({
      category,
      events: events
        .filter((event) => event.category_id === category.id)
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
              <article key={event.id} className="event-card">
                {event.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={event.image_url} alt="" className="event-image" />
                )}
                <span className="event-date">
                  {formatEventDate(event.start_date, event.end_date)}
                  {event.start_time ? ` · ${event.start_time.slice(0, 5)}` : ""}
                </span>
                <h3 className="event-title">{event.title}</h3>
                {event.description && <p className="event-desc">{event.description}</p>}
                {event.location && <p className="event-meta">📍 {event.location}</p>}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
