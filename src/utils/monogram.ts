/** Build a 1-2 character monogram from a person, company or school name (avatar fallback). */
export function monogram(name: string): string {
  const cleaned = name.replace(/\(.*?\)/g, " ").replace(/\b(LLC|Inc|Ltd|Co)\.?\b/gi, " ");
  const words = cleaned.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w));
  if (words.length === 0) return "•";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
