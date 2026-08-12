"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "./actions";
import { initialFormState } from "@/lib/types";
import type { Category, Commune } from "@/lib/types";
import { AutoToast } from "@/components/Toast";
import { CommuneSelect } from "@/components/CommuneSelect";

export function AddEventForm({
  categories,
  communes,
}: {
  categories: Category[];
  communes: Commune[];
}) {
  const [state, formAction, isPending] = useActionState(createEvent, initialFormState);
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
          <label htmlFor="ev-title">Titre</label>
          <input type="text" id="ev-title" name="title" required />
        </div>

        <div className="form-field">
          <label>Catégories</label>
          <div className="checkbox-group">
            {categories.map((category) => (
              <label key={category.id} className="checkbox-option">
                <input type="checkbox" name="category_ids" value={category.id} />
                {category.name}
              </label>
            ))}
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="ev-start">Date de début</label>
            <input type="date" id="ev-start" name="start_date" required />
          </div>
          <div className="form-field">
            <label htmlFor="ev-end">Date de fin (optionnel)</label>
            <input type="date" id="ev-end" name="end_date" />
          </div>
          <div className="form-field">
            <label htmlFor="ev-time">Heure de début (optionnel)</label>
            <input type="time" id="ev-time" name="start_time" />
          </div>
          <div className="form-field">
            <label htmlFor="ev-end-time">Heure de fin (optionnel)</label>
            <input type="time" id="ev-end-time" name="end_time" />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="ev-commune">Commune</label>
          <CommuneSelect key={resetKey} communes={communes} />
        </div>

        <div className="form-field">
          <label htmlFor="ev-desc">Description</label>
          <textarea id="ev-desc" name="description" rows={3} />
        </div>

        <div className="form-field">
          <label htmlFor="ev-image">Image (optionnel)</label>
          <input type="file" id="ev-image" name="image" accept="image/*" />
        </div>

        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending && <span className="spinner" aria-hidden="true" />}
          {isPending ? "Ajout en cours…" : "Ajouter l'événement"}
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
