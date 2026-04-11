import Papa from 'papaparse';
import rawCsv from '../../topnews.csv?raw';
import type { Article } from '../types';

interface CsvRow {
  days: string;
  titles: string;
  places: string;
  bylines: string;
  tags: string;
  urls: string;
}

function buildBody(row: CsvRow): string {
  const parts: string[] = [row.titles];
  if (row.places) parts.push(`Location: ${row.places.trim()}`);
  if (row.bylines) parts.push(row.bylines.trim());
  if (row.tags) parts.push(`Category: ${row.tags.trim()}`);
  return parts.join('\n\n');
}

const parsed = Papa.parse<CsvRow>(rawCsv, {
  header: true,
  skipEmptyLines: true,
});

export const SAMPLE_ARTICLES: Article[] = parsed.data
  .filter((row) => row.titles && row.titles.trim().length > 0)
  .slice(0, 50)
  .map((row, i) => ({
    id: `sample-${i}`,
    title: row.titles.replace(/^"|"$/g, '').trim(),
    body: buildBody(row),
    source: row.urls?.trim() || undefined,
    importedAt: new Date().toISOString(),
    savedWordIds: [],
  }));
