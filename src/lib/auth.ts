import "server-only";

export const SESSION_COOKIE_NAME = "btc_admin_session";

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function getExpectedSessionToken(): Promise<string> {
  const password = process.env.BACKOFFICE_PASSWORD;
  if (!password) {
    throw new Error("BACKOFFICE_PASSWORD n'est pas défini dans l'environnement.");
  }
  return sha256Hex(`btc-planner:${password}`);
}

export async function checkPassword(candidate: string): Promise<boolean> {
  const password = process.env.BACKOFFICE_PASSWORD;
  if (!password) return false;
  return candidate === password;
}
