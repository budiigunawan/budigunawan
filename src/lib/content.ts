import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type WorkEntry = CollectionEntry<'work'>;
export type Project = CollectionEntry<'projects'>;
export type Post = CollectionEntry<'posts'>;

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

  return published.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime() || a.data.title.localeCompare(b.data.title),
  );
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

  return published.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime() || a.data.title.localeCompare(b.data.title),
  );
}

/** Published Posts carrying a tag, matched without regard to case, newest first. */
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const wanted = tag.trim().toLowerCase();
  const posts = await getPosts();

  return posts.filter((post) => post.data.tags.some((value) => value.trim().toLowerCase() === wanted));
}
