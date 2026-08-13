"use client";

import "leaflet/dist/leaflet.css";
import "@/components/leaflet-icons";
import { useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { MapContainer, TileLayer, Marker, CircleMarker } from "react-leaflet";
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
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const mapRef = useRef<LeafletMap | null>(null);
  const selected = geocaches.find((cache) => cache.id === selectedId) ?? null;

  const center: [number, number] =
    geocaches.length > 0
      ? [
          geocaches.reduce((sum, g) => sum + g.latitude, 0) / geocaches.length,
          geocaches.reduce((sum, g) => sum + g.longitude, 0) / geocaches.length,
        ]
      : DEFAULT_CENTER;

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas disponible sur cet appareil.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserPosition(coords);
        mapRef.current?.flyTo(coords, 15);
        setLocating(false);
      },
      () => {
        alert("Impossible de récupérer votre position. Vérifiez les autorisations de localisation.");
        setLocating(false);
      },
    );
  };

  return (
    <>
      <MapContainer ref={mapRef} center={center} zoom={12} scrollWheelZoom className="geocache-map">
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
        {userPosition && (
          <CircleMarker
            center={userPosition}
            radius={8}
            pathOptions={{ color: "#3A7EC6", fillColor: "#3A7EC6", fillOpacity: 0.9 }}
          />
        )}
        <button
          type="button"
          className="geocache-locate-btn"
          onClick={handleLocate}
          disabled={locating}
        >
          {locating ? "Localisation…" : "📍 Ma position"}
        </button>
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
