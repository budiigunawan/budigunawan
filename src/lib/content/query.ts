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

/** The Project shape, derived from the collection schema so the two cannot drift. */
export type ProjectData = CollectionEntry<'projects'>['data'];

export interface ProjectEntry {
  id: string;
  data: ProjectData;
  body?: string;
}

/** Where a Project card leads, and whether that leaves the site. */
export interface ProjectLinkTarget {
  href: string;
  external: boolean;
}

export interface ContentEntries {
  posts: PostEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
}

export function createContentQueries(
  { posts, experience, projects }: ContentEntries,
  mode: ContentMode,
) {
  assertEveryProjectIsReachable(projects);

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
    projects: projects.toSorted(byDisplayOrder),
    projectLinkTarget: (project: ProjectEntry) => projectLinkTarget(project),
  };
}

/** The Case Study when one exists, otherwise the live site, otherwise the repository. */
function projectLinkTarget(project: ProjectEntry): ProjectLinkTarget {
  if (hasCaseStudy(project)) {
    return { href: `/projects/${project.id}`, external: false };
  }

  const externalHref = project.data.liveUrl ?? project.data.repositoryUrl;

  if (!externalHref) {
    throw new Error(
      `Project "${project.id}" has neither a Case Study nor an external link.`,
    );
  }

  return { href: externalHref, external: true };
}

function hasCaseStudy(project: ProjectEntry): boolean {
  return (project.body?.trim().length ?? 0) > 0;
}

/**
 * A Project must lead somewhere: its Case Study or an external link. There is
 * no way to express this in the collection schema, so the query module enforces
 * it and the static build fails with the offending entry named.
 */
function assertEveryProjectIsReachable(projects: ProjectEntry[]) {
  const orphans = projects.filter(
    (project) =>
      !hasCaseStudy(project) &&
      !project.data.liveUrl &&
      !project.data.repositoryUrl,
  );

  if (orphans.length > 0) {
    throw new Error(
      `Project ${orphans
        .map((project) => `"${project.id}"`)
        .join(', ')} has neither a Case Study nor an external link. Add body content, a liveUrl or a repositoryUrl.`,
    );
  }
}

/** Featured Projects come first; within each group the newest comes first. */
function byDisplayOrder(a: ProjectEntry, b: ProjectEntry) {
  if (a.data.featured !== b.data.featured) {
    return a.data.featured ? -1 : 1;
  }

  return b.data.date.getTime() - a.data.date.getTime();
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
