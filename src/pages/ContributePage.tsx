import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import type { ContributionSubmission, ContributionType, SensitivityLevel } from '../types';
import { PageIntro } from '../components/ui';

type Attribution = ContributionSubmission['attributionPreference'];

const TYPES: { id: ContributionType; label: string }[] = [
  { id: 'cultural_story', label: 'A story or history' },
  { id: 'craft_technique', label: 'A craft technique' },
  { id: 'oral_history', label: 'An elder’s oral account' },
  { id: 'correction', label: 'A correction to a record' },
  { id: 'photo_archive', label: 'Photo documentation' },
];

const SENSITIVITY: { level: SensitivityLevel; label: string; desc: string }[] = [
  { level: 'public', label: 'Public', desc: 'Public sample text only. It is not verified or published.' },
  { level: 'community_restricted', label: 'Community restricted', desc: 'Would need permission and access controls. Not accepted here.' },
  { level: 'sacred', label: 'Sacred or closed', desc: 'Not accepted by this prototype. Do not enter it.' },
];

const ATTRIBUTION: { id: Attribution; label: string }[] = [
  { id: 'public', label: 'Show a name' },
  { id: 'pseudonymous', label: 'Show initials only' },
  { id: 'anonymous', label: 'Show no name' },
];

type FieldErrors = Partial<Record<'title' | 'description' | 'community' | 'sources' | 'email' | 'consent' | 'sensitivity', string>>;

