import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { updateCategory } from "../../../actions";
import type { Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: category } = await supabaseAdmin
    .from("categories")
    .select("*")
    .eq("id", id)
    .single<Category>();

  if (!category) {
    notFound();
  }

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <h1 style={{ marginBottom: 0 }}>Modifier la catégorie</h1>
        <Link href="/admin/dashboard">← Retour</Link>
      </div>

      <div className="admin-card">
        <form action={updateCategory}>
          <input type="hidden" name="id" value={category.id} />

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="cat-name">Nom</label>
              <input type="text" id="cat-name" name="name" defaultValue={category.name} required />
            </div>
            <div className="form-field" style={{ flex: "0 0 100px" }}>
              <label htmlFor="cat-color">Couleur</label>
              <input type="color" id="cat-color" name="color" defaultValue={category.color} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}
