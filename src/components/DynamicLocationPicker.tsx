"use client";

import dynamic from "next/dynamic";

export const DynamicLocationPicker = dynamic(() => import("@/components/LocationPicker"), {
  ssr: false,
  loading: () => <p className="lane-empty">Chargement de la carte…</p>,
});
