import React from 'react';
import { Link } from '../../lib/router';

const COLUMNS = [
  {
    title: 'Sample records',
    links: [
      { label: 'Aṣọ-Òkè weaving', to: '/culture/aso-oke-weaving' },
      { label: 'Àdìrẹ Ẹlẹ́kọ indigo', to: '/culture/adire-eleko-indigo' },
      { label: 'Ìlẹ̀kẹ̀ beadwork', to: '/culture/ileke-beadwork' },
      { label: 'Terracotta pottery', to: '/culture/traditional-terracotta-pottery' },
      { label: 'All records', to: '/discover' },
    ],
  },
  {
    title: 'Try the flows',
    links: [
      { label: 'Artisan directory', to: '/artisans' },
      { label: 'Workshops', to: '/experiences' },
      { label: 'Ask CultureLens', to: '/ask' },
      { label: 'Contribute knowledge', to: '/contribute' },
      { label: 'Look up a demo request', to: '/bookings' },
    ],
  },
];

export const Footer: React.FC = () => (
  <footer className="mt-24 bg-frame text-frame-ink">
    <div className="page grid grid-cols-[minmax(0,1fr)] gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
      <div className="space-y-4">
        <p className="display text-[2.25rem]">CultureLens</p>
        <p className="max-w-[46ch] text-[0.9375rem] text-frame-soft">
          A prototype for browsing sample cultural records, profiles and browser-only demo flows, made for Hack for Humanity Lagos
          2026 by Team Àṣà.
        </p>
        <p className="max-w-[46ch] text-[0.9375rem] text-frame-soft">
          Nothing here verifies cultural claims, sources, identities, consent or community permission. Do not enter real personal,
          restricted or sacred information.
        </p>
        <Link to="/about" className="inline-block text-frame-accent underline">
          About the prototype and team
        </Link>
      </div>
      {COLUMNS.map((column) => (
        <nav key={column.title} aria-labelledby={`footer-${column.title}`}>
          <h2 id={`footer-${column.title}`} className="font-sans text-[0.9375rem] leading-snug font-semibold tracking-normal text-frame-accent">
            {column.title}
          </h2>
          <ul className="mt-3 space-y-1.5">
            {column.links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-frame-soft no-underline transition-colors hover:text-frame-ink hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>
    <div className="border-t border-white/10">
      <p className="page py-5 text-[0.875rem] text-frame-soft">
        © 2026 CultureLens, Ọ̀nà Àṣà. Q&amp;A answers are canned samples; no AI service is called. Booking requests are demos; no payment is taken.
      </p>
    </div>
  </footer>
);
