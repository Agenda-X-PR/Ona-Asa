import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MAX_GUESTS_PER_REQUEST,
  checkBookingRequest,
  clampGuests,
  generateReference,
  maxGuestsFor,
  sessionAvailability,
  todayInLagos,
} from '../src/lib/booking';
import type { ExperienceSession } from '../src/types';

const session = (overrides: Partial<ExperienceSession> = {}): ExperienceSession => ({
  id: 's1',
  date: '2026-11-10',
  time: '10:00 AM',
  capacity: 6,
  bookedCount: 3,
  status: 'available',
  ...overrides,
});

test('a session dated before or on today is past, not bookable', () => {
  assert.equal(sessionAvailability(session({ date: '2026-10-18' }), '2026-11-01').state, 'past');
  assert.equal(sessionAvailability(session({ date: '2026-11-01' }), '2026-11-01').state, 'past');
  assert.equal(sessionAvailability(session({ date: '2026-11-02' }), '2026-11-01').state, 'open');
  const check = checkBookingRequest(session({ date: '2026-10-18' }), 1, '2026-11-01');
  assert.equal(check.ok, false);
});

test('seats left counts fixture bookings plus this browser’s requests', () => {
  assert.deepEqual(sessionAvailability(session(), '2026-11-01'), { state: 'open', seatsLeft: 3 });
  assert.deepEqual(sessionAvailability(session(), '2026-11-01', 3), { state: 'full', seatsLeft: 0 });
  assert.equal(sessionAvailability(session({ status: 'full' }), '2026-11-01').state, 'full');
  assert.equal(sessionAvailability(session({ status: 'cancelled' }), '2026-11-01').state, 'cancelled');
});

test('guest count is clamped to the seats left and the per-request cap', () => {
  assert.equal(maxGuestsFor(10), MAX_GUESTS_PER_REQUEST);
  assert.equal(maxGuestsFor(2), 2);
  assert.equal(clampGuests(4, 2), 2);
  assert.equal(clampGuests(0, 3), 1);
  assert.equal(clampGuests(Number.NaN, 3), 1);
  assert.equal(clampGuests(3, 0), 1);
});

test('requests over the seats left are refused with a reason', () => {
  const tight = session({ bookedCount: 5 });
  assert.deepEqual(checkBookingRequest(tight, 1, '2026-11-01'), { ok: true });
  const over = checkBookingRequest(tight, 2, '2026-11-01');
  assert.equal(over.ok, false);
  assert.match(over.ok ? '' : over.reason, /Only 1 seat left/);
  assert.equal(checkBookingRequest(undefined, 1, '2026-11-01').ok, false);
});

test('today is computed in Lagos time', () => {
  // 23:30 UTC on 31 Oct is already 1 Nov in Lagos (UTC+1).
  assert.equal(todayInLagos(new Date('2026-10-31T23:30:00Z')), '2026-11-01');
});

test('references are well formed and avoid ones already issued', () => {
  const ref = generateReference('CL-BK');
  assert.match(ref, /^CL-BK-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/);
  const many = new Set(Array.from({ length: 500 }, () => generateReference('CL-BK')));
  assert.equal(many.size, 500);
});
