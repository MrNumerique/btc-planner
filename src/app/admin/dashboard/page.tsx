import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { logout } from "../actions";
import { createCategory, deleteCategory, deleteEvent } from "./actions";
import { AddEventForm } from "./AddEventForm";
import { EditLink } from "@/components/EditLink";
import type { Category, Commune, Event } from "@/lib/types";
import { formatEventDate } from "@/lib/format";
import { groupCategoryIdsByEvent, resolveCategories } from "@/lib/events";

export const dynamic = "force-dynamic";

async function getData(): Promise<{ categories: Category[]; communes: Commune[]; events: Event[] }> {
  const [{ data: categories }, { data: communes }, { data: events }, { data: eventCategories }] =
    await Promise.all([
      supabaseAdmin.from("categories").select("*").order("name"),
      supabaseAdmin.from("communes").select("*").order("name"),
      supabaseAdmin.from("events").select("*").order("start_date"),
      supabaseAdmin.from("event_categories").select("event_id, category_id"),
    ]);

  const categoryIdsByEvent = groupCategoryIdsByEvent(eventCategories ?? []);

  const eventsWithCategories = (events ?? []).map((event) => ({
    ...event,
    category_ids: categoryIdsByEvent.get(event.id) ?? [],
  }));

  return { categories: categories ?? [], communes: communes ?? [], events: eventsWithCategories };
}

export default async function DashboardPage() {
  const { categories, communes, events } = await getData();
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const communeById = new Map(communes.map((c) => [c.id, c]));

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
              <div className="admin-list-item-actions">
                <EditLink href={`/admin/dashboard/categories/${category.id}/edit`} />
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={category.id} />
                  <button type="submit" className="btn btn-danger">
                    Supprimer
                  </button>
                </form>
              </div>
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
            const eventCategories = resolveCategories(event.category_ids, categoryById);
            const categoryNames = eventCategories.map((c) => c.name).join(", ") || "Sans catégorie";
            const communeName = communeById.get(event.commune_id ?? "")?.name ?? "Sans commune";
            return (
              <div
                key={event.id}
                className="admin-list-item"
                style={{ "--item-color": eventCategories[0]?.color ?? "#3CAA3C" } as React.CSSProperties}
              >
                <div className="admin-list-item-info">
                  <span className="admin-list-item-title">{event.title}</span>
                  <span className="admin-list-item-meta">
                    {communeName} · {categoryNames} · {formatEventDate(event.start_date, event.end_date)}
                  </span>
                </div>
                <div className="admin-list-item-actions">
                  <EditLink href={`/admin/dashboard/events/${event.id}/edit`} />
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
        <AddEventForm categories={categories} communes={communes} />
      </div>
    </div>
  );
}
