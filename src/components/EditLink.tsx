"use client";

import Link, { useLinkStatus } from "next/link";

function PendingSpinner() {
  const { pending } = useLinkStatus();
  return pending ? <span className="spinner spinner-dark" aria-hidden="true" /> : null;
}

export function EditLink({ href }: { href: string }) {
  return (
    <Link href={href} className="btn btn-ghost">
      <PendingSpinner />
      Modifier
    </Link>
  );
}
