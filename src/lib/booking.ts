import type { ExperienceSession } from '../types';

/** Sessions run in Lagos, so "today" is the calendar date in Africa/Lagos. */
export const SESSION_TIME_ZONE = 'Africa/Lagos';

/** Most guests one request may hold, whatever the session's capacity. */
export const MAX_GUESTS_PER_REQUEST = 4;

export type SessionState = 'open' | 'full' | 'past' | 'cancelled';

export interface SessionAvailability {
  state: SessionState;
  seatsLeft: number;
}

/** The calendar date (YYYY-MM-DD) of `now` in the sessions' time zone. */
export function todayInLagos(now: Date = new Date()): string {
  // en-CA formats dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: SESSION_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/**
 * Whether a session can still take a request. A session on today's date is
 * treated as closed: requests need at least a day's notice.
 */
export function sessionAvailability(
  session: ExperienceSession,
  today: string,
  extraBooked = 0,
): SessionAvailability {
  const seatsLeft = Math.max(0, session.capacity - session.bookedCount - extraBooked);
  if (session.status === 'cancelled') return { state: 'cancelled', seatsLeft };
  if (session.date <= today) return { state: 'past', seatsLeft };
  if (session.status === 'full' || seatsLeft === 0) return { state: 'full', seatsLeft: 0 };
  return { state: 'open', seatsLeft };
}

/** Largest guest count a request may choose for a session with `seatsLeft` seats. */
export function maxGuestsFor(seatsLeft: number): number {
  return Math.max(0, Math.min(MAX_GUESTS_PER_REQUEST, seatsLeft));
}

/** Keep a chosen guest count inside 1..maxGuestsFor(seatsLeft). */
export function clampGuests(requested: number, seatsLeft: number): number {
  const max = maxGuestsFor(seatsLeft);
  if (max === 0) return 1;
  if (!Number.isFinite(requested)) return 1;
  return Math.min(Math.max(1, Math.floor(requested)), max);
}

export type BookingCheck =
  | { ok: true }
  | { ok: false; reason: string };

/** Server-style validation of a request against the session's live state. */
export function checkBookingRequest(
  session: ExperienceSession | undefined,
  guests: number,
  today: string,
  extraBooked = 0,
): BookingCheck {
  if (!session) return { ok: false, reason: 'That session date no longer exists. Choose another date.' };
  const { state, seatsLeft } = sessionAvailability(session, today, extraBooked);
  if (state === 'past') return { ok: false, reason: 'That session date has passed. Choose an upcoming date.' };
  if (state === 'cancelled') return { ok: false, reason: 'That session was cancelled. Choose another date.' };
  if (state === 'full') return { ok: false, reason: 'That session is full. Choose another date.' };
  if (!Number.isInteger(guests) || guests < 1) return { ok: false, reason: 'Choose at least one guest.' };
  if (guests > maxGuestsFor(seatsLeft)) {
    return { ok: false, reason: `Only ${seatsLeft} seat${seatsLeft === 1 ? '' : 's'} left in that session. Lower the guest count.` };
  }
  return { ok: true };
}

const REFERENCE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // no 0/O or 1/I

/**
 * A short reference such as CL-BK-7K3Q-M9TD, drawn from the platform CSPRNG and
 * checked against references already issued in this browser.
 */
export function generateReference(prefix: string, taken: Iterable<string> = []): string {
  const used = new Set(taken);
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    const chars = Array.from(bytes, (b) => REFERENCE_ALPHABET[b % REFERENCE_ALPHABET.length]).join('');
    const reference = `${prefix}-${chars.slice(0, 4)}-${chars.slice(4)}`;
    if (!used.has(reference)) return reference;
  }
  throw new Error('Could not generate a unique reference.');
}