export const ContributePage: React.FC = () => {
  const [type, setType] = useState<ContributionType>('cultural_story');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [community, setCommunity] = useState('');
  const [region, setRegion] = useState('');
  const [language, setLanguage] = useState('');
  const [sources, setSources] = useState('');
  const [attribution, setAttribution] = useState<Attribution>('public');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sensitivity, setSensitivity] = useState<SensitivityLevel>('public');
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState<ContributionSubmission | null>(null);
  const [recent, setRecent] = useState<ContributionSubmission[]>([]);

  useEffect(() => {
    apiService.getRecentContributions().then((items) => setRecent(items.filter((i) => i.sensitivityLevel === 'public'))).catch(() => setRecent([]));
  }, [saved]);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!title.trim()) next.title = 'Give the contribution a title.';
    if (description.trim().length < 30) next.description = 'Describe the context in at least 30 characters.';
    if (!community.trim()) next.community = 'Name the community, lineage or guild it comes from.';
    if (!sources.trim()) next.sources = 'Add a source, elder attribution or archive reference.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter an email address such as demo@example.invalid.';
    if (sensitivity !== 'public') next.sensitivity = 'Only public content can be saved here. Restricted and sacred knowledge must not be entered in this prototype.';
    if (!consent) next.consent = 'Confirm the statement to save the demo entry.';
    return next;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    const found = validate();
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`contrib-${first}`)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const result = await apiService.submitContribution({
        type,
        title: title.trim(),
        description: description.trim(),
        community: community.trim(),
        region: region.trim(),
        language: language.trim() || undefined,
        sources: sources.trim(),
        attributionPreference: attribution,
        contributorName: attribution === 'anonymous' ? undefined : name.trim() || undefined,
        contributorEmail: email.trim(),
        consentGiven: consent,
        sensitivityLevel: sensitivity,
      });
      setSaved(result.submission);
      setTitle('');
      setDescription('');
      setCommunity('');
      setRegion('');
      setLanguage('');
      setSources('');
      setConsent(false);
      window.scrollTo({ top: 0 });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'The entry was not saved. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const describedBy = (field: keyof FieldErrors, hint?: string) =>
    [hint, errors[field] ? `contrib-${field}-error` : undefined].filter(Boolean).join(' ') || undefined;
  const ErrorText: React.FC<{ field: keyof FieldErrors }> = ({ field }) =>
    errors[field] ? <span id={`contrib-${field}-error`} className="mt-1 block text-[0.9375rem] text-alert">{errors[field]}</span> : null;

  return (
    <div className="page max-w-4xl">
      <PageIntro
        title="Contribute"
        lead="Try the form for proposing stories, techniques and corrections. Entries are saved in this browser only; nothing goes to a team or reviewer. Do not enter real personal information, or restricted or sacred knowledge."
      />

      {saved && (
        <section role="status" aria-labelledby="saved-title" className="plaque nails rise mb-10 p-5 sm:p-7">
          <h2 id="saved-title" className="text-[1.8rem]">Demo entry saved in this browser</h2>
          <p className="mt-2 text-ink-soft">No reviewer received it and no email will be sent. It stays here until this browser's site data is cleared.</p>
          <p className="display mt-3 text-[1.5rem] tracking-[0.03em] tnum">{saved.reference}</p>
          <button type="button" onClick={() => setSaved(null)} className="btn btn-quiet mt-4">Write another entry</button>
        </section>
      )}

      <form onSubmit={submit} noValidate className="space-y-10">
        {submitError && <p role="alert" className="notice notice-error">{submitError}</p>}
        {Object.keys(errors).length > 0 && (
          <p role="alert" className="notice notice-error">Some fields need attention. They are marked below.</p>
        )}

        <fieldset>
          <legend className="display text-[1.8rem]">What are you adding?</legend>
          <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-2">
            {TYPES.map((t) => (
              <label key={t.id} className="choice">
                <input type="radio" name="type" value={t.id} checked={type === t.id} onChange={() => setType(t.id)} />
                <span>{t.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-5">
          <legend className="display text-[1.8rem]">The knowledge</legend>
          <div>
            <label htmlFor="contrib-title" className="field-label">Title</label>
            <input id="contrib-title" value={title} onChange={(e) => setTitle(e.target.value)} aria-invalid={!!errors.title} aria-describedby={describedBy('title')} className="input" placeholder="For example, etu dyeing among Oyo weavers" />
            <ErrorText field="title" />
          </div>
          <div>
            <label htmlFor="contrib-description" className="field-label">Context and meaning</label>
            <textarea id="contrib-description" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} aria-invalid={!!errors.description} aria-describedby={describedBy('description', 'contrib-description-hint')} className="input" />
            <span id="contrib-description-hint" className="field-hint">Background, materials, significance and lineage. At least 30 characters.</span>
            <ErrorText field="description" />
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="contrib-community" className="field-label">Community</label>
              <input id="contrib-community" value={community} onChange={(e) => setCommunity(e.target.value)} aria-invalid={!!errors.community} aria-describedby={describedBy('community')} className="input" placeholder="Iseyin weavers’ guild" />
              <ErrorText field="community" />
            </div>
            <div>
              <label htmlFor="contrib-region" className="field-label">Region (optional)</label>
              <input id="contrib-region" value={region} onChange={(e) => setRegion(e.target.value)} className="input" placeholder="Oyo State" />
            </div>
            <div>
              <label htmlFor="contrib-language" className="field-label">Language (optional)</label>
              <input id="contrib-language" value={language} onChange={(e) => setLanguage(e.target.value)} className="input" placeholder="Yorùbá, Ọ̀yọ́ dialect" />
            </div>
          </div>
          <div>
            <label htmlFor="contrib-sources" className="field-label">Sources</label>
            <textarea id="contrib-sources" rows={3} value={sources} onChange={(e) => setSources(e.target.value)} aria-invalid={!!errors.sources} aria-describedby={describedBy('sources', 'contrib-sources-hint')} className="input" />
            <span id="contrib-sources-hint" className="field-hint">Sample citation text. The demo does not check sources, approve content or publish anything.</span>
            <ErrorText field="sources" />
          </div>
        </fieldset>

        <fieldset aria-describedby={describedBy('sensitivity', 'contrib-sensitivity-hint')}>
          <legend className="display text-[1.8rem]">Who may see it?</legend>
          <p id="contrib-sensitivity-hint" className="mt-1 text-ink-soft">This prototype has no access controls, so it only saves public content.</p>
          <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-3">
            {SENSITIVITY.map((s, i) => (
              <label key={s.level} className="choice">
                <input
                  id={i === 0 ? 'contrib-sensitivity' : undefined}
                  type="radio"
                  name="sensitivity"
                  value={s.level}
                  checked={sensitivity === s.level}
                  onChange={() => setSensitivity(s.level)}
                />
                <span>
                  <span className="block font-semibold">{s.label}</span>
                  <span className="block text-[0.9375rem] text-ink-soft">{s.desc}</span>
                </span>
              </label>
            ))}
          </div>
          <ErrorText field="sensitivity" />
        </fieldset>

        <fieldset className="space-y-5">
          <legend className="display text-[1.8rem]">Credit and contact</legend>
          <fieldset>
            <legend className="field-label">Credit</legend>
            <div className="grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-3">
              {ATTRIBUTION.map((a) => (
                <label key={a.id} className="choice">
                  <input type="radio" name="attribution" value={a.id} checked={attribution === a.id} onChange={() => setAttribution(a.id)} />
                  <span>{a.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2">
            {attribution !== 'anonymous' && (
              <div>
                <label htmlFor="contrib-name" className="field-label">Name to show</label>
                <input id="contrib-name" value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Sample Contributor" autoComplete="off" />
              </div>
            )}
            <div>
              <label htmlFor="contrib-email" className="field-label">Email</label>
              <input id="contrib-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} aria-describedby={describedBy('email', 'contrib-email-hint')} className="input" placeholder="demo@example.invalid" autoComplete="off" />
              <span id="contrib-email-hint" className="field-hint">Use a placeholder address. It is stored in this browser only.</span>
              <ErrorText field="email" />
            </div>
          </div>
        </fieldset>

        <div>
          <label className="choice">
            <input id="contrib-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={describedBy('consent')} />
            <span>I confirm this is public sample content suitable for a browser-only demo, and I understand it is not sent for preservation or review.</span>
          </label>
          <ErrorText field="consent" />
        </div>

        <button type="submit" disabled={submitting} className="btn btn-primary">
          {submitting ? <><span className="spinner" aria-hidden="true" /> Saving…</> : 'Save demo entry'}
        </button>
      </form>

      <section aria-labelledby="recent-title" className="mt-16 border-t border-rule pt-8">
        <h2 id="recent-title" className="text-[2rem]">Saved in this browser</h2>
        {recent.length === 0 ? (
          <p className="mt-3 text-ink-soft">No demo entries yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-rule">
            {recent.map((c) => (
              <li key={c.id} className="py-4">
                <h3 className="text-[1.4rem]">{c.title}</h3>
                <p className="mt-1 line-clamp-2 text-ink-soft">{c.description}</p>
                <p className="mt-1 text-[0.875rem] text-ink-soft tnum">
                  {c.reference}, {c.community}, saved {new Date(c.submittedAt).toLocaleDateString('en-GB')}. Not reviewed.
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
