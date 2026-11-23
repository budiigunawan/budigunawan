import { site } from '../config/site';

const monthYear = new Intl.DateTimeFormat(site.locale, {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Formats a month-precision date as "Sep 2023". */
export function formatMonthYear(date: Date): string {
  return monthYear.format(date);
}

/** The machine-readable form of a month-precision date, for `<time datetime>`. */
export function monthDatetime(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}
