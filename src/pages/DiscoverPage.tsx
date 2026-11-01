import React, { useEffect, useRef, useState } from 'react';
import { Link, useRouter } from '../lib/router';
import { apiService } from '../services/apiService';
import { CULTURAL_RECORDS } from '../data/mockData';
import { RECORD_CATEGORIES, type CulturalRecord, type CulturalRecordStatus } from '../types';
import { CRAFT_NAMES, Motif } from '../components/Motif';
import { ErrorBlock, PageIntro, StatusMark, statusText } from '../components/ui';

const STATUSES: CulturalRecordStatus[] = ['documented', 'community_reviewed', 'under_review', 'disputed'];
const SEARCH_DELAY_MS = 250;

export const DiscoverPage: React.FC = () => {
  const { query, setQuery } = useRouter();
  const q = query.get('q') ?? '';
  const category = query.get('category') ?? '';
  const status = query.get('status') ?? '';

  // The text box updates immediately; the URL (and the search) follow after a short pause.
  const [draft, setDraft] = useState(q);
  const [records, setRecords] = useState<CulturalRecord[] | null>(null);
  const [searching, setSearching] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const latestRequest = useRef(0);

  // Keep the box in step when the URL changes from outside (back button, topic link).
  useEffect(() => setDraft((current) => (current.trim() === q ? current : q)), [q]);

  useEffect(() => {
    if (draft.trim() === q) return;
    const timer = window.setTimeout(() => setQuery({ q: draft.trim(), category, status }), SEARCH_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [draft, q, category, status, setQuery]);

  useEffect(() => {
    const request = ++latestRequest.current;
    setSearching(true);
    setLoadError(false);
    apiService
      .getCulturalRecords(q, category, status)
      .then((data) => {
        if (request !== latestRequest.current) return;
        setRecords(data);
      })
      .catch(() => {
        if (request === latestRequest.current) setLoadError(true);
      })
      .finally(() => {
        if (request === latestRequest.current) setSearching(false);
      });
  }, [q, category, status, attempt]);

  const filtersActive = Boolean(q || category || status);
  const reset = () => {
    setDraft('');
    setQuery({});
  };

  return (
    <div className="page">
      <PageIntro
        title="Discover"
        lead="Search the sample records by craft, community, region or technique. Their citations and claims have not been independently verified."
      />

      <form role="search" onSubmit={(e) => { e.preventDefault(); setQuery({ q: draft.trim(), category, status }); }} className="grid grid-cols-[minmax(0,1fr)] gap-4 border-y border-rule py-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
        <div>
          <label htmlFor="discover-q" className="field-label">Search records</label>
          <input
            id="discover-q"
            type="search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Aso-oke, indigo, Benin…"
            className="input"
          />
        </div>
        <div>
          <label htmlFor="discover-category" className="field-label">Category</label>
          <select id="discover-category" value={category} onChange={(e) => setQuery({ q, category: e.target.value, status })} className="input">
            <option value="">All categories</option>
            {RECORD_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="discover-status" className="field-label">Sample label</label>
          <select id="discover-status" value={status} onChange={(e) => setQuery({ q, category, status: e.target.value })} className="input">
            <option value="">Any label</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{statusText(s)}</option>
            ))}
          </select>
        </div>
        <button type="button" onClick={reset} disabled={!filtersActive && !draft} className="btn btn-quiet">
          Clear
        </button>
      </form>

      <p role="status" aria-live="polite" className="mt-4 flex min-h-6 items-center gap-2 text-[0.9375rem] text-ink-soft">
        {searching && <span className="spinner" aria-hidden="true" />}
        {records === null
          ? 'Loading sample records…'
          : `${records.length} of ${CULTURAL_RECORDS.length} sample records${filtersActive ? ' match' : ''}`}
      </p>

      {loadError ? (
        <ErrorBlock title="The sample records did not load." onRetry={() => setAttempt((n) => n + 1)} />
      ) : records !== null && records.length === 0 ? (
        <div className="my-10 max-w-xl space-y-4">
          <h2 className="text-[2rem]">No sample record matches</h2>
          <p className="text-ink-soft">The sample records do not mention these terms. Clear the filters, or propose the topic on the contribution form.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={reset} className="btn btn-primary">Clear filters</button>
            <Link to="/contribute" className="btn btn-quiet">Propose this topic</Link>
          </div>
        </div>
      ) : (
        <ul
          aria-busy={searching}
          className={`mt-6 grid gap-5 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3 ${searching && records ? 'opacity-60' : ''}`}
        >
          {(records ?? []).map((record) => (
            <li key={record.id}>
              <Link to={`/culture/${record.slug}`} className="plaque-link h-full">
                <article className="plaque nails flex h-full flex-col p-2.5">
                  <div className="motif-field aspect-[16/9] rounded-[2px]">
                    <Motif craft={record.craftKey} />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 px-1.5 pt-4 pb-2">
                    <p className="text-[0.875rem] text-ink-soft">
                      {record.category}, {record.region.split('(')[0].trim()}
                    </p>
                    <h2 className="plaque-title text-[1.6rem]">{record.title}</h2>
                    {record.nativeName && <p className="text-[0.9375rem] italic">{record.nativeName}</p>}
                    <p className="line-clamp-3 text-[0.9375rem] text-ink-soft">{record.shortDescription}</p>
                    <div className="mt-auto pt-2">
                      <StatusMark status={record.status} />
                    </div>
                  </div>
                  <span className="sr-only">{CRAFT_NAMES[record.craftKey]}</span>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-12 text-ink-soft">
        Missing a regional variant?{' '}
        <Link to="/contribute" className="link">Suggest it on the contribution form</Link>.
      </p>
    </div>
  );
};
