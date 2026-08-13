"use client";

import dynamic from "next/dynamic";

export const DynamicGeocacheMap = dynamic(() => import("@/components/GeocacheMap"), {
  ssr: false,
  loading: () => <p className="lane-empty">Chargement de la carte…</p>,
});
