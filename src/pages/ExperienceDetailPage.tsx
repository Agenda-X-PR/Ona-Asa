import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useRouter } from '../lib/router';
import { apiService } from '../services/apiService';
import type { ArtisanProfile, BookingRecord, CulturalExperience } from '../types';
import { clampGuests, maxGuestsFor, sessionAvailability, todayInLagos, type SessionState } from '../lib/booking';
import { CraftFigure, ErrorBlock, Loading, formatNaira, formatSessionDate } from '../components/ui';

const STATE_TEXT: Record<SessionState, string> = {
  open: '',
  full: 'Full',
  past: 'Date passed',
  cancelled: 'Cancelled',
};

export const ExperienceDetailPage: React.FC = () => {
  const { params } = useRouter();
  const slug = params.slug;
  const today = useMemo(() => todayInLagos(), []);

  const [experience, setExperience] = useState<CulturalExperience | null>(null);
  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const [sessionId, setSessionId] = useState('');
  const [guests, setGuests] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingRecord | null>(null);

  const load = React.useCallback(async () => {
    if (!slug) return { exp: null, art: null };
    const exp = await apiService.getExperienceBySlug(slug);
    const [art] = exp ? await apiService.getArtisansByIds([exp.artisanId]) : [];
    return { exp, art: art ?? null };
  }, [slug]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);
    load()
      .then(({ exp, art }) => {
        if (!active) return;
        setExperience(exp);
        setArtisan(art);
        const firstOpen = exp?.sessions.find((s) => sessionAvailability(s, today).state === 'open');
        setSessionId(firstOpen?.id ?? '');
      })
      .catch(() => active && setLoadError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [load, today, attempt]);

  const sessions = useMemo(
    () => (experience?.sessions ?? []).map((s) => ({ session: s, ...sessionAvailability(s, today) })),
    [experience, today],
  );
  const selected = sessions.find((s) => s.session.id === sessionId);
  const seatsLeft = selected?.state === 'open' ? selected.seatsLeft : 0;
  const maxGuests = maxGuestsFor(seatsLeft);
  const anyOpen = sessions.some((s) => s.state === 'open');

  // Keep the guest count valid when the chosen session has fewer seats.
  useEffect(() => {
    setGuests((current) => clampGuests(current, seatsLeft));
  }, [seatsLeft]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    if (!experience) return;
    if (!selected || selected.state !== 'open') return setFormError('Choose an upcoming date with free seats.');
    if (!guestName.trim()) return setFormError('Enter a name for the request.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail.trim())) return setFormError('Enter an email address such as demo@example.invalid.');
    if (guestPhone.replace(/\D/g, '').length < 7) return setFormError('Enter a phone number with at least 7 digits.');

    setSubmitting(true);
    try {
      const result = await apiService.createBookingRequest({
        experienceId: experience.id,
        sessionId: selected.session.id,
        participantCount: guests,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        specialRequests: note.trim() || undefined,
      });
      setBooking(result.booking);
      // Reload so seat counts include this request.
      const fresh = await load();
      setExperience(fresh.exp);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'The request was not saved. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page"><Loading label="Loading the sample workshop…" /></div>;
  if (loadError) return <div className="page"><ErrorBlock title="This sample workshop did not load." onRetry={() => setAttempt((n) => n + 1)} /></div>;
  if (!experience) {
    return (
      <div className="page py-16">
        <h1 className="text-[clamp(2.5rem,6vw,4rem)]">No workshop at this address</h1>
        <p className="mt-3 text-ink-soft">No sample workshop matches this link.</p>
        <Link to="/experiences" className="btn btn-primary mt-6">See all workshops</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="pt-8">
        <Link to="/experiences" className="inline-flex items-center gap-2 text-[0.9375rem] text-ink-soft no-underline hover:text-ink hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All workshops
        </Link>
      </div>

      <header className="pt-8 pb-8">
        <p className="text-ink-soft">{experience.category}, {experience.craft}</p>
        <h1 className="measure mt-3 text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.95]">{experience.title}</h1>
        {artisan && (
          <p className="mt-4">
            With the sample profile{' '}
            <Link to={`/artisans/${artisan.slug}`} className="link">{artisan.displayName}</Link>
            <span className="text-ink-soft"> (not verified)</span>
          </p>
        )}
      </header>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-14">
        <div className="space-y-10">
          <CraftFigure craft={experience.craftKey} photo={experience.photo} size="large" caption priority className="aspect-[16/10]" />

          <section aria-labelledby="about-workshop">
            <h2 id="about-workshop" className="text-[2rem]">About the workshop</h2>
            <p className="measure mt-4 leading-[1.75]">{experience.description}</p>
          </section>

          <section aria-labelledby="expect">
            <h2 id="expect" className="text-[2rem]">What happens</h2>
            <ol className="measure mt-4 list-decimal space-y-2 pl-6 marker:text-brass">
              {experience.whatToExpect.map((item) => <li key={item}>{item}</li>)}
            </ol>
          </section>

          <section aria-labelledby="materials">
            <h2 id="materials" className="text-[2rem]">Materials provided</h2>
            <ul className="measure mt-4 list-disc space-y-2 pl-6 marker:text-brass">
              {experience.materialsProvided.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <dl className="definition-list measure border-t border-rule pt-6">
            <dt>Meeting point</dt>
            <dd>{experience.locationMeetingPoint}</dd>
            <dt>Length</dt>
            <dd className="tnum">{experience.durationHours} hours</dd>
            <dt>Cancellation</dt>
            <dd>{experience.cancellationPolicy}</dd>
          </dl>
        </div>

        <section aria-labelledby="request-title" className="lg:sticky lg:top-24 lg:self-start">
          <div className="plaque nails p-5 sm:p-7">
            <h2 id="request-title" className="text-[2rem]">Request a place</h2>
            <p className="mt-1 tnum">
              <span className="display text-[1.9rem]">{formatNaira(experience.priceNaira)}</span>{' '}
              <span className="text-ink-soft">a guest, sample price</span>
            </p>

            {booking ? (
              <div role="status" className="rise mt-5 space-y-4">
                <h3 className="text-[1.6rem]">Demo request saved in this browser</h3>
                <p className="display text-[1.6rem] tracking-[0.03em] tnum">{booking.reference}</p>
                <dl className="definition-list text-[0.9375rem]">
                  <dt>Date</dt>
                  <dd>{formatSessionDate(booking.sessionDate)}, {booking.sessionTime}</dd>
                  <dt>Guests</dt>
                  <dd className="tnum">{booking.participantCount}</dd>
                  <dt>Sample total</dt>
                  <dd className="tnum">{formatNaira(booking.totalAmountNaira)}</dd>
                </dl>
                <p className="notice">Nothing went to an artisan or a booking service. No seat is held and no payment was taken.</p>
                <div className="flex flex-wrap gap-2">
                  <Link to="/bookings" query={{ ref: booking.reference }} className="btn btn-primary">Look up this request</Link>
                  <button type="button" onClick={() => setBooking(null)} className="btn btn-quiet">Make another request</button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="mt-5 space-y-5">
                <p className="notice">Demo form. Requests stay in this browser and no payment provider is contacted. Use placeholder details.</p>

                {formError && (
                  <p role="alert" className="notice notice-error">{formError}</p>
                )}

                <fieldset>
                  <legend className="field-label">Date</legend>
                  {!anyOpen && (
                    <p className="mb-3 text-[0.9375rem] text-ink-soft">
                      No upcoming sample dates. Every listed date has passed or is full.
                    </p>
                  )}
                  <div className="space-y-2">
                    {sessions.map(({ session, state, seatsLeft: left }) => (
                      <label key={session.id} className="choice">
                        <input
                          type="radio"
                          name="session"
                          value={session.id}
                          checked={sessionId === session.id}
                          disabled={state !== 'open'}
                          onChange={() => setSessionId(session.id)}
                        />
                        <span className="flex-1">
                          <span className="block font-semibold tnum">{formatSessionDate(session.date)}</span>
                          <span className="block text-[0.9375rem] text-ink-soft tnum">{session.time}</span>
                        </span>
                        <span className="text-[0.9375rem] text-ink-soft tnum">
                          {state === 'open' ? `${left} seat${left === 1 ? '' : 's'} left` : STATE_TEXT[state]}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset disabled={!anyOpen} className="space-y-4 disabled:opacity-60">
                  <legend className="sr-only">Your details</legend>
                  <div>
                    <label htmlFor="guests" className="field-label">Guests</label>
                    <select id="guests" value={guests} onChange={(e) => setGuests(clampGuests(Number(e.target.value), seatsLeft))} disabled={maxGuests === 0} className="input tnum">
                      {Array.from({ length: Math.max(1, maxGuests) }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} guest{n === 1 ? '' : 's'}, {formatNaira(experience.priceNaira * n)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="guest-name" className="field-label">Name</label>
                    <input id="guest-name" required value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Sample Guest" autoComplete="off" className="input" />
                  </div>
                  <div>
                    <label htmlFor="guest-email" className="field-label">Email</label>
                    <input id="guest-email" type="email" required value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="demo@example.invalid" autoComplete="off" className="input" />
                  </div>
                  <div>
                    <label htmlFor="guest-phone" className="field-label">Phone</label>
                    <input id="guest-phone" type="tel" required value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="+234 000 000 0000" autoComplete="off" className="input" />
                  </div>
                  <div>
                    <label htmlFor="guest-note" className="field-label">Note (optional)</label>
                    <textarea id="guest-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} aria-describedby="guest-note-hint" className="input" />
                    <span id="guest-note-hint" className="field-hint">No real or sensitive details.</span>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-rule pt-4">
                    <span className="text-ink-soft">Sample total, not payable</span>
                    <span className="display text-[1.6rem] tnum">{formatNaira(experience.priceNaira * guests)}</span>
                  </div>

                  <button type="submit" disabled={submitting || !selected || selected.state !== 'open'} className="btn btn-primary w-full">
                    {submitting ? <><span className="spinner" aria-hidden="true" /> Saving the request…</> : 'Save demo request'}
                  </button>
                </fieldset>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
