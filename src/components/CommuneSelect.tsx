"use client";

import { useRef, useState } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const communeId = byName.get(text.trim().toLowerCase())?.id ?? "";

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        id="ev-commune"
        list="commune-options"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          e.target.setCustomValidity("");
        }}
        onBlur={(e) => {
          const match = byName.get(e.target.value.trim().toLowerCase());
          e.target.setCustomValidity(
            e.target.value && !match ? "Sélectionnez une commune dans la liste." : "",
          );
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
