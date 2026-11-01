import React, { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { Link, useRouter } from '../lib/router';
import { ARTISANS, CULTURAL_RECORDS, EXPERIENCES } from '../data/mockData';
import { CRAFT_NAMES, Motif } from '../components/Motif';
import { Monogram, StatusMark, VerificationMark, formatNaira } from '../components/ui';

const TOPICS = ['Aṣọ-Òkè weaving', 'Adire indigo', 'Ìlẹ̀kẹ̀ beads', 'Terracotta pottery', 'Lost-wax bronze', 'Uli'];

/** The wall: every sample record hangs here as a cast panel. */
const RecordWall: React.FC = () => (
  <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3" aria-label="Sample cultural records">
    {CULTURAL_RECORDS.map((record, index) => (
      <li
        key={record.id}
        className={
          index === 0
            ? 'col-span-2 lg:row-span-2'
            : // On two columns an odd last panel would hang alone; let it span the row.
              index === CULTURAL_RECORDS.length - 1 && (CULTURAL_RECORDS.length - 1) % 2 === 1
              ? 'col-span-2 lg:col-span-1'
              : ''
        }
      >
        <Link to={`/culture/${record.slug}`} className="plaque-link h-full">
          <article className="plaque nails flex h-full flex-col p-2.5">
            <div
              className={`motif-field pour rounded-[2px] ${index === 0 ? 'aspect-[16/9] lg:aspect-auto lg:flex-1' : 'aspect-[4/3]'}`}
              style={{ '--i': index } as React.CSSProperties}
            >
              <Motif craft={record.craftKey} scale={index === 0 ? 1.25 : 1} />
            </div>
            <div className="px-1.5 pt-3 pb-1.5">
              <h3 className={`plaque-title ${index === 0 ? 'text-[clamp(1.6rem,3vw,2.4rem)]' : 'text-[1.35rem]'}`}>
                {record.title.split(':')[0]}
              </h3>
              <p className="mt-1 text-[0.875rem] text-ink-soft">{CRAFT_NAMES[record.craftKey]}</p>
            </div>
          </article>
        </Link>
      </li>
    ))}
  </ul>
);

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    navigate(q ? `/discover?q=${encodeURIComponent(q)}` : '/discover');
  };

  const makers = ARTISANS.slice(0, 3);
  const workshops = EXPERIENCES.slice(0, 3);

  return (
    <>
      <section className="page grid grid-cols-[minmax(0,1fr)] gap-10 pt-10 pb-6 sm:pt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <div className="lg:pt-6">
          <h1 className="text-[clamp(3rem,8vw,6rem)] leading-[0.92]">Every tradition holds a story.</h1>
          <p className="measure mt-6 text-[1.125rem] text-ink-soft">
            Browse sample records of Nigerian crafts, the makers linked to them and the workshops they might teach. Every text, name,
            citation and image here is illustrative and has not been independently verified.
          </p>

          <form onSubmit={submit} role="search" className="mt-8">
            <label htmlFor="home-search" className="field-label">
              Search the records
            </label>
            <div className="flex gap-2">
              <input
                id="home-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Craft, community or place"
                className="input"
              />
              <button type="submit" className="btn btn-primary shrink-0">
                <Search className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Search</span>
              </button>
            </div>
          </form>

          <div className="mt-5">
            <h2 className="sr-only">Topics</h2>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-[0.9375rem]">
              {TOPICS.map((topic) => (
                <li key={topic}>
                  <Link to="/discover" query={{ q: topic }} className="link">
                    {topic}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-[4px] bg-ground-deep p-3 sm:p-4">
          <h2 className="sr-only">Sample records</h2>
          <RecordWall />
        </div>
      </section>

      <section className="page mt-20" aria-labelledby="makers-title">
        <div className="opener">
          <h2 id="makers-title" className="text-[clamp(2rem,4vw,3rem)]">
            Makers
          </h2>
        </div>
        <p className="measure mt-3 text-ink-soft">
          Illustrative profiles. They are not confirmed people, and they record no consent, availability or endorsement.
        </p>
        <ul className="mt-6 divide-y divide-rule border-y border-rule">
          {makers.map((artisan) => (
            <li key={artisan.id}>
              <Link to={`/artisans/${artisan.slug}`} className="group grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-1 py-5 no-underline sm:grid-cols-[auto_1fr_auto]">
                <Monogram name={artisan.displayName} craft={artisan.craftKey} />
                <div>
                  <h3 className="text-[1.6rem] group-hover:underline">{artisan.displayName}</h3>
                  <p className="text-[0.9375rem] text-ink-soft">
                    {artisan.craft}, {artisan.publicLocation}
                  </p>
                </div>
                <div className="col-start-2 sm:col-start-3">
                  <VerificationMark status={artisan.verificationStatus} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/artisans" className="link mt-4 inline-flex items-center gap-1.5">
          All five sample profiles <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>

      <section className="page mt-20 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" aria-labelledby="workshops-title">
        <div>
          <div className="opener">
            <h2 id="workshops-title" className="text-[clamp(2rem,4vw,3rem)]">
              Workshops
            </h2>
          </div>
          <p className="measure mt-3 text-ink-soft">
            Sample listings with a booking flow you can try. Requests stay in this browser; no seat is held and nothing is paid.
          </p>
          <ul className="mt-6 space-y-4">
            {workshops.map((exp) => (
              <li key={exp.id} className="plaque grid grid-cols-[4.5rem_1fr] gap-4 p-3 sm:grid-cols-[6rem_1fr_auto] sm:items-center">
                <div className="motif-field h-full min-h-20 rounded-[2px]">
                  <Motif craft={exp.craftKey} scale={0.8} />
                </div>
                <div>
                  <h3 className="text-[1.3rem] leading-tight">
                    <Link to={`/experiences/${exp.slug}`} className="no-underline hover:underline">
                      {exp.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-[0.9375rem] text-ink-soft">
                    {exp.durationHours} hours, sample price {formatNaira(exp.priceNaira)} a guest
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/experiences" className="link mt-4 inline-flex items-center gap-1.5">
            All workshops <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="space-y-10 lg:pt-20">
          <div>
            <h2 className="text-[1.9rem]">Ask a question</h2>
            <p className="mt-2 text-ink-soft">
              Ask about indigo, looms, bronze casting or beads. You get one of four canned sample answers with its related records; no AI
              model is involved.
            </p>
            <Link to="/ask" className="btn btn-quiet mt-4">
              Ask CultureLens
            </Link>
          </div>
          <div>
            <h2 className="text-[1.9rem]">Add what you know</h2>
            <p className="mt-2 text-ink-soft">
              Try the contribution form for stories, techniques and corrections. Entries are saved in this browser only and are not sent
              for review.
            </p>
            <Link to="/contribute" className="btn btn-quiet mt-4">
              Open the contribution form
            </Link>
          </div>
          <div>
            <h2 className="text-[1.9rem]">How records are labelled</h2>
            <ul className="mt-3 space-y-2">
              <li><StatusMark status="documented" /></li>
              <li><StatusMark status="community_reviewed" /></li>
              <li><StatusMark status="under_review" /></li>
              <li><StatusMark status="disputed" /></li>
            </ul>
            <p className="mt-3 text-[0.9375rem] text-ink-soft">The labels are part of the sample data. No real review has taken place.</p>
          </div>
        </div>
      </section>
    </>
  );
};
