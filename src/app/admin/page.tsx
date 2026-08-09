import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, getExpectedSessionToken } from "@/lib/auth";
import { login } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const expected = await getExpectedSessionToken();

  if (token && token === expected) {
    redirect("/admin/dashboard");
  }

  const { error } = await searchParams;

  return (
    <div className="admin-shell">
      <div className="admin-card">
        <h1>Back office</h1>
        {error && <p className="error-message">Mot de passe incorrect.</p>}
        <form action={login}>
          <div className="form-field">
            <label htmlFor="password">Mot de passe</label>
            <input type="password" id="password" name="password" required autoFocus />
          </div>
          <button type="submit" className="btn btn-primary">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
