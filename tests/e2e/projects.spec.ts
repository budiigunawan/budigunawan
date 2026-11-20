import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

const projectsDirectory = fileURLToPath(
  new URL('../../src/content/projects', import.meta.url),
);

interface ProjectFile {
  id: string;
  title: string;
  hasCaseStudy: boolean;
}

/**
 * The built page can't tell a test which Projects have a Case Study, so read
 * the source entries: a Project has one exactly when it has body content.
 */
function projectFiles(): ProjectFile[] {
  return readdirSync(projectsDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const source = readFileSync(`${projectsDirectory}/${file}`, 'utf8');
      const [, frontmatter = '', body = ''] =
        source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/) ?? [];
      const title = frontmatter.match(/^title:\s*(.+?)\s*$/m)?.[1] ?? '';

      return {
        id: file.replace(/\.mdx$/, ''),
        title: title.replace(/^['"]|['"]$/g, ''),
        hasCaseStudy: body.trim().length > 0,
      };
    });
}

const projects = projectFiles();

test('Projects shows a card for every Project', async ({ page }) => {
  await page.goto('/projects');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projects');
  await expect(page.getByRole('article')).toHaveCount(projects.length);

  for (const project of projects) {
    const card = page.getByRole('article').filter({
      has: page.getByRole('heading', { name: project.title }),
    });

    await expect(card).toHaveCount(1);
    await expect(card.getByRole('link')).toHaveCount(1);
    await expect(card.getByRole('list')).not.toBeEmpty();
  }
});

test('every Project without a Case Study links externally', async ({ page }) => {
  await page.goto('/projects');

  for (const project of projects.filter((entry) => !entry.hasCaseStudy)) {
    const card = page.getByRole('article').filter({
      has: page.getByRole('heading', { name: project.title }),
    });
    const link = card.getByRole('link');

    await expect(link).toHaveAttribute('href', /^https?:\/\//);
    await expect(link).toHaveAccessibleName(
      new RegExp(`${escapeRegExp(project.title)} \\(external\\)$`),
    );
  }
});

test('a Project with a Case Study links to it instead', async ({ page }) => {
  const withCaseStudy = projects.filter((entry) => entry.hasCaseStudy);

  test.skip(withCaseStudy.length === 0, 'No Project has a Case Study yet.');

  await page.goto('/projects');

  for (const project of withCaseStudy) {
    const card = page.getByRole('article').filter({
      has: page.getByRole('heading', { name: project.title }),
    });

    await expect(card.getByRole('link')).toHaveAttribute(
      'href',
      `/projects/${project.id}`,
    );
  }
});

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
