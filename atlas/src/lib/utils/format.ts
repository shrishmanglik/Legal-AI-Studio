export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatScore(score: number): string {
  return score.toLocaleString("en-CA");
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

export function formatProcessingTime(months: number): string {
  if (months < 1) return "Less than 1 month";
  if (months === 1) return "1 month";
  if (months < 12) return `${months} months`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years} year${years > 1 ? "s" : ""}`;
  return `${years} year${years > 1 ? "s" : ""}, ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
}
