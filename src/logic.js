/**
 * Returns the day-of-year (1–366) for a YYYY-MM-DD string.
 * Uses UTC to avoid DST-induced off-by-one errors.
 */
export function dayOfYear(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const start = Date.UTC(y, 0, 1);
  const date  = Date.UTC(y, m - 1, d);
  return Math.floor((date - start) / 86400000) + 1;
}

/**
 * Converts a day-of-year back to a display string like "Apr 10" for a given year.
 */
export function dayOfYearToDate(doy, year) {
  const d = new Date(year, 0, doy);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Formats a YYYY-MM-DD string as "Apr 10".
 */
export function formatDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Returns the average day-of-year across observations (each must have a day_of_year field).
 * Returns null for empty input.
 */
export function averageDayOfYear(observations) {
  if (!observations || observations.length === 0) return null;
  const sum = observations.reduce((s, o) => s + o.day_of_year, 0);
  return Math.round(sum / observations.length);
}

/**
 * Returns how many days until a given day-of-year arrives this year (or wraps to next year).
 * Returns 0 if doy is today.
 */
export function daysUntilDoy(doy) {
  const today = new Date();
  const todayDoy = dayOfYear(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
  );
  let diff = doy - todayDoy;
  if (diff < 0) diff += 365;
  return diff;
}

/**
 * Compares a day-of-year against an average, returning a human label and signed difference.
 * Positive diff = later than average; negative = earlier.
 */
export function compareToAverage(doy, avgDoy) {
  const diff = doy - avgDoy;
  if (diff === 0) return { diff: 0, label: "avg" };
  if (diff < 0) return { diff, label: `${Math.abs(diff)}d earlier` };
  return { diff, label: `${diff}d later` };
}

/**
 * Returns the current year as an integer.
 */
export function thisYear() {
  return new Date().getFullYear();
}

/**
 * Returns today's date as YYYY-MM-DD in local time.
 */
export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Given a list of observations for one event type, returns the ones "coming up soon"
 * within the next `windowDays` days based on average day-of-year.
 * Returns { daysUntil, avgDoy } or null if no history.
 */
export function upcomingInfo(observations, windowDays = 60) {
  const avgDoy = averageDayOfYear(observations);
  if (avgDoy === null) return null;
  const until = daysUntilDoy(avgDoy);
  if (until > windowDays) return null;
  return { daysUntil: until, avgDoy };
}
