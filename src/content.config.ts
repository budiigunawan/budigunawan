import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The single authority on content shape. A Work Entry is one employment
 * relationship; its body records responsibilities, never Projects. An absent
 * end date means the role is current. A Project is a piece of shipped
 * software, personal or professional, and may name the Work Entry that
 * produced it. A Post is a piece of writing, technical or personal; Retro is a
 * tag on a Post, not a separate collection.
 */
const month = z
  .string()
  .trim()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'expected a month in YYYY-MM form, such as 2023-09')
  .transform((value) => new Date(`${value}-01T00:00:00Z`));

const day = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'expected a date in YYYY-MM-DD form, such as 2024-08-08')
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, 'expected a real calendar date')
  .transform((value) => new Date(`${value}T00:00:00Z`));

const httpsUrl = z
  .string()
  .trim()
  .url()
  .refine((value) => value.startsWith('https://'), 'expected an https URL');

const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
  schema: z
    .object({
      company: z.string().trim().min(1),
      role: z.string().trim().min(1),
      start: month,
      end: month.optional(),
    })
    .strict()
    .refine((entry) => entry.end === undefined || entry.end >= entry.start, {
      message: 'end must not be before the start date',
      path: ['end'],
    }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z
    .object({
      title: z.string().trim().min(1),
      summary: z.string().trim().min(1),
      kind: z.enum(['personal', 'professional']),
      workEntry: reference('work').optional(),
      date: day,
      stack: z.array(z.string().trim().min(1)).min(1),
      tags: z.array(z.string().trim().min(1)).default([]),
      demoUrl: httpsUrl.optional(),
      repoUrl: httpsUrl.optional(),
      cover: z
        .object({
          src: z
            .string()
            .trim()
            .regex(
              /^\/images\/projects\/[\w.-]+$/,
              'expected a path under public/images/projects/, such as /images/projects/example.png',
            ),
          alt: z.string().trim().min(1),
          width: z.number().int().positive(),
          height: z.number().int().positive(),
        })
        .strict()
        .optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      built: z.array(z.string().trim().min(1)).min(1),
      impact: z.array(z.string().trim().min(1)).min(1),
    })
    .strict(),
});

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z
    .object({
      title: z.string().trim().min(1),
      summary: z.string().trim().min(1),
      date: day,
      tags: z.array(z.string().trim().min(1)).min(1),
      cover: z
        .object({
          src: z
            .string()
            .trim()
            .regex(
              /^\/images\/posts\/[\w.-]+$/,
              'expected a path under public/images/posts/, such as /images/posts/example.png',
            ),
          alt: z.string().trim().min(1),
          width: z.number().int().positive(),
          height: z.number().int().positive(),
        })
        .strict()
        .optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    })
    .strict(),
});

export const collections = { work, projects, posts };
