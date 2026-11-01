import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useRouter } from '../lib/router';
import { apiService } from '../services/apiService';
import { ARTISANS } from '../data/mockData';
import type { CulturalExperience } from '../types';
import { sessionAvailability, todayInLagos } from '../lib/booking';
import { CraftFigure, ErrorBlock, PageIntro, formatNaira, formatSessionDate } from '../components/ui';

const CATEGORIES = ['Textiles', 'Beadwork', 'Pottery & Ceramics', 'Metalcraft & Bronze'];

function nextOpenDate(exp: CulturalExperience, today: string): string | null {
  const open = exp.sessions
    .filter((s) => sessionAvailability(s, today).state === 'open')
    .map((s) => s.date)
    .sort();
  return open[0] ?? null;
}

export const ExperiencesPage: React.FC = () => {
  const { query, setQuery } = useRouter();
  const q = query.get('q') ?? '';
  const category = query.get('category') ?? '';

  const [draft, setDraft] = useState(q);
  const [experiences, setExperiences] = useState<CulturalExperience[] | null>(null);
  const [searching, setSearching] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const latest = useRef(0);
  const today = useMemo(() => todayInLagos(), []);

  useEffect(() => setDraft((current) => (current.trim() === q ? current : q)), [q]);

  useEffect(() => {
    if (draft.trim() === q) return;
    const timer = window.setTimeout(() => setQuery({ q: draft.trim(), category }), 250);
    return () => window.clearTimeout(timer);
  }, [draft, q, category, setQuery]);

  useEffect(() => {
    const request = ++latest.current;
    setSearching(true);
    setLoadError(false);
    apiService
      .getExperiences(q, category)
      .then((data) => request === latest.current && setExperiences(data))
      .catch(() => request === latest.current && setLoadError(true))
      .finally(() => request === latest.current && setSearching(false));
  }, [q, category, attempt]);

  const active = Boolean(q || category);

  return (
    <div className="page">
      <PageIntro
        title="Experiences"
        lead="Sample workshop listings and a booking flow you can try. These sessions are not confirmed, and they say nothing about real artisan participation or pay."
      />

      <form role="search" onSubmit={(e) => { e.preventDefault(); setQuery({ q: draft.trim(), category }); }} className="grid grid-cols-[minmax(0,1fr)] gap-4 border-y border-rule py-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] md:items-end">
        <div>
          <label htmlFor="exp-q" className="field-label">Search workshops</label>
          <input id="exp-q" type="search" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Craft, maker or place" className="input" />
        </div>
        <div>
          <label htmlFor="exp-category" className="field-label">Category</label>
          <select id="exp-category" value={category} onChange={(e) => setQuery({ q, category: e.target.value })} className="input">
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button type="button" disabled={!active && !draft} onClick={() => { setDraft(''); setQuery({}); }} className="btn btn-quiet">
          Clear
        </button>
      </form>

      <p role="status" aria-live="polite" className="mt-4 flex min-h-6 items-center gap-2 text-[0.9375rem] text-ink-soft">
        {searching && <span className="spinner" aria-hidden="true" />}
        {experiences === null ? 'Loading sample workshops…' : `${experiences.length} sample workshop${experiences.length === 1 ? '' : 's'}`}
      </p>

      {loadError ? (
        <ErrorBlock title="The sample workshops did not load." onRetry={() => setAttempt((n) => n + 1)} />
      ) : experiences !== null && experiences.length === 0 ? (
        <div className="my-10 space-y-4">
          <h2 className="text-[2rem]">No sample workshop matches</h2>
          <button type="button" onClick={() => { setDraft(''); setQuery({}); }} className="btn btn-primary">Clear filters</button>
        </div>
      ) : (
        <ul aria-busy={searching} className={`mt-6 space-y-6 transition-opacity duration-200 ${searching && experiences ? 'opacity-60' : ''}`}>
          {(experiences ?? []).map((exp) => {
            const artisan = ARTISANS.find((a) => a.id === exp.artisanId);
            const next = nextOpenDate(exp, today);
            return (
              <li key={exp.id} className="grid grid-cols-[minmax(0,1fr)] gap-5 border-t border-rule pt-6 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,14rem)]">
                <CraftFigure craft={exp.craftKey} photo={exp.photo} className="aspect-[4/3]" />
                <div>
                  <p className="text-[0.9375rem] text-ink-soft">{exp.category}</p>
                  <h2 className="mt-1 text-[clamp(1.6rem,3vw,2.1rem)] leading-[1.02]">
                    <Link to={`/experiences/${exp.slug}`} className="no-underline hover:underline">{exp.title}</Link>
                  </h2>
                  <p className="measure mt-2 text-ink-soft">{exp.shortSummary}</p>
                  {artisan && <p className="mt-2 text-[0.9375rem]">With sample profile {artisan.displayName}</p>}
                </div>
                <dl className="definition-list content-start text-[0.9375rem] md:grid-cols-1 md:gap-1">
                  <dt>Length</dt>
                  <dd className="tnum md:mb-2">{exp.durationHours} hours</dd>
                  <dt>Sample price</dt>
                  <dd className="tnum md:mb-2">{formatNaira(exp.priceNaira)} a guest</dd>
                  <dt>Next date</dt>
                  <dd className="tnum">{next ? formatSessionDate(next) : 'No upcoming dates'}</dd>
                </dl>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
