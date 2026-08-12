"use client";

import { useState } from "react";
import type { Commune } from "@/lib/types";

type Props = {
  communes: Commune[];
  defaultCommuneId?: string | null;
};

export function CommuneSelect({ communes, defaultCommuneId }: Props) {
  const byId = new Map(communes.map((c) => [c.id, c]));
  const byName = new Map(communes.map((c) => [c.name.toLowerCase(), c]));
  const defaultCommune = defaultCommuneId ? byId.get(defaultCommuneId) : undefined;

  const [text, setText] = useState(defaultCommune?.name ?? "");
  const [communeId, setCommuneId] = useState(defaultCommune?.id ?? "");

  return (
    <>
      <input
        type="text"
        id="ev-commune"
        list="commune-options"
        value={text}
        onChange={(e) => {
          const value = e.target.value;
          setText(value);
          setCommuneId(byName.get(value.trim().toLowerCase())?.id ?? "");
        }}
        autoComplete="off"
        placeholder="Rechercher une commune…"
        required
      />
      <datalist id="commune-options">
        {communes.map((commune) => (
          <option key={commune.id} value={commune.name} />
        ))}
      </datalist>
      <input type="hidden" name="commune_id" value={communeId} />
    </>
  );
}
