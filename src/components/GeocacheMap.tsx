"use client";

import "leaflet/dist/leaflet.css";
import "@/components/leaflet-icons";
import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import type { Geocache } from "@/lib/types";

const DEFAULT_CENTER: [number, number] = [49.849, 3.287];

const DIFFICULTY_LABELS: Record<Geocache["difficulty"], string> = {
  easy: "Facile",
  medium: "Moyen",
  hard: "Difficile",
};

type Props = {
  geocaches: Geocache[];
};

export default function GeocacheMap({ geocaches }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = geocaches.find((cache) => cache.id === selectedId) ?? null;

  const center: [number, number] =
    geocaches.length > 0
      ? [
          geocaches.reduce((sum, g) => sum + g.latitude, 0) / geocaches.length,
          geocaches.reduce((sum, g) => sum + g.longitude, 0) / geocaches.length,
        ]
      : DEFAULT_CENTER;

  return (
    <>
      <MapContainer center={center} zoom={12} scrollWheelZoom className="geocache-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geocaches.map((cache) => (
          <Marker
            key={cache.id}
            position={[cache.latitude, cache.longitude]}
            eventHandlers={{ click: () => setSelectedId(cache.id) }}
          />
        ))}
      </MapContainer>

      {selected && (
        <div className="geocache-detail">
          <button
            type="button"
            className="geocache-detail-close"
            onClick={() => setSelectedId(null)}
            aria-label="Fermer"
          >
            ×
          </button>

          {selected.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selected.image_url} alt="" className="geocache-detail-image" />
          )}

          <span className="geocache-popup-difficulty">{DIFFICULTY_LABELS[selected.difficulty]}</span>
          <h2>{selected.name}</h2>
          {selected.description && <p className="geocache-detail-desc">{selected.description}</p>}
        </div>
      )}
    </>
  );
}
