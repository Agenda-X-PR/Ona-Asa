import React, { useEffect, useState } from 'react';
import { useRouter } from '../lib/router';
import { apiService } from '../services/apiService';
import type { BookingRecord } from '../types';
import { PageIntro, formatNaira, formatSessionDate } from '../components/ui';

export const BookingsPage: React.FC = () => {
  const { query, setQuery } = useRouter();
  const ref = query.get('ref') ?? '';
  const [input, setInput] = useState(ref);
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');

  useEffect(() => {
    if (!ref) {
      setState('idle');
      return;
    }
    let active = true;
    setState('loading');
    apiService
      .lookupBooking(ref)
      .catch(() => null)
      .then((result) => {
        if (!active) return;
        setBooking(result);
        setState('done');
      });
    return () => {
      active = false;
    };
  }, [ref]);

  return (
    <div className="page max-w-3xl">
      <PageIntro
        title="Find a demo request"
        lead="Look up a sample booking request made in this browser. This page cannot confirm a real reservation or payment."
      />

      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery({ ref: input.trim().toUpperCase() });
        }}
        className="border-y border-rule py-5"
      >
        <label htmlFor="booking-ref" className="field-label">Reference</label>
        <div className="flex gap-2">
          <input
            id="booking-ref"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="CL-BK-XXXX-XXXX"
            aria-describedby="booking-ref-hint"
            className="input tnum uppercase"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" disabled={!input.trim() || state === 'loading'} className="btn btn-primary shrink-0">
            Look up
          </button>
        </div>
        <span id="booking-ref-hint" className="field-hint">Only requests saved in this browser can be found. There are no pre-made references.</span>
      </form>

      <div aria-live="polite" className="mt-8">
        {state === 'loading' && <p role="status" className="flex items-center gap-2 text-ink-soft"><span className="spinner" aria-hidden="true" /> Checking this browser…</p>}
        {state === 'done' && booking && (
          <article className="plaque nails rise p-5 sm:p-7">
            <p className="text-ink-soft">Reference</p>
            <h2 className="text-[clamp(1.8rem,5vw,2.6rem)] tracking-[0.03em] tnum">{booking.reference}</h2>
            <p className="mt-2">Sample state: pending request. This is not a confirmed reservation.</p>
            <dl className="definition-list mt-6">
              <dt>Workshop</dt>
              <dd>{booking.experienceTitle}</dd>
              <dt>Led by</dt>
              <dd>{booking.artisanName} (sample profile)</dd>
              <dt>Date</dt>
              <dd className="tnum">{formatSessionDate(booking.sessionDate)}, {booking.sessionTime}</dd>
              <dt>Guests</dt>
              <dd className="tnum">{booking.participantCount}</dd>
              <dt>Sample total</dt>
              <dd className="tnum">{formatNaira(booking.totalAmountNaira)}</dd>
              <dt>Contact</dt>
              <dd>Hidden on this page</dd>
            </dl>
            <p className="notice mt-6">No payment was started or received. The payment field in the sample data reads "{booking.paymentStatus}".</p>
          </article>
        )}
        {state === 'done' && !booking && (
          <div className="rise space-y-2">
            <h2 className="text-[2rem]">No request with that reference</h2>
            <p className="text-ink-soft">This browser has no saved demo request called "{ref}". Check the reference, or make a request from a workshop page.</p>
          </div>
        )}
      </div>
    </div>
  );
};
