import React, { useRef, useState } from 'react';
import { Link } from '../lib/router';
import { apiService } from '../services/apiService';
import type { ArtisanProfile, CulturalRecord, QnAResponse } from '../types';
import { ErrorBlock, PageIntro } from '../components/ui';

const EXAMPLES = [
  'What does natural indigo mean in Yoruba adire?',
  'How do horizontal and vertical aso-oke looms differ?',
  'What materials were used in Benin bronze casting?',
  'What do the colours of royal ìlẹ̀kẹ̀ beads signify?',
];

const CONFIDENCE_TEXT: Record<QnAResponse['confidence'], string> = {
  high: 'High',
  partial_evidence: 'Partial evidence',
  insufficient_evidence: 'Insufficient evidence',
  unsupported: 'Unsupported',
};

export const AskCultureLensPage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [asked, setAsked] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [response, setResponse] = useState<QnAResponse | null>(null);
  const [records, setRecords] = useState<CulturalRecord[]>([]);
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const latest = useRef(0);

  const ask = async (text: string) => {
    const q = text.trim();
    if (!q) return;
    const request = ++latest.current;
    setAsked(q);
    setLoading(true);
    setError(false);
    try {
      const res = await apiService.askCulturalQuestion(q);
      const [recs, arts] = await Promise.all([
        apiService.getCulturalRecordsBySlugs(res.groundedRecordSlugs),
        apiService.getArtisansByIds(res.associatedArtisanIds),
      ]);
      if (request !== latest.current) return; // a newer question replaced this one
      setResponse(res);
      setRecords(recs);
      setArtisans(arts);
    } catch {
      if (request === latest.current) setError(true);
    } finally {
      if (request === latest.current) setLoading(false);
    }
  };

  const matched = response && response.groundedRecordSlugs.length > 0;

  return (
    <div className="page max-w-4xl">
      <PageIntro
        title="Ask CultureLens"
        lead="Ask about a craft and get the closest of four canned sample answers. No AI model is called, nothing is looked up live, and the answer text is not verified."
      />

      <form onSubmit={(e) => { e.preventDefault(); ask(question); }} className="border-y border-rule py-5">
        <label htmlFor="question" className="field-label">Your question</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What does indigo mean in adire?"
            className="input"
          />
          <button type="submit" disabled={loading || !question.trim()} className="btn btn-primary shrink-0">
            {loading ? <><span className="spinner" aria-hidden="true" /> Finding an answer…</> : 'Ask'}
          </button>
        </div>
        <div className="mt-4">
          <p className="text-[0.9375rem] text-ink-soft">Or try one of these:</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <li key={ex}>
                <button
                  type="button"
                  onClick={() => { setQuestion(ex); ask(ex); }}
                  className="rounded-[3px] border border-rule px-3 py-1.5 text-left text-[0.9375rem] hover:border-ink"
                >
                  {ex}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </form>

      <div aria-live="polite" aria-busy={loading} className="mt-10">
        {error && <ErrorBlock title="The sample answer did not load." onRetry={() => ask(asked)} />}

        {response && !error && (
          <article className={`rise space-y-8 transition-opacity ${loading ? 'opacity-60' : ''}`}>
            <header>
              <p className="text-ink-soft">You asked</p>
              <h2 className="mt-1 text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.02]">{asked}</h2>
              {matched && (
                <p className="mt-3 text-[0.9375rem] text-ink-soft">
                  Closest sample question: <span className="italic">{response.question}</span>
                </p>
              )}
            </header>

            <section aria-labelledby="answer-title" className="plaque nails p-5 sm:p-7">
              <h3 id="answer-title" className="text-[1.6rem]">{matched ? 'Sample answer' : 'No sample answer'}</h3>
              <p className="measure mt-3 text-[1.0625rem] leading-[1.75]">{response.answer}</p>
              <p className="mt-4 text-[0.9375rem] text-ink-soft">
                Confidence in the sample data: {CONFIDENCE_TEXT[response.confidence]}. This is a fixture value, not a model's assessment.
              </p>
            </section>

            {response.uncertaintyOrDisputeNotes && (
              <section aria-labelledby="nuance-title">
                <h3 id="nuance-title" className="text-[1.6rem]">{matched ? 'Variation and uncertainty' : 'What next'}</h3>
                <p className="measure mt-2 leading-[1.75]">{response.uncertaintyOrDisputeNotes}</p>
              </section>
            )}

            {(records.length > 0 || artisans.length > 0) && (
              <section aria-labelledby="related-title" className="grid grid-cols-[minmax(0,1fr)] gap-6 sm:grid-cols-2">
                <h3 id="related-title" className="sr-only">Related sample content</h3>
                {records.length > 0 && (
                  <div>
                    <h4 className="text-[1.0625rem]">Related records</h4>
                    <ul className="mt-2 space-y-1">
                      {records.map((rec) => (
                        <li key={rec.id}><Link to={`/culture/${rec.slug}`} className="link">{rec.title}</Link></li>
                      ))}
                    </ul>
                  </div>
                )}
                {artisans.length > 0 && (
                  <div>
                    <h4 className="text-[1.0625rem]">Linked sample profiles</h4>
                    <ul className="mt-2 space-y-1">
                      {artisans.map((a) => (
                        <li key={a.id}><Link to={`/artisans/${a.slug}`} className="link">{a.displayName}</Link> <span className="text-ink-soft">(not verified)</span></li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </article>
        )}
      </div>

      <p className="measure mt-14 text-[0.9375rem] text-ink-soft">
        This page matches whole words in your question against four sample answers. A future AI service would have to run on a backend and
        be checked against approved sources before its answers could be presented as fact.
      </p>
    </div>
  );
};
