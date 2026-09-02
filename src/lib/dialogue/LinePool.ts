import type { Line, Mood } from "@/lib/types";

/**
 * Picks lines without repeating herself. A rolling window of recently used
 * ids is excluded, which is what keeps a long sprint from feeling looped.
 */
export class LinePool {
  private recent: string[] = [];

  constructor(private readonly windowSize = 8) {}

  pick(lines: Line[], mood: Mood): Line | null {
    if (!lines.length) return null;

    const forMood = lines.filter(
      (line) => !line.moods?.length || line.moods.includes(mood),
    );
    const candidates = forMood.length ? forMood : lines;

    let fresh = candidates.filter((line) => !this.recent.includes(line.id));
    if (!fresh.length) {
      // Pool exhausted — forget the oldest half and carry on.
      this.recent = this.recent.slice(-Math.floor(this.windowSize / 2));
      fresh = candidates.filter((line) => !this.recent.includes(line.id));
      if (!fresh.length) fresh = candidates;
    }

    const chosen = fresh[Math.floor(Math.random() * fresh.length)];
    this.recent.push(chosen.id);
    if (this.recent.length > this.windowSize) this.recent.shift();
    return chosen;
  }

  reset(): void {
    this.recent = [];
  }
}
