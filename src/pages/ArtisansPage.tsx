import React, { useEffect, useRef, useState } from 'react';
import { Link, useRouter } from '../lib/router';
import { apiService } from '../services/apiService';
import type { ArtisanProfile } from '../types';
import { ErrorBlock, Monogram, PageIntro, VerificationMark } from '../components/ui';

const CRAFTS = ['Textiles', 'Weaving', 'Indigo Dyeing', 'Beadwork', 'Pottery & Ceramics', 'Metalcraft & Bronze'];
const AREAS = ['Lagos Island', 'Mainland', 'Lekki', 'Surulere', 'Ikeja'];

export const ArtisansPage: React.FC = () => {
  const { query, setQuery } = useRouter();
  const q = query.get('q') ?? '';
  const craft = query.get('craft') ?? '';
  const area = query.get('area') ?? '';

  const [draft, setDraft] = useState(q);
  const [artisans, setArtisans] = useState<ArtisanProfile[] | null>(null);
  const [searching, setSearching] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const latest = useRef(0);

  useEffect(() => setDraft((current) => (current.trim() === q ? current : q)), [q]);

  useEffect(() => {
    if (draft.trim() === q) return;
    const timer = window.setTimeout(() => setQuery({ q: draft.trim(), craft, area }), 250);
    return () => window.clearTimeout(timer);
  }, [draft, q, craft, area, setQuery]);

  useEffect(() => {
    const request = ++latest.current;
    setSearching(true);
    setLoadError(false);
    apiService
      .getArtisans(q, craft, area)
      .then((data) => request === latest.current && setArtisans(data))
      .catch(() => request === latest.current && setLoadError(true))
      .finally(() => request === latest.current && setSearching(false));
  }, [q, craft, area, attempt]);

  const active = Boolean(q || craft || area);

  return (
    <div className="page">
      <PageIntro
        title="Artisans"
        lead="Illustrative profiles for traditional craft disciplines. Names, stories, consent, workshop areas and availability are sample data and are not verified."
      />

      <form role="search" onSubmit={(e) => { e.preventDefault(); setQuery({ q: draft.trim(), craft, area }); }} className="grid grid-cols-[minmax(0,1fr)] gap-4 border-y border-rule py-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
        <div>
          <label htmlFor="artisan-q" className="field-label">Search makers</label>
          <input id="artisan-q" type="search" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Name, craft or area" className="input" />
        </div>
        <div>
          <label htmlFor="artisan-craft" className="field-label">Craft</label>
          <select id="artisan-craft" value={craft} onChange={(e) => setQuery({ q, craft: e.target.value, area })} className="input">
            <option value="">All crafts</option>
            {CRAFTS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="artisan-area" className="field-label">Area of Lagos</label>
          <select id="artisan-area" value={area} onChange={(e) => setQuery({ q, craft, area: e.target.value })} className="input">
            <option value="">All areas</option>
            {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <button type="button" disabled={!active && !draft} onClick={() => { setDraft(''); setQuery({}); }} className="btn btn-quiet">
          Clear
        </button>
      </form>

      <p role="status" aria-live="polite" className="mt-4 flex min-h-6 items-center gap-2 text-[0.9375rem] text-ink-soft">
        {searching && <span className="spinner" aria-hidden="true" />}
        {artisans === null ? 'Loading sample profiles…' : `${artisans.length} sample profile${artisans.length === 1 ? '' : 's'}`}
      </p>

      {loadError ? (
        <ErrorBlock title="The sample profiles did not load." onRetry={() => setAttempt((n) => n + 1)} />
      ) : artisans !== null && artisans.length === 0 ? (
        <div className="my-10 space-y-4">
          <h2 className="text-[2rem]">No sample profile matches</h2>
          <button type="button" onClick={() => { setDraft(''); setQuery({}); }} className="btn btn-primary">Clear filters</button>
        </div>
      ) : (
        <ul aria-busy={searching} className={`mt-4 divide-y divide-rule border-y border-rule transition-opacity duration-200 ${searching && artisans ? 'opacity-60' : ''}`}>
          {(artisans ?? []).map((artisan) => (
            <li key={artisan.id}>
              <Link
                to={`/artisans/${artisan.slug}`}
                className="group grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 py-6 no-underline md:grid-cols-[auto_minmax(0,1.2fr)_minmax(0,1fr)_auto] md:items-center"
              >
                <Monogram name={artisan.displayName} craft={artisan.craftKey} />
                <div>
                  {artisan.nativeTitle && <p className="text-[0.875rem] text-ink-soft">{artisan.nativeTitle}</p>}
                  <h2 className="text-[1.9rem] group-hover:underline">{artisan.displayName}</h2>
                  <p className="text-[0.9375rem]">{artisan.craft}</p>
                </div>
                <p className="col-start-2 text-[0.9375rem] text-ink-soft md:col-start-3">
                  {artisan.publicLocation}
                  <br />
                  <span className="tnum">{artisan.experienceYears} years of practice</span> (sample)
                </p>
                <div className="col-start-2 md:col-start-4">
                  <VerificationMark status={artisan.verificationStatus} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
