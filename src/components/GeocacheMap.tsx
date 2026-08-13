"use client";

import "leaflet/dist/leaflet.css";
import "@/components/leaflet-icons";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
  const center: [number, number] =
    geocaches.length > 0
      ? [
          geocaches.reduce((sum, g) => sum + g.latitude, 0) / geocaches.length,
          geocaches.reduce((sum, g) => sum + g.longitude, 0) / geocaches.length,
        ]
      : DEFAULT_CENTER;

  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom className="geocache-map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geocaches.map((cache) => (
        <Marker key={cache.id} position={[cache.latitude, cache.longitude]}>
          <Popup>
            {cache.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cache.image_url} alt="" className="geocache-popup-image" />
            )}
            <strong>{cache.name}</strong>
            <div className="geocache-popup-difficulty">{DIFFICULTY_LABELS[cache.difficulty]}</div>
            {cache.description && <p>{cache.description}</p>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
