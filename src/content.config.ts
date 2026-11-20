import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/experience' }),
  schema: z
    .object({
      company: z.string().min(1),
      title: z.string().min(1),
      startDate: z.coerce.date(),
      /** Missing means the role is ongoing. */
      endDate: z.coerce.date().optional(),
      location: z.string().min(1).optional(),
      highlights: z.array(z.string().min(1)).default([]),
    })
    .refine((role) => role.endDate === undefined || role.endDate >= role.startDate, {
      message: 'endDate must not be earlier than startDate',
      path: ['endDate'],
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    stack: z.array(z.string().min(1)).min(1),
    date: z.coerce.date(),
    repositoryUrl: z.url().optional(),
    liveUrl: z.url().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { posts, experience, projects };
