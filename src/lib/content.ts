import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type WorkEntry = CollectionEntry<'work'>;
export type Project = CollectionEntry<'projects'>;
export type Post = CollectionEntry<'posts'>;
export type Legal = CollectionEntry<'legal'>;

/** Newest first, with the title breaking date ties. */
function newestFirst<T extends { data: { date: Date; title: string } }>(a: T, b: T): number {
  return b.data.date.getTime() - a.data.date.getTime() || a.data.title.localeCompare(b.data.title);
}

/** The home page shows three Projects and three Posts. */
const HOME_FEATURED_COUNT = 3;

/**
 * Up to `limit` entries, flagged ones first and the newest unflagged filling
 * the remainder, displayed newest first. Fewer entries than the limit return
 * fewer entries rather than a placeholder.
 */
function selectFeatured<T extends { data: { featured: boolean; date: Date; title: string } }>(
  entries: T[],
  limit: number,
): T[] {
  const flagged = entries.filter((entry) => entry.data.featured);
  const unflagged = entries.filter((entry) => !entry.data.featured);

  return [...flagged, ...unflagged].slice(0, limit).sort(newestFirst);
}

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

/**
 * Every published Project, newest first. Drafts are omitted from production
 * builds but stay visible in development, so they can be reviewed before they
 * are published.
 */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  const published = projects.filter((project) => !import.meta.env.PROD || !project.data.draft);

  for (const project of published) {
    if (project.data.workEntry && !(await getEntry(project.data.workEntry))) {
      throw new Error(
        `Project "${project.id}" declares workEntry "${project.data.workEntry.id}", but no Work Entry with that id exists.`,
      );
    }
  }

  return published.sort(newestFirst);
}

/**
 * Projects for the home page: flagged Projects first, then the newest unflagged
 * ones, up to three in total.
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  return selectFeatured(await getProjects(), HOME_FEATURED_COUNT);
}

/** The Work Entry that produced a Project, when it names one. */
export async function getProjectWorkEntry(project: Project): Promise<WorkEntry | undefined> {
  return project.data.workEntry ? getEntry(project.data.workEntry) : undefined;
}

/** Published Projects grouped by the Work Entry they reference. */
export async function getProjectsByWorkEntry(): Promise<Map<string, Project[]>> {
  const projects = await getProjects();
  const byWorkEntry = new Map<string, Project[]>();

  for (const project of projects) {
    const workEntryId = project.data.workEntry?.id;
    if (!workEntryId) continue;

    const related = byWorkEntry.get(workEntryId) ?? [];
    related.push(project);
    byWorkEntry.set(workEntryId, related);
  }

  return byWorkEntry;
}

/**
 * Every published Post, newest first. Drafts are omitted from production
 * builds but stay visible in development, so they can be reviewed before they
 * are published.
 */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts');
  const published = posts.filter((post) => !import.meta.env.PROD || !post.data.draft);

  return published.sort(newestFirst);
}

/**
 * Posts for the home page: flagged Posts first, then the newest unflagged ones,
 * up to three in total.
 */
export async function getFeaturedPosts(): Promise<Post[]> {
  return selectFeatured(await getPosts(), HOME_FEATURED_COUNT);
}

/**
 * The Legal entry with this slug. A policy page is a promise to the reader, so
 * a missing entry fails the build rather than rendering an empty page.
 */
export async function getLegalEntry(slug: string): Promise<Legal> {
  const entry = await getEntry('legal', slug);

  if (!entry) {
    throw new Error(`No Legal entry named "${slug}" exists in src/content/legal/.`);
  }

  return entry;
}

/** Published Posts carrying a tag, matched without regard to case, newest first. */
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const wanted = tag.trim().toLowerCase();
  const posts = await getPosts();

  return posts.filter((post) => post.data.tags.some((value) => value.trim().toLowerCase() === wanted));
}
