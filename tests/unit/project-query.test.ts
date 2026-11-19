import { describe, expect, it } from 'vitest';
import {
  createContentQueries,
  type ContentMode,
  type ProjectEntry,
} from '../../src/lib/content/query';

function queries(projects: ProjectEntry[], mode: ContentMode = 'production') {
  return createContentQueries({ posts: [], experience: [], projects }, mode);
}

function project(
  overrides: Partial<ProjectEntry['data']> & { id?: string; body?: string } = {},
): ProjectEntry {
  const { id = 'a-project', body, ...data } = overrides;

  return {
    id,
    body,
    data: {
      title: 'A Project',
      summary: 'A short summary.',
      stack: ['Astro'],
      date: new Date('2026-01-01'),
      featured: false,
      liveUrl: 'https://example.com',
      ...data,
    },
  };
}

describe('Project link target', () => {
  it('prefers the Case Study, then the live URL, then the repository', () => {
    const content = queries([]);

    const caseStudy = content.projectLinkTarget(
      project({
        id: 'flagship',
        body: 'The long-form story.',
        liveUrl: 'https://flagship.example',
        repositoryUrl: 'https://github.com/budi/flagship',
      }),
    );
    const live = content.projectLinkTarget(
      project({
        id: 'shipped',
        liveUrl: 'https://shipped.example',
        repositoryUrl: 'https://github.com/budi/shipped',
      }),
    );
    const repository = content.projectLinkTarget(
      project({
        id: 'library',
        liveUrl: undefined,
        repositoryUrl: 'https://github.com/budi/library',
      }),
    );

    expect(caseStudy).toEqual({ href: '/projects/flagship', external: false });
    expect(live).toEqual({ href: 'https://shipped.example', external: true });
    expect(repository).toEqual({
      href: 'https://github.com/budi/library',
      external: true,
    });
  });
});

describe('Project reachability', () => {
  it('accepts a Project with a Case Study and no external link', () => {
    expect(() =>
      queries([
        project({ id: 'flagship', body: 'The long-form story.', liveUrl: undefined }),
      ]),
    ).not.toThrow();
  });

  it('accepts a Project with an external link and no Case Study', () => {
    expect(() =>
      queries([
        project({ id: 'live-only', liveUrl: 'https://live.example' }),
        project({ id: 'repository-only', liveUrl: undefined, repositoryUrl: 'https://repo.example' }),
      ]),
    ).not.toThrow();
  });

  it('fails the build when a Project has neither a Case Study nor an external link', () => {
    expect(() =>
      queries([
        project({
          id: 'orphan',
          body: '   ',
          liveUrl: undefined,
          repositoryUrl: undefined,
        }),
      ]),
    ).toThrow(/orphan/);
  });
});

describe('Projects in display order', () => {
  it('lists Featured Projects first, then the rest newest first', () => {
    const content = queries([
      project({ id: 'older', date: new Date('2024-02-01') }),
      project({
        id: 'featured-older',
        date: new Date('2023-05-01'),
        featured: true,
        body: 'Case Study.',
      }),
      project({ id: 'newest', date: new Date('2025-11-01') }),
      project({
        id: 'featured-newest',
        date: new Date('2024-08-01'),
        featured: true,
        body: 'Case Study.',
      }),
    ]);

    expect(content.projects.map((entry) => entry.id)).toEqual([
      'featured-newest',
      'featured-older',
      'newest',
      'older',
    ]);
  });
});
