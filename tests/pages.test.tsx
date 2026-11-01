import { dom } from './setup/dom';
import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import App from '../src/App';
import { apiService } from '../src/services/apiService';

let root: Root;
let container: HTMLElement;

async function waitFor(check: () => boolean, label: string, timeout = 3000) {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeout) throw new Error(`Timed out waiting for: ${label}`);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 20));
    });
  }
}

async function go(hash: string) {
  await act(async () => {
    window.location.hash = hash;
    await new Promise((r) => setTimeout(r, 0));
    window.dispatchEvent(new dom.window.HashChangeEvent('hashchange'));
  });
}

const text = () => container.textContent ?? '';
const section = (headingId: string) => document.getElementById(headingId)?.closest('section')?.textContent ?? '';

beforeEach(async () => {
  localStorage.clear();
  window.location.hash = '';
  container = document.getElementById('root')!;
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
});

test('moving between records does not carry over the previous record’s state', async () => {
  window.location.hash = '#/culture/aso-oke-weaving';
  await act(async () => root.render(<App />));
  await waitFor(() => section('related-makers').includes('Babatunde Adeyemi'), 'aso-oke linked maker');

  // Open the correction form on the first record.
  const toggle = [...container.querySelectorAll('button')].find((b) => b.textContent === 'Suggest a correction')!;
  await act(async () => toggle.click());
  assert.ok(document.getElementById('correction-note'), 'correction form opens');

  // Uli has no linked makers. The old page kept showing the previous record's makers.
  await go('#/culture/uli-mural-and-body-art');
  await waitFor(() => text().includes('Ụlị'), 'uli record');
  assert.match(section('related-makers'), /No sample profile is linked/);
  assert.doesNotMatch(section('related-makers'), /Babatunde/);
  assert.equal(document.getElementById('correction-note'), null, 'correction form starts closed');
});

test('past workshop dates are shown but cannot be chosen', async () => {
  window.location.hash = '#/experiences/asooke-loom-workshop';
  await act(async () => root.render(<App />));
  await waitFor(() => text().includes('Request a place'), 'booking form');

  const radios = [...container.querySelectorAll<HTMLInputElement>('input[name="session"]')];
  assert.equal(radios.length, 3);
  // Every fixture date is on or before 2026-11-01, so nothing is open after that day.
  if (new Date() >= new Date('2026-11-01T00:00:00+01:00')) {
    assert.ok(radios.every((r) => r.disabled), 'all past sessions are disabled');
    assert.match(text(), /Date passed/);
    const submit = container.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    assert.equal(submit.disabled, true);
  }
  // The date picker is a real group with a legend.
  assert.equal(container.querySelector('fieldset legend')?.textContent, 'Date');
});

test('the Discover search lives in the URL and filters by category', async () => {
  const expected = (await apiService.getCulturalRecords('indigo')).length;
  window.location.hash = '#/discover?q=indigo';
  await act(async () => root.render(<App />));
  await waitFor(() => text().includes(`${expected} of 6 sample records match`), 'indigo matches');
  assert.equal((document.getElementById('discover-q') as HTMLInputElement).value, 'indigo');
  assert.equal(container.querySelectorAll('main ul[aria-busy] > li').length, expected);

  const select = document.getElementById('discover-category') as HTMLSelectElement;
  assert.ok([...select.options].some((o) => o.value === 'Woodcarving'), 'Woodcarving is offered');
});

test('booking a seat updates the count and later requests respect it', async () => {
  const today = '2026-10-01';
  const before = await apiService.getExperienceBySlug('asooke-loom-workshop');
  const s1 = before!.sessions.find((s) => s.id === 'sess_aso_01')!;
  assert.equal(s1.bookedCount, 3);

  const { booking } = await apiService.createBookingRequest(
    { experienceId: before!.id, sessionId: 'sess_aso_01', participantCount: 2, guestName: 'A', guestEmail: 'a@example.invalid', guestPhone: '0000000' },
    today,
  );
  assert.match(booking.reference, /^CL-BK-/);

  const after = await apiService.getExperienceBySlug('asooke-loom-workshop');
  assert.equal(after!.sessions.find((s) => s.id === 'sess_aso_01')!.bookedCount, 5);

  await assert.rejects(
    apiService.createBookingRequest(
      { experienceId: before!.id, sessionId: 'sess_aso_01', participantCount: 2, guestName: 'B', guestEmail: 'b@example.invalid', guestPhone: '0000000' },
      today,
    ),
    /Only 1 seat left/,
  );
  await assert.rejects(
    apiService.createBookingRequest(
      { experienceId: before!.id, sessionId: 'sess_aso_01', participantCount: 1, guestName: 'C', guestEmail: 'c@example.invalid', guestPhone: '0000000' },
      '2026-11-01',
    ),
    /has passed/,
  );
});
