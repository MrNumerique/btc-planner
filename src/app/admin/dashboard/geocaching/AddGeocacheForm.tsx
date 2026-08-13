"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createGeocache } from "./actions";
import { initialFormState } from "@/lib/types";
import { AutoToast } from "@/components/Toast";

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
  ssr: false,
  loading: () => <p className="lane-empty">Chargement de la carte…</p>,
});

export function AddGeocacheForm() {
  const [state, formAction, isPending] = useActionState(createGeocache, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (state.status !== "success") return;
    formRef.current?.reset();
    setResetKey((key) => key + 1);
    router.refresh();
  }, [state, router]);

  return (
    <>
      <form ref={formRef} action={formAction}>
        <div className="form-field">
          <label htmlFor="gc-name">Nom</label>
          <input type="text" id="gc-name" name="name" required />
        </div>

        <div className="form-field">
          <label htmlFor="gc-difficulty">Difficulté</label>
          <select id="gc-difficulty" name="difficulty" defaultValue="medium">
            <option value="easy">Facile</option>
            <option value="medium">Moyen</option>
            <option value="hard">Difficile</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="gc-desc">Description / indice</label>
          <textarea id="gc-desc" name="description" rows={3} />
        </div>

        <div className="form-field">
          <label htmlFor="gc-image">Image (optionnel)</label>
          <input type="file" id="gc-image" name="image" accept="image/*" />
        </div>

        <div className="form-field">
          <label>Emplacement</label>
          <LocationPicker key={resetKey} />
        </div>

        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending && <span className="spinner" aria-hidden="true" />}
          {isPending ? "Ajout en cours…" : "Ajouter le cache"}
        </button>
      </form>

      {state.status !== "idle" && (
        <AutoToast
          key={state.message}
          message={state.message}
          variant={state.status === "success" ? "success" : "error"}
        />
      )}
    </>
  );
}
