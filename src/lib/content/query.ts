/**
 * The content query module: every page reads content through here, never from
 * the collections directly.
 *
 * It is pure. Given collection entries and a mode it returns data; the adapter
 * that calls Astro's collection loader lives in `./index.ts`.
 */

import type { CollectionEntry } from 'astro:content';

export type ContentMode = 'production' | 'development';

/** The Post shape, derived from the collection schema so the two cannot drift. */
export type PostData = CollectionEntry<'posts'>['data'];

export interface PostEntry {
  id: string;
  data: PostData;
  body?: string;
}

/** The Experience shape, derived from the collection schema so the two cannot drift. */
export type ExperienceData = CollectionEntry<'experience'>['data'];

export interface ExperienceEntry {
  id: string;
  data: ExperienceData;
}

export interface ContentEntries {
  posts: PostEntry[];
  experience: ExperienceEntry[];
}

export function createContentQueries(
  { posts, experience }: ContentEntries,
  mode: ContentMode,
) {
  const publishedPosts = posts
    .filter((entry) => mode === 'development' || !entry.data.draft)
    .toSorted(
      (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
    );

  return {
    publishedPosts,
    isBlogVisible: publishedPosts.length > 0,
    latestPosts: (count: number) => publishedPosts.slice(0, count),
    readingTime: (post: PostEntry) => readingTime(post),
    experienceTimeline: experience.toSorted(byTimelinePosition),
  };
}

/** Ongoing roles come first, then the rest by start date descending. */
function byTimelinePosition(a: ExperienceEntry, b: ExperienceEntry) {
  const aOngoing = !a.data.endDate;
  const bOngoing = !b.data.endDate;

  if (aOngoing !== bOngoing) {
    return aOngoing ? -1 : 1;
  }

  return b.data.startDate.getTime() - a.data.startDate.getTime();
}

const WORDS_PER_MINUTE = 200;

function readingTime(post: PostEntry): number {
  const wordCount = post.body?.trim().split(/\s+/).filter(Boolean).length ?? 0;

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
