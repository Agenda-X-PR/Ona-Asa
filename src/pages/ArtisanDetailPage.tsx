import React, { useEffect, useState } from 'react';
import { useModalDialog } from '../lib/useModalDialog';
import { ArrowLeft, X } from 'lucide-react';
import { Link, useRouter } from '../lib/router';
import { apiService } from '../services/apiService';
import type { ArtisanProfile, CulturalExperience, CulturalRecord } from '../types';
import { ErrorBlock, Loading, Monogram, VerificationMark, formatNaira } from '../components/ui';
import { Motif } from '../components/Motif';

export const ArtisanDetailPage: React.FC = () => {
  const { params } = useRouter();
  const slug = params.slug;

  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [experiences, setExperiences] = useState<CulturalExperience[]>([]);
  const [records, setRecords] = useState<CulturalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryPreviewed, setInquiryPreviewed] = useState(false);
  const closeInquiry = React.useCallback(() => setInquiryOpen(false), []);
  const dialogRef = useModalDialog(inquiryOpen);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);
    (async () => {
      if (!slug) return null;
      const art = await apiService.getArtisanBySlug(slug);
      if (!art) return { art: null, exps: [], recs: [] };
      const [exps, recs] = await Promise.all([
        apiService.getExperiencesByIds(art.experienceIds),
        apiService.getCulturalRecordsBySlugs(art.associatedRecordSlugs),
      ]);
      return { art, exps, recs };
    })()
      .then((result) => {
        if (!active) return;
        setArtisan(result?.art ?? null);
        setExperiences(result?.exps ?? []);
        setRecords(result?.recs ?? []);
      })
      .catch(() => active && setLoadError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug, attempt]);

  const openInquiry = () => {
    setInquiryPreviewed(false);
    setInquiryOpen(true);
  };

  if (loading) return <div className="page"><Loading label="Loading the sample profile…" /></div>;
  if (loadError) return <div className="page"><ErrorBlock title="This sample profile did not load." onRetry={() => setAttempt((n) => n + 1)} /></div>;
  if (!artisan) {
    return (
      <div className="page py-16">
        <h1 className="text-[clamp(2.5rem,6vw,4rem)]">No profile at this address</h1>
        <p className="mt-3 text-ink-soft">No sample profile matches this link.</p>
        <Link to="/artisans" className="btn btn-primary mt-6">See all profiles</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="pt-8">
        <Link to="/artisans" className="inline-flex items-center gap-2 text-[0.9375rem] text-ink-soft no-underline hover:text-ink hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All profiles
        </Link>
      </div>

      <header className="relative mt-8 overflow-hidden rounded-[4px] bg-ground-deep">
        <div className="motif-field absolute inset-0 bg-transparent opacity-35" aria-hidden="true">
          <Motif craft={artisan.craftKey} scale={1.4} />
        </div>
        <div className="relative grid grid-cols-[minmax(0,1fr)] gap-6 p-5 sm:grid-cols-[auto_1fr] sm:items-end sm:p-8">
          <Monogram name={artisan.displayName} craft={artisan.craftKey} size="lg" />
          <div className="rounded-[3px] bg-face/90 p-4 sm:p-5">
            {artisan.nativeTitle && <p className="text-ink-soft">{artisan.nativeTitle}</p>}
            <h1 className="text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.95]">{artisan.displayName}</h1>
            <p className="mt-2 text-[1.0625rem]">{artisan.craft}</p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] text-ink-soft">
              <span>{artisan.workshopArea}</span>
              <span className="tnum">{artisan.experienceYears} years of practice (sample)</span>
              <VerificationMark status={artisan.verificationStatus} />
            </div>
          </div>
        </div>
      </header>
      <p className="mt-3 text-[0.9375rem] text-ink-soft">
        Illustrative profile. No portrait has been supplied, and this person's identity and consent are not confirmed.
      </p>

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,68ch)_minmax(0,1fr)] lg:gap-16">
        <div className="space-y-10">
          <blockquote className="display border-l-0 text-[clamp(1.6rem,3.2vw,2.3rem)] font-[650] leading-[1.1]">
            “{artisan.quote}”
            <footer className="mt-2 font-sans text-[0.9375rem] font-normal text-ink-soft">Sample quote</footer>
          </blockquote>

          <section aria-labelledby="story">
            <h2 id="story" className="text-[2rem]">Story</h2>
            <p className="mt-4 leading-[1.75]">{artisan.story}</p>
            <p className="mt-4 leading-[1.75] text-ink-soft">{artisan.bio}</p>
          </section>

          <section id="workshops" aria-labelledby="workshops-title">
            <h2 id="workshops-title" className="text-[2rem]">Workshops</h2>
            {experiences.length === 0 ? (
              <p className="mt-4 text-ink-soft">No sample workshop is listed for this profile.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {experiences.map((exp) => (
                  <li key={exp.id} className="plaque p-5">
                    <h3 className="text-[1.5rem] leading-tight">
                      <Link to={`/experiences/${exp.slug}`} className="no-underline hover:underline">{exp.title}</Link>
                    </h3>
                    <p className="mt-2 text-[0.9375rem] text-ink-soft">{exp.shortSummary}</p>
                    <p className="mt-2 text-[0.9375rem] tnum">
                      {exp.durationHours} hours, sample price {formatNaira(exp.priceNaira)} a guest
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-10" aria-label="Contact and related records">
          <section aria-labelledby="contact">
            <h2 id="contact" className="text-[1.6rem]">Get in touch</h2>
            {artisan.contactOptions.inquiryEnabled ? (
              <>
                <p className="mt-2 text-[0.9375rem] text-ink-soft">Preview the inquiry form. Nothing is sent and no one will reply.</p>
                <button type="button" onClick={openInquiry} className="btn btn-primary mt-3">Preview an inquiry</button>
              </>
            ) : (
              <p className="mt-2 text-ink-soft">This sample profile does not accept inquiries.</p>
            )}
          </section>

          <section aria-labelledby="linked-records">
            <h2 id="linked-records" className="text-[1.6rem]">Linked records</h2>
            <p className="mt-2 text-[0.9375rem] text-ink-soft">Linked for the demo only; neither side is verified.</p>
            <ul className="mt-3 space-y-2">
              {records.map((rec) => (
                <li key={rec.id}>
                  <Link to={`/culture/${rec.slug}`} className="link">{rec.title}</Link>
                  <span className="block text-[0.9375rem] text-ink-soft">{rec.community}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="location">
            <h2 id="location" className="text-[1.6rem]">Location</h2>
            <p className="mt-2 text-[0.9375rem] text-ink-soft">
              {artisan.publicLocation}. Areas are sample text, not directions; the prototype shares no private studio details.
            </p>
          </section>
        </aside>
      </div>

      <dialog ref={dialogRef} className="sheet" aria-labelledby="inquiry-title" onClose={closeInquiry}>
        <div className="plaque p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 id="inquiry-title" className="text-[1.8rem] leading-tight">Ask {artisan.displayName}</h2>
            <button type="button" onClick={closeInquiry} className="grid grid-cols-[minmax(0,1fr)] h-11 w-11 shrink-0 place-items-center rounded-[3px] text-ink-soft hover:text-ink">
              <X className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          {inquiryPreviewed ? (
            <div role="status" className="rise mt-4 space-y-3">
              <p className="font-semibold">Preview only. Nothing was sent or saved.</p>
              <p className="text-ink-soft">No artisan is contacted by this prototype and no reply will come.</p>
              <button type="button" onClick={closeInquiry} className="btn btn-primary">Close</button>
            </div>
          ) : (
            <form
              className="mt-4 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setInquiryPreviewed(true);
                setInquiryName('');
                setInquiryEmail('');
                setInquiryMessage('');
              }}
            >
              <p className="notice">Preview form with no delivery service. Use placeholder details only.</p>
              <div>
                <label htmlFor="inquiry-name" className="field-label">Name</label>
                <input id="inquiry-name" required value={inquiryName} onChange={(e) => setInquiryName(e.target.value)} placeholder="Sample Guest" className="input" autoComplete="off" />
              </div>
              <div>
                <label htmlFor="inquiry-email" className="field-label">Email</label>
                <input id="inquiry-email" type="email" required value={inquiryEmail} onChange={(e) => setInquiryEmail(e.target.value)} placeholder="demo@example.invalid" className="input" autoComplete="off" />
              </div>
              <div>
                <label htmlFor="inquiry-message" className="field-label">Message</label>
                <textarea id="inquiry-message" required rows={4} value={inquiryMessage} onChange={(e) => setInquiryMessage(e.target.value)} placeholder="A sample question, no sensitive details" className="input" />
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <button type="button" onClick={closeInquiry} className="btn btn-quiet">Cancel</button>
                <button type="submit" className="btn btn-primary">Preview the inquiry</button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </div>
  );
};
