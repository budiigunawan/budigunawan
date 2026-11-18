export interface SiteProfile {
  name: string;
  role: string;
  pitch: string;
  bioSummary: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  /** Canonical origin, without a trailing slash. */
  siteUrl: string;
  /** Absolute path to the image used when a page has no image of its own. */
  defaultSocialImage: string;
}

/**
 * The single source of site-wide profile details. Placeholder values until
 * Budi supplies the real ones; changing them here updates every page.
 */
export const siteProfile: SiteProfile = {
  name: 'Budi Gunawan',
  role: 'Fullstack engineer focused on frontend',
  pitch: 'I build fast, accessible web products end to end, from the data layer to the last pixel.',
  bioSummary:
    'Budi Gunawan is a fullstack engineer focused on frontend. Budi builds products where performance, accessibility and craft are part of the product, not an afterthought.',
  email: 'hello@budigunawan.com',
  githubUrl: 'https://github.com/budigunawan',
  linkedinUrl: 'https://www.linkedin.com/in/budigunawan',
  siteUrl: 'https://budigunawan.com',
  defaultSocialImage: '/og-default.png',
};
