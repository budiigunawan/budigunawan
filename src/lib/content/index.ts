import { getCollection } from 'astro:content';
import { siteProfile, type SiteProfile } from '../../data/site';
import {
  createContentQueries,
  type ContentMode,
  type ExperienceEntry,
  type PostEntry,
  type ProjectEntry,
} from './query';

export type {
  ContentMode,
  ExperienceData,
  ExperienceEntry,
  PostData,
  PostEntry,
  ProjectData,
  ProjectEntry,
  ProjectLinkTarget,
} from './query';

export interface Content extends ReturnType<typeof createContentQueries> {
  mode: ContentMode;
  site: SiteProfile;
}

/**
 * The only impure part of the content module: it loads the collections and
 * hands them to the pure query functions.
 */
export async function getContent(): Promise<Content> {
  const mode: ContentMode = import.meta.env.DEV ? 'development' : 'production';
  const posts: PostEntry[] = await getCollection('posts');
  const experience: ExperienceEntry[] = await getCollection('experience');
  const projects: ProjectEntry[] = await getCollection('projects');

  return {
    mode,
    site: siteProfile,
    ...createContentQueries({ posts, experience, projects }, mode),
  };
}
