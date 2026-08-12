export function formatEventDate(startDate: string, endDate: string | null): string {
  const start = new Date(`${startDate}T00:00:00`);
  const startLabel = start.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

  if (!endDate || endDate === startDate) {
    return startLabel;
  }

  const end = new Date(`${endDate}T00:00:00`);
  const endLabel = end.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  return `${startLabel} → ${endLabel}`;
}

export function formatEventTime(startTime: string | null, endTime: string | null): string {
  if (!startTime) return "";

  const startLabel = startTime.slice(0, 5);
  if (!endTime) return startLabel;

  return `${startLabel} → ${endTime.slice(0, 5)}`;
}
