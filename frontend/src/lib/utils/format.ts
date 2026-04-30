/**
 * Format a date string or Date object to a human-readable format.
 * @param date - The date to format (string, Date, or number timestamp)
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  };

  try {
    const dateObj = typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    return new Intl.DateTimeFormat("en-US", defaultOptions).format(dateObj);
  } catch {
    return "Invalid date";
  }
}

/**
 * Format a confidence/risk score as a percentage string with color hint.
 * @param score - A number between 0 and 1 (or 0 and 100)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Object with formatted string and severity level
 */
export function formatScore(
  score: number,
  decimals: number = 1
): { text: string; level: "low" | "medium" | "high" | "critical" } {
  // Normalize to 0-100 range
  const normalized = score > 1 ? score : score * 100;
  const clamped = Math.max(0, Math.min(100, normalized));
  const text = `${clamped.toFixed(decimals)}%`;

  let level: "low" | "medium" | "high" | "critical";
  if (clamped >= 90) {
    level = "critical";
  } else if (clamped >= 70) {
    level = "high";
  } else if (clamped >= 40) {
    level = "medium";
  } else {
    level = "low";
  }

  return { text, level };
}

/**
 * Format a relative time string (e.g., "2 hours ago").
 * @param date - The date to compare against now
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date | number): string {
  const dateObj = typeof date === "string" || typeof date === "number"
    ? new Date(date)
    : date;

  if (isNaN(dateObj.getTime())) {
    return "Unknown";
  }

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return "Just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  } else {
    return formatDate(dateObj, { hour: undefined, minute: undefined });
  }
}
