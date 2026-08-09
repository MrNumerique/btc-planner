"use client";

import { useEffect, useState } from "react";

type Props = {
  message: string;
  variant?: "success" | "error";
  onClose: () => void;
  duration?: number;
};

export function Toast({ message, variant = "success", onClose, duration = 3500 }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast toast-${variant}`} role="status">
      {message}
    </div>
  );
}

/**
 * Self-contained toast: remount it with a fresh `key` (e.g. tied to the
 * triggering action's result) to show it again, no parent state needed.
 */
export function AutoToast({ message, variant }: { message: string; variant?: "success" | "error" }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return <Toast message={message} variant={variant} onClose={() => setVisible(false)} />;
}
