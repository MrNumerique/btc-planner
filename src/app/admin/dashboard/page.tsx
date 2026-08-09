import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { logout } from "../actions";
import { createCategory, deleteCategory, createEvent, deleteEvent } from "./actions";
import type { Category, Event } from "@/lib/types";
import { formatEventDate } from "@/lib/format";

export const dynamic = "force-dynamic";

async function getData(): Promise<{ categories: Category[]; events: Event[] }> {
  const [{ data: categories }, { data: events }] = await Promise.all([
    supabaseAdmin.from("categories").select("*").order("name"),
    supabaseAdmin.from("events").select("*").order("start_date"),
  ]);

  return { categories: categories ?? [], events: events ?? [] };
}

export default async function DashboardPage() {
  const { categories, events } = await getData();
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  return (
    <div className="admin-shell" style={{ maxWidth: 900 }}>
      <div className="admin-topbar">
        <h1 style={{ marginBottom: 0 }}>Back office</h1>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/" target="_blank">
            Voir le planning public →
          </Link>
          <form action={logout}>
            <button type="submit" className="btn btn-ghost">
              Déconnexion
            </button>
          </form>
        </div>
      </div>

      <div className="admin-card">
        <h1>Catégories</h1>

        <div className="admin-list">
          {categories.length === 0 && <p className="lane-empty">Aucune catégorie.</p>}
          {categories.map((category) => (
            <div
              key={category.id}
              className="admin-list-item"
              style={{ "--item-color": category.color } as React.CSSProperties}
            >
              <div className="admin-list-item-info">
                <span className="admin-list-item-title">{category.name}</span>
                <span className="admin-list-item-meta">{category.color}</span>
              </div>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={category.id} />
                <button type="submit" className="btn btn-danger">
                  Supprimer
                </button>
              </form>
            </div>
          ))}
        </div>

        <h2>Ajouter une catégorie</h2>
        <form action={createCategory}>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="cat-name">Nom</label>
              <input type="text" id="cat-name" name="name" required />
            </div>
            <div className="form-field" style={{ flex: "0 0 100px" }}>
              <label htmlFor="cat-color">Couleur</label>
              <input type="color" id="cat-color" name="color" defaultValue="#3CAA3C" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Ajouter la catégorie
          </button>
        </form>
      </div>

      <div className="admin-card" style={{ marginTop: 24 }}>
        <h1>Événements</h1>

        <div className="admin-list">
          {events.length === 0 && <p className="lane-empty">Aucun événement.</p>}
          {events.map((event) => {
            const category = categoryById.get(event.category_id);
            return (
              <div
                key={event.id}
                className="admin-list-item"
                style={{ "--item-color": category?.color ?? "#3CAA3C" } as React.CSSProperties}
              >
                <div className="admin-list-item-info">
                  <span className="admin-list-item-title">{event.title}</span>
                  <span className="admin-list-item-meta">
                    {category?.name ?? "Sans catégorie"} ·{" "}
                    {formatEventDate(event.start_date, event.end_date)}
                  </span>
                </div>
                <div className="admin-list-item-actions">
                  <Link href={`/admin/dashboard/events/${event.id}/edit`} className="btn btn-ghost">
                    Modifier
                  </Link>
                  <form action={deleteEvent}>
                    <input type="hidden" name="id" value={event.id} />
                    <button type="submit" className="btn btn-danger">
                      Supprimer
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>

        <h2>Ajouter un événement</h2>
        <form action={createEvent}>
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

          <button type="submit" className="btn btn-primary">
            Ajouter l&apos;événement
          </button>
        </form>
      </div>
    </div>
  );
}
