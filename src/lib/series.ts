// シリーズ（Phase）の表示名。frontmatter の `series:` の値をキーにする
export const SERIES: Record<string, { name: string; short: string }> = {
  phase3: { name: "Phase 3 図書館（建物）を楽しむシリーズ", short: "Phase 3" },
  phase4: { name: "Phase 4 県立図書館シリーズ", short: "Phase 4" },
  phase5: { name: "Phase 5 こだわりの図書館", short: "Phase 5" },
  phase6: { name: "Phase 6 本の街・本の宿", short: "Phase 6" },
};

export function getSeriesName(key: string | undefined): string | undefined {
  if (!key) return undefined;
  return SERIES[key]?.name ?? key;
}
