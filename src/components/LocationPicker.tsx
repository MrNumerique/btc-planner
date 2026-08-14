"use client";

import "leaflet/dist/leaflet.css";
import "@/components/leaflet-icons";
import { useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

const DEFAULT_CENTER: [number, number] = [49.849, 3.287];

type Props = {
  defaultLatitude?: number | null;
  defaultLongitude?: number | null;
};

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({ defaultLatitude, defaultLongitude }: Props) {
  const [position, setPosition] = useState<[number, number] | null>(
    defaultLatitude != null && defaultLongitude != null ? [defaultLatitude, defaultLongitude] : null,
  );
  const [locating, setLocating] = useState(false);
  const mapRef = useRef<LeafletMap | null>(null);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas disponible sur cet appareil.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (geolocationPosition) => {
        const coords: [number, number] = [
          geolocationPosition.coords.latitude,
          geolocationPosition.coords.longitude,
        ];
        mapRef.current?.flyTo(coords, 16);
        setLocating(false);
      },
      () => {
        alert("Impossible de récupérer votre position. Vérifiez les autorisations de localisation.");
        setLocating(false);
      },
    );
  };

  return (
    <div>
      <MapContainer
        ref={mapRef}
        center={position ?? DEFAULT_CENTER}
        zoom={position ? 15 : 12}
        scrollWheelZoom
        className="geocache-map geocache-map-picker"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={(lat, lng) => setPosition([lat, lng])} />
        {position && <Marker position={position} />}
        <button
          type="button"
          className="geocache-locate-btn"
          onClick={handleLocate}
          disabled={locating}
        >
          {locating ? "Localisation…" : "📍 Ma position"}
        </button>
      </MapContainer>
      <span className="admin-list-item-meta">
        {position
          ? `Position choisie : ${position[0].toFixed(5)}, ${position[1].toFixed(5)}`
          : "Cliquez sur la carte pour placer le cache."}
      </span>
      <input type="hidden" name="latitude" value={position?.[0] ?? ""} />
      <input type="hidden" name="longitude" value={position?.[1] ?? ""} />
    </div>
  );
}
