"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "./actions";
import { initialFormState } from "@/lib/types";
import type { Category } from "@/lib/types";
import { AutoToast } from "@/components/Toast";

export function AddEventForm({ categories }: { categories: Category[] }) {
  const [state, formAction, isPending] = useActionState(createEvent, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.status !== "success") return;
    formRef.current?.reset();
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
          <label htmlFor="ev-category">Catégorie</label>
          <select id="ev-category" name="category_id" required>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
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
            <label htmlFor="ev-time">Heure (optionnel)</label>
            <input type="time" id="ev-time" name="start_time" />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="ev-location">Lieu</label>
          <input type="text" id="ev-location" name="location" />
        </div>

        <div className="form-field">
          <label htmlFor="ev-desc">Description</label>
          <textarea id="ev-desc" name="description" rows={3} />
        </div>

        <div className="form-field">
          <label htmlFor="ev-image">URL de l&apos;image (optionnel)</label>
          <input type="url" id="ev-image" name="image_url" />
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
