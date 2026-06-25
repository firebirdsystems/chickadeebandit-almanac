import { describe, it, expect } from "vitest";
import {
  dayOfYear,
  dayOfYearToDate,
  formatDate,
  averageDayOfYear,
  daysUntilDoy,
  compareToAverage,
  thisYear,
  todayStr,
} from "../src/logic.js";

describe("dayOfYear", () => {
  it("returns 1 for Jan 1", () => {
    expect(dayOfYear("2025-01-01")).toBe(1);
  });

  it("returns 365 for Dec 31 in a non-leap year", () => {
    expect(dayOfYear("2025-12-31")).toBe(365);
  });

  it("returns 366 for Dec 31 in a leap year", () => {
    expect(dayOfYear("2024-12-31")).toBe(366);
  });

  it("Feb 29 in a leap year returns 60", () => {
    expect(dayOfYear("2024-02-29")).toBe(60);
  });

  it("Apr 10 is day 100 in a non-leap year", () => {
    expect(dayOfYear("2025-04-10")).toBe(100);
  });
});

describe("dayOfYearToDate", () => {
  it("round-trips Jan 1", () => {
    const result = dayOfYearToDate(1, 2025);
    expect(result).toBe("Jan 1");
  });

  it("day 100 in 2025 is Apr 10", () => {
    expect(dayOfYearToDate(100, 2025)).toBe("Apr 10");
  });

  it("day 365 in 2025 is Dec 31", () => {
    expect(dayOfYearToDate(365, 2025)).toBe("Dec 31");
  });
});

describe("formatDate", () => {
  it("formats a date string as short month + day", () => {
    expect(formatDate("2025-04-10")).toBe("Apr 10");
  });

  it("formats January correctly", () => {
    expect(formatDate("2025-01-01")).toBe("Jan 1");
  });
});

describe("averageDayOfYear", () => {
  it("returns null for empty array", () => {
    expect(averageDayOfYear([])).toBeNull();
  });

  it("returns null for null input", () => {
    expect(averageDayOfYear(null)).toBeNull();
  });

  it("returns the single value for one observation", () => {
    expect(averageDayOfYear([{ day_of_year: 100 }])).toBe(100);
  });

  it("averages two values", () => {
    expect(averageDayOfYear([{ day_of_year: 100 }, { day_of_year: 200 }])).toBe(150);
  });

  it("rounds to nearest integer", () => {
    expect(averageDayOfYear([{ day_of_year: 100 }, { day_of_year: 101 }, { day_of_year: 102 }])).toBe(101);
  });
});

describe("compareToAverage", () => {
  it("returns diff 0 and label 'avg' when equal", () => {
    const result = compareToAverage(100, 100);
    expect(result.diff).toBe(0);
    expect(result.label).toBe("avg");
  });

  it("returns negative diff and 'Xd earlier' when earlier", () => {
    const result = compareToAverage(95, 100);
    expect(result.diff).toBe(-5);
    expect(result.label).toBe("5d earlier");
  });

  it("returns positive diff and 'Xd later' when later", () => {
    const result = compareToAverage(107, 100);
    expect(result.diff).toBe(7);
    expect(result.label).toBe("7d later");
  });
});

describe("daysUntilDoy", () => {
  it("returns 0 for today's doy", () => {
    const today = new Date();
    const doy = dayOfYear(
      `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`
    );
    expect(daysUntilDoy(doy)).toBe(0);
  });

  it("returns a positive number for a future doy", () => {
    const today = new Date();
    const todayDoy = dayOfYear(
      `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`
    );
    const futureDoy = todayDoy + 10 <= 365 ? todayDoy + 10 : todayDoy - 10;
    if (futureDoy > todayDoy) {
      expect(daysUntilDoy(futureDoy)).toBe(10);
    }
  });

  it("wraps around the year boundary for past doys", () => {
    const result = daysUntilDoy(1); // Jan 1 — should be > 0 for most of the year
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(365);
  });
});

describe("thisYear", () => {
  it("returns a 4-digit year matching current year", () => {
    expect(thisYear()).toBe(new Date().getFullYear());
  });
});

describe("todayStr", () => {
  it("returns YYYY-MM-DD format", () => {
    expect(todayStr()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("matches the current local date", () => {
    const d = new Date();
    const expected = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    expect(todayStr()).toBe(expected);
  });
});

