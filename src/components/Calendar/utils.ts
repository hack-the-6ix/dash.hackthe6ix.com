import { CSSProperties } from "react";

// TODO: Give better typing
export type Day = `${number}-${number}-${number}`;
export type Time = `${number}:${number}`;

function getDateComponents(date: Date) {
  return {
    Y: date.getFullYear(),
    M: date.getMonth() + 1,
    D: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
  };
}

export function getCol(startDate: Date, date: Date) {
  const { D: sD } = getDateComponents(startDate);
  const { D, h, m } = getDateComponents(date);
  return ((D - sD) * 48) + (h * 2) + (m ? 1 : 0);
}

export function getNow(startDate: Date, now = new Date()) {
  const { D: sD } = getDateComponents(startDate);
  const { D, h, m } = getDateComponents(now);
  return ((D - sD) * 24) + h + (m / 60);
}

export function serializeDate(date: Date): Day {
  const { Y, M, D } = getDateComponents(date);
  return `${Y}-${M.toString(10).padStart(2, '0')}-${D.toString(10).padStart(2, '0')}` as any;
}

export function formatDate(locale: string, timeZone: string | null): (date: Date) => string;
export function formatDate(locale: string, timeZone: string | null, date: Date): string;
export function formatDate(locale: string, timeZone: string | null, date?: Date) {
  const { format } = new Intl.DateTimeFormat(locale, {
    timeZone: timeZone ?? undefined,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const action = (date: Date) => `${format(date)}${getOrdinal(date)}`;
  if (date) return action(date);
  return action;
}

export function getOrdinal(date: Date) {
  const i = date.getDate() % 10;
  switch (i) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

export function applyPosition(col: number, row: number, colSpan?: number, rowSpan?: number ) {
  return { '--c': col, '--r': row, '--cs': colSpan, '--rs': rowSpan } as CSSProperties;
}

export function repeat<T>(iterations: number, fill: (idx: number) => T) {
  const res = [];
  for (let i = 0; i < iterations; i++) {
    res.push(fill(i));
  }
  return res;
}