import React, { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { Link, useRouter } from '../lib/router';
import { ARTISANS, CULTURAL_RECORDS, EXPERIENCES } from '../data/mockData';
import { CRAFT_NAMES, Motif } from '../components/Motif';
import { Monogram, StatusMark, formatNaira } from '../components/ui';
import { PHOTOS } from '../data/images';

const heroPhoto = PHOTOS.adire;


const TOPICS = ['Aṣọ-Òkè weaving', 'Adire indigo', 'Ìlẹ̀kẹ̀ beads', 'Terracotta pottery', 'Lost-wax bronze', 'Uli'];

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
      <section className="relative isolate overflow-hidden bg-frame text-frame-ink" aria-labelledby="hero-title">
        <img
          src={heroPhoto.large}
          srcSet={`${heroPhoto.small} 640w, ${heroPhoto.large} 1200w`}
          sizes="100vw"
          width={heroPhoto.width}
          height={heroPhoto.height}
          alt=""
          fetchPriority="high"
          className="hero-photo absolute inset-0 -z-10 h-full w-full object-cover object-[72%_20%] md:object-[60%_35%]"
        />
        {/* Darken the photo where the text sits so it stays readable. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(20_15_10/0.92)_0%,rgb(20_15_10/0.7)_45%,rgb(20_15_10/0.15)_100%)] md:bg-[linear-gradient(to_right,rgb(20_15_10/0.9)_0%,rgb(20_15_10/0.72)_42%,rgb(20_15_10/0.05)_75%)]"
        />
        <div className="page flex min-h-[min(46rem,88svh)] flex-col justify-end pt-40 pb-10 md:justify-center md:py-24">
          <div className="hero-copy max-w-[34rem]">
            <h1 id="hero-title" className="text-[clamp(3rem,7.5vw,5.75rem)] leading-[0.92] text-frame-ink">
              Every tradition holds a story.
            </h1>
            <p className="mt-5 text-[1.125rem] leading-relaxed text-frame-ink/85">
              Browse sample records of Nigerian crafts, the makers linked to them and the workshops they might teach. Everything here is
              illustrative and has not been independently verified.
            </p>

            <form onSubmit={submit} role="search" className="mt-7">
              <label htmlFor="home-search" className="field-label text-frame-ink">
                Search the records
              </label>
              <div className="flex gap-2">
                <input
                  id="home-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Craft, community or place"
                  className="input border-transparent text-ink"
                />
                <button type="submit" className="btn shrink-0 border border-frame-accent bg-frame-accent font-semibold text-[#1a140c] hover:bg-frame-ink hover:border-frame-ink">
                  <Search className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only sm:not-sr-only">Search</span>
                </button>
              </div>
            </form>

            <nav aria-label="Popular topics" className="mt-5">
              <ul className="flex flex-wrap gap-2 text-[0.9375rem]">
                {TOPICS.map((topic) => (
                  <li key={topic}>
                    <Link
                      to="/discover"
                      query={{ q: topic }}
                      className="inline-block rounded-[3px] border border-frame-ink/30 px-3 py-1.5 text-frame-ink no-underline transition-colors hover:border-frame-accent hover:text-frame-accent"
                    >
                      {topic}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>

      <section className="page mt-20" aria-labelledby="records-title">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div>
            <h2 id="records-title" className="text-[clamp(2.25rem,4.5vw,3.5rem)]">
              Six crafts, six records
            </h2>
            <p className="measure mt-3 text-ink-soft">
              Each record tells a craft's story, where it comes from and how it is made. The sources have not been checked yet.
            </p>
          </div>
          <Link to="/discover" className="link inline-flex items-center gap-1.5">
            Search all records <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {CULTURAL_RECORDS.map((record) => {
            const photo = record.photo ? PHOTOS[record.photo] : undefined;
            const [name, subtitle] = record.title.split(/:\s*/);
            return (
              <li key={record.id}>
                <Link to={`/culture/${record.slug}`} className="group block no-underline">
                  <article>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-ground-deep">
                      {photo ? (
                        <img
                          src={photo.small}
                          width={photo.width}
                          height={photo.height}
                          alt={photo.alt}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="motif-field h-full w-full bg-ground-deep">
                          <Motif craft={record.craftKey} scale={1.3} />
                        </div>
                      )}
                      <span className="absolute bottom-3 left-3 rounded-[2px] bg-frame/85 px-2 py-1 text-[0.8125rem] text-frame-ink">
                        {CRAFT_NAMES[record.craftKey]}
                      </span>
                    </div>
                    <h3 className="mt-4 text-[1.9rem] leading-none group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                      {name}
                    </h3>
                    {subtitle && <p className="mt-1.5 font-semibold leading-snug">{subtitle}</p>}
                    <p className="mt-2 line-clamp-2 text-[0.9375rem] text-ink-soft">{record.shortDescription}</p>
                    <div className="mt-3">
                      <StatusMark status={record.status} />
                    </div>
                  </article>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-24 border-y border-rule bg-face/60 py-16" aria-labelledby="makers-title">
        <div className="page">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div>
              <h2 id="makers-title" className="text-[clamp(2.25rem,4.5vw,3.5rem)]">
                In the makers' words
              </h2>
              <p className="measure mt-3 text-ink-soft">
                Sample profiles and sample quotes. They are not confirmed people and record no consent or endorsement.
              </p>
            </div>
            <Link to="/artisans" className="link inline-flex items-center gap-1.5">
              Meet all five makers <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <ul className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-rule">
            {makers.map((artisan) => (
              <li key={artisan.id} className="md:px-8 md:first:pl-0 md:last:pr-0">
                <Link to={`/artisans/${artisan.slug}`} className="group flex h-full flex-col no-underline">
                  <blockquote className="display flex-1 text-[clamp(1.5rem,2.4vw,1.9rem)] leading-[1.08] font-[650]">
                    <span aria-hidden="true" className="mb-1 block text-[3rem] leading-[0.6] text-brass">“</span>
                    {artisan.quote}
                  </blockquote>
                  <div className="mt-6 flex items-center gap-4 border-t border-rule pt-4">
                    <Monogram name={artisan.displayName} craft={artisan.craftKey} />
                    <div>
                      <p className="display text-[1.4rem] group-hover:underline">{artisan.displayName}</p>
                      <p className="text-[0.875rem] leading-snug text-ink-soft">{artisan.craft}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="page mt-24" aria-labelledby="workshops-title">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div>
            <h2 id="workshops-title" className="text-[clamp(2.25rem,4.5vw,3.5rem)]">
              Learn it with your hands
            </h2>
            <p className="measure mt-3 text-ink-soft">
              Sample workshops with a booking flow you can try. Requests stay in this browser; no seat is held and nothing is paid.
            </p>
          </div>
          <Link to="/experiences" className="link inline-flex items-center gap-1.5">
            All workshops <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-8 divide-y divide-rule border-y border-rule">
          {workshops.map((exp) => {
            const photo = exp.photo ? PHOTOS[exp.photo] : undefined;
            const artisan = ARTISANS.find((a) => a.id === exp.artisanId);
            return (
              <li key={exp.id}>
                <Link
                  to={`/experiences/${exp.slug}`}
                  className="group grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-x-5 gap-y-3 py-6 no-underline sm:grid-cols-[11rem_minmax(0,1fr)_auto] sm:gap-x-8"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-[3px] bg-ground-deep">
                    {photo ? (
                      <img src={photo.small} width={photo.width} height={photo.height} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    ) : (
                      <div className="motif-field h-full w-full bg-ground-deep"><Motif craft={exp.craftKey} /></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-[clamp(1.4rem,2.4vw,1.85rem)] leading-[1.02] group-hover:underline">{exp.title}</h3>
                    <p className="mt-2 hidden text-ink-soft sm:block">{exp.shortSummary}</p>
                    <p className="mt-2 text-[0.875rem] text-ink-soft">
                      {exp.durationHours} hours{artisan ? ` with ${artisan.displayName}` : ''}
                    </p>
                  </div>
                  <p className="col-start-2 sm:col-start-3 sm:text-right">
                    <span className="display block text-[1.9rem] leading-none tnum">{formatNaira(exp.priceNaira)}</span>
                    <span className="text-[0.875rem] text-ink-soft">a guest, sample price</span>
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="-mb-24 mt-24 border-b border-white/10 bg-frame text-frame-ink" aria-label="Ask and contribute">
        <div className="page grid grid-cols-[minmax(0,1fr)] gap-12 py-16 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="text-[clamp(2rem,4vw,3rem)] text-frame-ink">Have a question?</h2>
            <p className="mt-3 max-w-[46ch] text-frame-soft">
              Ask about indigo, looms, bronze casting or beads. You get the closest of four sample answers with its related records. No AI
              model is involved yet.
            </p>
            <Link to="/ask" className="btn mt-6 border border-frame-accent bg-frame-accent text-[#1a140c] hover:border-frame-ink hover:bg-frame-ink">
              Ask CultureLens
            </Link>
          </div>
          <div className="md:border-l md:border-white/15 md:pl-16">
            <h2 className="text-[clamp(2rem,4vw,3rem)] text-frame-ink">Know a story?</h2>
            <p className="mt-3 max-w-[46ch] text-frame-soft">
              Add a story, a technique or a correction. For now entries are saved in your browser only and are not sent for review.
            </p>
            <Link to="/contribute" className="btn mt-6 border border-frame-ink/40 text-frame-ink hover:border-frame-ink">
              Open the contribution form
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
