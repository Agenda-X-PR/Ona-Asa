import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Link2 } from 'lucide-react';
import { Link, useRouter } from '../lib/router';
import { apiService } from '../services/apiService';
import type { ArtisanProfile, CulturalRecord } from '../types';
import { CRAFT_NAMES } from '../components/Motif';
import { CraftFigure, ErrorBlock, Loading, Monogram, SensitivityText, StatusMark, statusText } from '../components/ui';

const SOURCE_TYPE: Record<string, string> = {
  oral_history: 'Oral history',
  academic_archive: 'Academic archive',
  community_elder: 'Community elder',
  museum_catalogue: 'Museum catalogue',
  fieldwork: 'Fieldwork',
};

export const CultureDetailPage: React.FC = () => {
  const { params } = useRouter();
  const slug = params.slug;

  const [record, setRecord] = useState<CulturalRecord | null>(null);
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [correctionNote, setCorrectionNote] = useState('');
  const [correctionShown, setCorrectionShown] = useState(false);
  const [copied, setCopied] = useState<'idle' | 'copied' | 'failed'>('idle');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);
    setArtisans([]);
    (async () => {
      if (!slug) return null;
      const rec = await apiService.getCulturalRecordBySlug(slug);
      const related = rec ? await apiService.getArtisansByIds(rec.relatedArtisanIds) : [];
      return { rec, related };
    })()
      .then((result) => {
        if (!active) return;
        setRecord(result?.rec ?? null);
        setArtisans(result?.related ?? []);
      })
      .catch(() => active && setLoadError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug, attempt]);

  useEffect(() => {
    if (copied === 'idle') return;
    const timer = window.setTimeout(() => setCopied('idle'), 2500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied('copied');
    } catch {
      setCopied('failed');
    }
  };

  if (loading) return <div className="page"><Loading label="Loading the sample record…" /></div>;
  if (loadError) return <div className="page"><ErrorBlock title="This sample record did not load." onRetry={() => setAttempt((n) => n + 1)} /></div>;
  if (!record) {
    return (
      <div className="page py-16">
        <h1 className="text-[clamp(2.5rem,6vw,4rem)]">No record at this address</h1>
        <p className="mt-3 text-ink-soft">No sample record matches this link.</p>
        <Link to="/discover" className="btn btn-primary mt-6">Browse all records</Link>
      </div>
    );
  }

  const [mainTitle, subTitle] = record.title.split(/:\s*/);

  return (
    <article className="page">
      <div className="flex flex-wrap items-center justify-between gap-3 pt-8">
        <Link to="/discover" className="inline-flex items-center gap-2 text-[0.9375rem] text-ink-soft no-underline hover:text-ink hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All records
        </Link>
        <button type="button" onClick={copyLink} className="btn btn-quiet min-h-10 py-1.5 text-[0.875rem]">
          {copied === 'copied' ? <Check className="h-4 w-4" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
          {copied === 'copied' ? 'Link copied' : copied === 'failed' ? 'Copy blocked; use the address bar' : 'Copy link'}
        </button>
      </div>

      <header className="grid grid-cols-[minmax(0,1fr)] gap-8 pt-8 pb-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
        <div>
          <p className="text-ink-soft">{record.category}, {record.region}</p>
          <h1 className="mt-3 text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.92]">{mainTitle}</h1>
          {subTitle && <p className="display mt-3 text-[clamp(1.4rem,3vw,2rem)] font-[650] text-ink-soft">{subTitle}</p>}
          {record.nativeName && (
            <p className="mt-4 text-[1.0625rem] italic">
              {record.nativeName}
              {record.language && <span className="not-italic text-ink-soft"> ({record.language})</span>}
            </p>
          )}
          <p className="measure mt-5 text-[1.1875rem] leading-relaxed">{record.shortDescription}</p>
          <div className="mt-5">
            <StatusMark status={record.status} />
          </div>
        </div>
        <CraftFigure craft={record.craftKey} photo={record.photo} size="large" caption priority className="aspect-[4/3]" />
      </header>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-12 border-t border-rule pt-10 lg:grid-cols-[minmax(0,68ch)_minmax(0,1fr)] lg:gap-16">
        <div className="space-y-10">
          <section aria-labelledby="narrative">
            <h2 id="narrative" className="text-[2rem]">The story</h2>
            <div className="mt-4 space-y-4 text-[1.0625rem] leading-[1.75]">
              {record.fullNarrative.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section aria-labelledby="history">
            <h2 id="history" className="text-[2rem]">History and lineage</h2>
            <p className="mt-4 leading-[1.75]">{record.historicalContext}</p>
          </section>

          <section aria-labelledby="technique">
            <h2 id="technique" className="text-[2rem]">Materials and technique</h2>
            <p className="mt-4 leading-[1.75]">{record.materialAndTechnique}</p>
          </section>

          <section aria-labelledby="review" className="plaque p-5">
            <h2 id="review" className="text-[1.6rem]">Sample label: {statusText(record.status)}</h2>
            <p className="mt-2 text-ink-soft">
              {record.statusReason ?? 'This label is part of the sample data. No real review has taken place.'}
            </p>
            <p className="mt-2 text-[0.9375rem] text-ink-soft">The reason above is fixture text; it does not mean a real review occurred.</p>
            <button
              type="button"
              onClick={() => setCorrectionOpen((open) => !open)}
              aria-expanded={correctionOpen}
              aria-controls="correction-form"
              className="link mt-3 bg-transparent p-0"
            >
              {correctionOpen ? 'Hide the correction form' : 'Suggest a correction'}
            </button>
            {correctionOpen && (
              <form
                id="correction-form"
                className="rise mt-4 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (correctionNote.trim()) setCorrectionShown(true);
                }}
              >
                <label htmlFor="correction-note" className="field-label">What should change?</label>
                <textarea
                  id="correction-note"
                  value={correctionNote}
                  onChange={(e) => {
                    setCorrectionNote(e.target.value);
                    setCorrectionShown(false);
                  }}
                  rows={3}
                  required
                  aria-describedby="correction-hint"
                  className="input"
                  placeholder="The variation, the lineage or the reference"
                />
                <span id="correction-hint" className="field-hint">
                  Preview only: the note is not stored or sent. Do not enter personal, restricted or sacred information.
                </span>
                <button type="submit" className="btn btn-primary">Preview the correction</button>
                {correctionShown && (
                  <p role="status" className="rise text-patina">Preview shown. Nothing was sent, saved or queued for review.</p>
                )}
              </form>
            )}
          </section>

          <section aria-labelledby="sources">
            <h2 id="sources" className="text-[2rem]">Sources</h2>
            <p className="mt-2 text-[0.9375rem] text-ink-soft">Sample citations. They have not been checked.</p>
            <ol className="mt-4 space-y-4">
              {record.sources.map((src) => (
                <li key={src.id} className="border-t border-rule pt-4">
                  <p>{src.citation}</p>
                  <p className="mt-1 text-[0.9375rem] text-ink-soft tnum">
                    {SOURCE_TYPE[src.type] ?? src.type}
                    {src.year && `, ${src.year}`}
                    {src.institutionOrContributor && `, ${src.institutionOrContributor}`}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-10 lg:pt-2" aria-label="About this record">
          <section aria-labelledby="record-facts">
            <h2 id="record-facts" className="text-[1.6rem]">Record details</h2>
            <dl className="definition-list mt-4">
              <dt>Craft</dt>
              <dd>{CRAFT_NAMES[record.craftKey]}</dd>
              <dt>Community</dt>
              <dd>{record.community}</dd>
              <dt>Region</dt>
              <dd>{record.region}</dd>
              <dt>Language</dt>
              <dd>{record.language ?? 'Not given'}</dd>
              <dt>Sensitivity</dt>
              <dd><SensitivityText level={record.sensitivity} /></dd>
              <dt>Fixture date</dt>
              <dd className="tnum">{record.lastReviewedDate}</dd>
            </dl>
          </section>

          <section aria-labelledby="related-makers">
            <h2 id="related-makers" className="text-[1.6rem]">Linked makers</h2>
            <p className="mt-2 text-[0.9375rem] text-ink-soft">Sample profiles. No identity, consent or relationship is verified.</p>
            {artisans.length === 0 ? (
              <p className="mt-4">No sample profile is linked to this record.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {artisans.map((artisan) => (
                  <li key={artisan.id}>
                    <Link to={`/artisans/${artisan.slug}`} className="group flex items-center gap-4 no-underline">
                      <Monogram name={artisan.displayName} craft={artisan.craftKey} />
                      <span>
                        <span className="display block text-[1.35rem] group-hover:underline">{artisan.displayName}</span>
                        <span className="text-[0.9375rem] text-ink-soft">{artisan.publicLocation}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="ask-more">
            <h2 id="ask-more" className="text-[1.6rem]">Questions about this craft</h2>
            <p className="mt-2 text-[0.9375rem] text-ink-soft">The Q&amp;A page returns canned sample answers. No AI service is connected.</p>
            <Link to="/ask" className="btn btn-quiet mt-3">Ask CultureLens</Link>
          </section>
        </aside>
      </div>
    </article>
  );
};
