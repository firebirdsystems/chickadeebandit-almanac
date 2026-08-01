import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { describe, it, expect } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(readFileSync(join(__dirname, "../manifest.json"), "utf-8"));

// Both tables shipped with NO row_policies entry — ungoverned, so any member
// with app access (guests included) could delete another member's observations
// or the event types the household's whole history hangs off. An almanac is a
// shared record, so reads stay open; the policy only decides who may CHANGE a
// row. owner_or_visibility with neither write_owner_only nor
// write_visibility_scoped set is the rule this app wants: a child logs and
// edits their own observations, adults may correct or remove any row.
describe("row policies", () => {
  for (const [table, column] of [["event_types", "created_by"], ["observations", "logged_by"]]) {
    it(`governs ${table} writes without narrowing reads`, () => {
      expect(manifest.row_policies[table]).toEqual({
        kind: "owner_or_visibility",
        member_column: column,
        visibility_column: "visibility",
        everyone_values: ["everyone"],
      });
    });
  }

  it("defaults every row to household-readable", () => {
    const sql = readFileSync(join(__dirname, "../migrations/003_visibility.sql"), "utf-8");
    expect(sql.match(/ADD COLUMN visibility TEXT NOT NULL DEFAULT 'everyone'/g)).toHaveLength(2);
  });

  it("declares what member removal does to its attribution columns", () => {
    expect(manifest.member_references).toEqual({
      event_types: { column: "created_by", on_removed: "keep" },
      observations: { column: "logged_by", on_removed: "keep" },
    });
  });
});
