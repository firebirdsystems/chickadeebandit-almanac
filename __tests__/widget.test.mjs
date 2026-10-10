import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { describe, it, expect } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const widget = readFileSync(join(__dirname, "../src/widget.html"), "utf-8");

// A widget frame is sandboxed without popups, so `window.open` returns null
// there. Opening the app from a row has to go through the hub (`hubOpen` posts
// `hub:open` to the parent, which navigates to `/open/almanac?eventTypeId=…`).
describe("widget opens the app through the hub, not a popup", () => {
  it("never calls window.open", () => {
    expect(widget).not.toMatch(/window\.open\s*\(/);
  });

  it("imports hubOpen from the SDK", () => {
    expect(widget).toMatch(/import \{[^}]*\bhubOpen\b[^}]*\} from "\/hub-sdk\.js";/);
  });

  it("opens this app with the row's eventTypeId", () => {
    const fn = widget.match(/function openApp\(eventTypeId\) \{([\s\S]*?)\n\}/)?.[1] ?? "";
    expect(fn.trim()).toBe("hubOpen(APP_ID, { eventTypeId });");
    expect(widget).toMatch(/const APP_ID = "almanac";/);
  });

  it("rows reach openApp through the delegated data-open click", () => {
    expect(widget).toMatch(/closest\("\[data-open\]"\)/);
    expect(widget).toMatch(/openApp\(el\.dataset\.open\)/);
  });
});
