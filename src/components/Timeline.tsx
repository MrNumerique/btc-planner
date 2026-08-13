"use client";

import { useEffect, useState } from "react";
import type { Category, Commune, Event } from "@/lib/types";
import { EventCard } from "@/components/EventCard";
import { resolveCategories } from "@/lib/events";
import { buildNeighborMap } from "@/lib/communes";

type Props = {
  categories: Category[];
  communes: Commune[];
  events: Event[];
  neighborPairs: { commune_id: string; neighbor_id: string }[];
};

const UNASSIGNED_LANE = "__sans-commune__";
const STORAGE_KEY = "btc-planner:selected-commune";

export function Timeline({ categories, communes, events, neighborPairs }: Props) {
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const communeIds = new Set(communes.map((c) => c.id));
  const communeById = new Map(communes.map((c) => [c.id, c]));
  const communeByName = new Map(communes.map((c) => [c.name.toLowerCase(), c]));
  const neighborMap = buildNeighborMap(neighborPairs);

  const [selectedCommuneId, setSelectedCommuneId] = useState<string | null>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && communeById.has(stored)) {
      setSelectedCommuneId(stored);
      setText(communeById.get(stored)?.name ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectCommune = (id: string | null) => {
    setSelectedCommuneId(id);
    if (id) {
      window.localStorage.setItem(STORAGE_KEY, id);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const eventsByLaneKey = new Map<string, Event[]>();
  for (const event of events) {
    const key = event.commune_id && communeIds.has(event.commune_id) ? event.commune_id : UNASSIGNED_LANE;
    const list = eventsByLaneKey.get(key) ?? [];
    list.push(event);
    eventsByLaneKey.set(key, list);
  }

  const sortByDate = (a: Event, b: Event) => a.start_date.localeCompare(b.start_date);
  const neighborIds = selectedCommuneId ? neighborMap.get(selectedCommuneId) ?? new Set<string>() : new Set<string>();

  const rank = (communeId: string) => {
    if (communeId === selectedCommuneId) return 0;
    if (neighborIds.has(communeId)) return 1;
    return 2;
  };

  const orderedCommunes = [...communes].sort((a, b) => {
    const diff = rank(a.id) - rank(b.id);
    return diff !== 0 ? diff : a.name.localeCompare(b.name);
  });

  const lanes = [
    ...orderedCommunes.map((commune) => ({
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

  return (
    <>
      <div className="commune-picker">
        <input
          type="text"
          list="public-commune-options"
          value={text}
          onChange={(e) => {
            const value = e.target.value;
            setText(value);
            const match = communeByName.get(value.trim().toLowerCase());
            if (match) selectCommune(match.id);
          }}
          placeholder="Afficher ma commune en premier…"
          autoComplete="off"
        />
        <datalist id="public-commune-options">
          {communes.map((commune) => (
            <option key={commune.id} value={commune.name} />
          ))}
        </datalist>
        {selectedCommuneId && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              selectCommune(null);
              setText("");
            }}
          >
            Réinitialiser
          </button>
        )}
      </div>

      {lanes.length === 0 ? (
        <p className="lane-empty">Aucune action pour le moment.</p>
      ) : (
        <div className="timeline">
          {lanes.map(({ key, title, events: laneEvents }) => (
            <section key={key} className={`lane${key === selectedCommuneId ? " lane-selected" : ""}`}>
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
      )}
    </>
  );
}
