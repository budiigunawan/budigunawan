export interface NavItem {
  readonly label: string;
  readonly href: string;
}

export type SocialId = 'github' | 'linkedin' | 'email';

export interface SocialLink {
  readonly id: SocialId;
  readonly label: string;
  readonly href: string;
  readonly external: boolean;
}

const name = 'Budi Gunawan';
const email = 'budiindra.g@gmail.com';

/**
 * The single source of truth for the site's identity and canonical URL.
 * Pages, layouts and (later) the sitemap read from here, so none of them can
 * disagree about who Budi is or which domain is canonical.
 */
export const site = {
  name,
  fullName: 'Budi Indra Gunawan',
  tagline: 'Frontend engineer, building toward fullstack.',
  title: `${name} — Frontend engineer building toward fullstack`,
  description:
    'Budi Indra Gunawan builds web applications, mostly on the frontend, and is working toward the whole stack. Work history, projects and writing live here.',
  url: 'https://budigunawan.com',
  locale: 'en',
  email,
  // Add entries only once the route they point at exists, so nothing in the
  // shell 404s.
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Work', href: '/work' },
    { label: 'Projects', href: '/projects' },
    { label: 'Blog', href: '/blog' },
  ] satisfies readonly NavItem[],
  socials: {
    github: { id: 'github', label: 'GitHub', href: 'https://github.com/budiigunawan', external: true },
    linkedin: { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/budiigunawan/', external: true },
    email: { id: 'email', label: 'Email', href: `mailto:${email}`, external: false },
  } satisfies Record<SocialId, SocialLink>,
} as const;

export const socialLinks: readonly SocialLink[] = Object.values(site.socials);
