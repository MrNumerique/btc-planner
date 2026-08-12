"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Category, Event } from "@/lib/types";
import { formatEventDate, formatEventTime } from "@/lib/format";

type Props = {
  event: Event;
  categories: Category[];
  communeName: string;
};

export function EventCard({ event, categories, communeName }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const timeLabel = formatEventTime(event.start_time, event.end_time);
  const dateLabel = `${formatEventDate(event.start_date, event.end_date)}${
    timeLabel ? ` · ${timeLabel}` : ""
  }`;

  return (
    <>
      <button type="button" className="event-card" onClick={() => setIsOpen(true)}>
        {event.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.image_url} alt="" className="event-image" />
        )}
        <span className="event-date">{dateLabel}</span>
        <h3 className="event-title">{event.title}</h3>
        {event.description && <p className="event-desc">{event.description}</p>}
        {categories.length > 0 && (
          <div className="category-badges">
            {categories.map((category) => (
              <span
                key={category.id}
                className="category-badge"
                style={{ "--badge-color": category.color } as React.CSSProperties}
              >
                {category.name}
              </span>
            ))}
          </div>
        )}
      </button>

      {isOpen &&
        createPortal(
          <div className="event-modal-overlay" onClick={() => setIsOpen(false)}>
            <div
              className="event-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`event-modal-title-${event.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="event-modal-close"
                onClick={() => setIsOpen(false)}
                aria-label="Fermer"
              >
                ×
              </button>

              {event.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={event.image_url} alt="" className="event-modal-image" />
              )}

              <p className="event-modal-meta">📍 {communeName}</p>
              <h2 id={`event-modal-title-${event.id}`}>{event.title}</h2>
              <p className="event-modal-date">{dateLabel}</p>
              {event.description && <p className="event-modal-desc">{event.description}</p>}
              {categories.length > 0 && (
                <div className="category-badges">
                  {categories.map((category) => (
                    <span
                      key={category.id}
                      className="category-badge"
                      style={{ "--badge-color": category.color } as React.CSSProperties}
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
