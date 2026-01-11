import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import type { Trip } from './types';

export function encodeTripToUrl(trip: Trip): string {
  const json = JSON.stringify(trip);
  const compressed = compressToEncodedURIComponent(json);
  return compressed;
}

export function decodeTripFromUrl(encoded: string): Trip | null {
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    return JSON.parse(json) as Trip;
  } catch {
    return null;
  }
}

export function getTripFromHash(): Trip | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.slice(1); // Remove the #
  if (!hash) return null;
  return decodeTripFromUrl(hash);
}

export function updateUrlHash(trip: Trip): void {
  if (typeof window === 'undefined') return;
  const encoded = encodeTripToUrl(trip);
  const newUrl = `${window.location.pathname}#${encoded}`;
  window.history.replaceState(null, '', newUrl);
}

export function getShareableUrl(trip: Trip): string {
  const encoded = encodeTripToUrl(trip);
  if (typeof window === 'undefined') return `/trip#${encoded}`;
  return `${window.location.origin}/trip#${encoded}`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
