import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The single authority on content shape. A Work Entry is one employment
 * relationship; its body records responsibilities, never Projects. An absent
 * end date means the role is current.
 */
const month = z
  .string()
  .trim()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'expected a month in YYYY-MM form, such as 2023-09')
  .transform((value) => new Date(`${value}-01T00:00:00Z`));

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

export const collections = { work };
