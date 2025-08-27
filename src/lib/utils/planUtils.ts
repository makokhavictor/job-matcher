/**
 * Cleans up plan names by removing common prefixes like "Job Matcher – " or "Job Matcher - "
 * @param planName The original plan name
 * @returns The cleaned plan name
 */
export function cleanPlanName(planName: string | undefined | null): string {
  if (!planName) return "Free Plan";
  
  // Remove 'Job Matcher –' or 'Job Matcher -' prefix (case insensitive)
  const cleanName = planName.replace(/^Job Matcher\s*[–-]\s*/i, '').trim();
  
  // Return the cleaned name or fallback to original if cleaning resulted in empty string
  return cleanName || planName;
}
