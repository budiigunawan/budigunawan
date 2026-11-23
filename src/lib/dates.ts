import { site } from '../config/site';

const monthYear = new Intl.DateTimeFormat(site.locale, {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const fullDate = new Intl.DateTimeFormat(site.locale, {
  day: 'numeric',
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

/** Formats a day-precision date as "Aug 8, 2024". */
export function formatFullDate(date: Date): string {
  return fullDate.format(date);
}

/** The machine-readable form of a day-precision date, for `<time datetime>`. */
export function dayDatetime(date: Date): string {
  return date.toISOString().slice(0, 10);
}
