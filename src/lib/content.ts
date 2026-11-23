import { getCollection, type CollectionEntry } from 'astro:content';

export type WorkEntry = CollectionEntry<'work'>;

/**
 * Every Work Entry, newest start date first, with the company name breaking
 * ties. A role with no end date is current; sorting by start date alone keeps
 * it in its chronological place.
 */
export async function getWorkEntries(): Promise<WorkEntry[]> {
  const entries = await getCollection('work');

  return entries.sort(
    (a, b) => b.data.start.getTime() - a.data.start.getTime() || a.data.company.localeCompare(b.data.company),
  );
}
