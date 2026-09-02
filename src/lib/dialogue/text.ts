/** Substitutes the pet name the player taught her into a line. */
export function applyTokens(text: string, petName: string): string {
  return text.replace(/\{name\}/g, petName || "good boy");
}
