import { getCollection } from 'astro:content';
import { siteProfile, type SiteProfile } from '../../data/site';
import {
  createContentQueries,
  type ContentMode,
  type PostEntry,
} from './query';

export type { ContentMode, PostData, PostEntry } from './query';

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
  const entries: PostEntry[] = await getCollection('posts');

  return {
    mode,
    site: siteProfile,
    ...createContentQueries({ posts: entries }, mode),
  };
}
