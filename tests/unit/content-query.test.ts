import { describe, expect, it } from 'vitest';
import { createContentQueries, type PostEntry } from '../../src/lib/content/query';

function post(
  overrides: Partial<PostEntry['data']> & { id?: string; body?: string } = {},
): PostEntry {
  const { id = 'a-post', body = 'Words in the body.', ...data } = overrides;

  return {
    id,
    body,
    data: {
      title: 'A Post',
      description: 'A short description.',
      publishDate: new Date('2026-01-01'),
      tags: [],
      draft: false,
      ...data,
    },
  };
}

describe('published Posts', () => {
  it('excludes Drafts in production', () => {
    const content = createContentQueries(
      { posts: [post({ id: 'published' }), post({ id: 'unfinished', draft: true })] },
      'production',
    );

    expect(content.publishedPosts.map((entry) => entry.id)).toEqual(['published']);
  });

  it('includes Drafts, still flagged as drafts, in development', () => {
    const content = createContentQueries(
      { posts: [post({ id: 'published' }), post({ id: 'unfinished', draft: true })] },
      'development',
    );

    expect(content.publishedPosts.map((entry) => entry.id)).toEqual([
      'published',
      'unfinished',
    ]);
    expect(content.publishedPosts[1]?.data.draft).toBe(true);
  });

  it('sorts published Posts newest first', () => {
    const content = createContentQueries(
      {
        posts: [
          post({ id: 'oldest', publishDate: new Date('2025-01-01') }),
          post({ id: 'newest', publishDate: new Date('2026-06-01') }),
          post({ id: 'middle', publishDate: new Date('2025-09-01') }),
        ],
      },
      'production',
    );

    expect(content.publishedPosts.map((entry) => entry.id)).toEqual([
      'newest',
      'middle',
      'oldest',
    ]);
  });
});

describe('Blog visibility', () => {
  it('is false when there are no Posts', () => {
    const content = createContentQueries({ posts: [] }, 'production');

    expect(content.isBlogVisible).toBe(false);
  });

  it('is false when every Post is a Draft', () => {
    const content = createContentQueries(
      { posts: [post({ id: 'unfinished', draft: true })] },
      'production',
    );

    expect(content.isBlogVisible).toBe(false);
  });

  it('is true once a Post is published', () => {
    const content = createContentQueries(
      { posts: [post({ id: 'published' }), post({ id: 'unfinished', draft: true })] },
      'production',
    );

    expect(content.isBlogVisible).toBe(true);
  });
});

describe('latest Posts', () => {
  it('returns the newest n published Posts', () => {
    const content = createContentQueries(
      {
        posts: [
          post({ id: 'third', publishDate: new Date('2025-01-01') }),
          post({ id: 'latest', publishDate: new Date('2026-03-01') }),
          post({ id: 'draft', publishDate: new Date('2026-09-01'), draft: true }),
          post({ id: 'second', publishDate: new Date('2025-06-01') }),
        ],
      },
      'production',
    );

    expect(content.latestPosts(2).map((entry) => entry.id)).toEqual([
      'latest',
      'second',
    ]);
  });
});

describe('reading time', () => {
  const words = (count: number) => Array.from({ length: count }, () => 'word').join(' ');

  it('rounds up to whole minutes at 200 words per minute', () => {
    const content = createContentQueries({ posts: [] }, 'production');

    expect(content.readingTime(post({ body: words(200) }))).toBe(1);
    expect(content.readingTime(post({ body: words(201) }))).toBe(2);
    expect(content.readingTime(post({ body: words(401) }))).toBe(3);
  });

  it('is at least one minute for an empty body', () => {
    const content = createContentQueries({ posts: [] }, 'production');

    expect(content.readingTime(post({ body: undefined }))).toBe(1);
    expect(content.readingTime(post({ body: '   ' }))).toBe(1);
  });
});
