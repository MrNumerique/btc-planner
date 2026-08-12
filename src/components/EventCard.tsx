"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Event } from "@/lib/types";
import { formatEventDate, formatEventTime } from "@/lib/format";

type Props = {
  event: Event;
  categoryName: string;
  color: string;
};

export function EventCard({ event, categoryName, color }: Props) {
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
        {event.location && <p className="event-meta">📍 {event.location}</p>}
      </button>

      {isOpen &&
        createPortal(
          <div className="event-modal-overlay" onClick={() => setIsOpen(false)}>
            <div
              className="event-modal"
              style={{ "--modal-color": color } as React.CSSProperties}
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

              <span className="event-modal-category">{categoryName}</span>
              <h2 id={`event-modal-title-${event.id}`}>{event.title}</h2>
              <p className="event-modal-date">{dateLabel}</p>
              {event.description && <p className="event-modal-desc">{event.description}</p>}
              {event.location && <p className="event-modal-meta">📍 {event.location}</p>}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
