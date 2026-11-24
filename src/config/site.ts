export interface NavItem {
  readonly label: string;
  readonly href: string;
  /** True for a file that opens outside the page, such as the Resume PDF. */
  readonly newTab?: boolean;
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

/** The Resume is a published copy of the PDF, never a page. */
const resume: NavItem = { label: 'Resume', href: '/resume.pdf', newTab: true };

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
  // Add entries only when the route or file they point at exists, so nothing in
  // the shell 404s. The Resume is a PDF, not a route.
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Work', href: '/work' },
    { label: 'Projects', href: '/projects' },
    { label: 'Blog', href: '/blog' },
    resume,
  ] satisfies readonly NavItem[],
  // The footer repeats the Resume because it is the file a recruiter looks
  // for, and carries the Privacy page that every Contact Message depends on.
  footerNav: [resume, { label: 'Privacy', href: '/privacy' }] satisfies readonly NavItem[],
  socials: {
    github: { id: 'github', label: 'GitHub', href: 'https://github.com/budiigunawan', external: true },
    linkedin: { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/budiigunawan/', external: true },
    email: { id: 'email', label: 'Email', href: `mailto:${email}`, external: false },
  } satisfies Record<SocialId, SocialLink>,
} as const;

export const socialLinks: readonly SocialLink[] = Object.values(site.socials);
