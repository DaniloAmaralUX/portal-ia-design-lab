import { describe, expect, it } from "vitest";
import { badgesOf, parseChangelog, releases } from "./changelog";

const CHANGELOG = `# Changelog

## [2.0.0] - 2026-03-01

### Added
- A \`pg-nova\`, que entra agora.

### Changed
- A \`pg-antiga\` e a \`pg-outra\` mudam.

### Removed
- A \`pg-velha\` sai.

## [1.0.0] - 2026-01-01

### Added
- A \`pg-primeira\`.
`;

describe("the changelog", () => {
  it("reads the version, date and sections from the CHANGELOG", () => {
    const [latest, first] = parseChangelog(CHANGELOG);
    expect(latest).toMatchObject({ version: "2.0.0", date: "2026-03-01" });
    expect(latest?.sections.map((s) => s.kind)).toEqual(["Added", "Changed", "Removed"]);
    expect(first).toMatchObject({ version: "1.0.0", date: "2026-01-01" });
  });

  it("gives the latest version's skills a badge: new for what entered, changed for what changed or left", () => {
    const badges = badgesOf(parseChangelog(CHANGELOG));
    expect(badges.get("pg-nova")).toEqual({ label: "Nova", version: "2.0.0" });
    expect(badges.get("pg-antiga")?.label).toBe("Mudou");
    expect(badges.get("pg-velha")?.label).toBe("Mudou");
    expect(badges.get("pg-primeira")).toBeUndefined();
  });

  it("gives no badge for a section that is not one of the three, even one named like a property of every object", () => {
    const badges = badgesOf(parseChangelog("## [1.0.0] - 2026-01-01\n\n### constructor\n- A `pg-nada`.\n\n### Fixed\n- A `pg-corrigida`.\n"));
    expect(badges.size).toBe(0);
  });

  it("leaves out what has no version yet, the Unreleased of Keep a Changelog", () => {
    const list = parseChangelog(`## [Unreleased]\n\n### Changed\n- A \`pg-futura\` muda.\n\n${CHANGELOG}`);
    expect(list.map((r) => r.version)).toEqual(["2.0.0", "1.0.0"]);
    expect(badgesOf(list).get("pg-futura")).toBeUndefined();
  });

  it("joins an indented line to the item above", () => {
    const [version] = parseChangelog("## [1.0.0] - 2026-01-01\n\n### Added\n- um item\n  que continua\n- outro\n");
    expect(version?.sections[0]?.items).toEqual(["um item que continua", "outro"]);
  });

  it("reads the CHANGELOG of the release the build was made from, whatever its version", () => {
    expect(releases.length).toBeGreaterThan(0);
    expect(releases[0]?.version).toMatch(/^\d+\.\d+\.\d+/);
    expect(releases[0]?.sections.length).toBeGreaterThan(0);
  });
});
