import { describe, expect, it } from 'vitest';
import {
  createContentQueries,
  type ExperienceEntry,
} from '../../src/lib/content/query';

function experience(
  overrides: Partial<ExperienceEntry['data']> & { id?: string } = {},
): ExperienceEntry {
  const { id = 'role', ...data } = overrides;

  return {
    id,
    data: {
      company: 'A Company',
      title: 'Engineer',
      startDate: new Date('2020-01-01'),
      highlights: [],
      ...data,
    },
  };
}

describe('Experience timeline', () => {
  it('shows ongoing roles before past roles', () => {
    const content = createContentQueries(
      {
        posts: [],
        experience: [
          experience({
            id: 'ongoing-since-2018',
            startDate: new Date('2018-06-01'),
          }),
          experience({
            id: 'past-2020-2022',
            startDate: new Date('2020-01-01'),
            endDate: new Date('2022-01-01'),
          }),
          experience({
            id: 'past-2015-2017',
            startDate: new Date('2015-01-01'),
            endDate: new Date('2017-01-01'),
          }),
        ],
      },
      'production',
    );

    expect(content.experienceTimeline.map((entry) => entry.id)).toEqual([
      'ongoing-since-2018',
      'past-2020-2022',
      'past-2015-2017',
    ]);
  });

  it('orders multiple ongoing roles by start date, newest first', () => {
    const content = createContentQueries(
      {
        posts: [],
        experience: [
          experience({ id: 'ongoing-older', startDate: new Date('2019-02-01') }),
          experience({ id: 'ongoing-newer', startDate: new Date('2023-05-01') }),
        ],
      },
      'production',
    );

    expect(content.experienceTimeline.map((entry) => entry.id)).toEqual([
      'ongoing-newer',
      'ongoing-older',
    ]);
  });

  it('orders past roles by start date, newest first', () => {
    const content = createContentQueries(
      {
        posts: [],
        experience: [
          experience({
            id: 'past-2017-2019',
            startDate: new Date('2017-09-01'),
            endDate: new Date('2019-06-01'),
          }),
          experience({
            id: 'past-2014-2016',
            startDate: new Date('2014-01-01'),
            endDate: new Date('2016-12-01'),
          }),
          experience({
            id: 'past-2020-2021',
            startDate: new Date('2020-01-01'),
            endDate: new Date('2021-03-01'),
          }),
        ],
      },
      'production',
    );

    expect(content.experienceTimeline.map((entry) => entry.id)).toEqual([
      'past-2020-2021',
      'past-2017-2019',
      'past-2014-2016',
    ]);
  });
});
