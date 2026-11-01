import React from 'react';
import { Link } from '../lib/router';
import { PageIntro } from '../components/ui';

const PRINCIPLES = [
  {
    title: 'Provenance over invention',
    body: 'Production records should carry reviewed citations and community context. The records here are illustrative fixtures; neither their sources nor their claims are independently verified.',
  },
  {
    title: 'Artisan dignity and consent',
    body: 'Consent, control over information, privacy and fair payment are design goals, not safeguards this prototype provides. Profile details and locations are sample data.',
  },
  {
    title: 'Community agency and protocols',
    body: 'A production system would need protocols and access controls defined by communities. This front end has none, so it must not be used for sacred or restricted information.',
  },
  {
    title: 'Grounded AI assistance (Gemma)',
    body: 'The Q&A page uses canned local answers and is not connected to an AI service. A future backend integration must be checked against approved sources and must not decide cultural truth on its own.',
  },
];

// TODO(team): replace "Member A" and "Member B" with real credits. See TODO.md.
const TEAM = [
  {
    role: 'Member B, frontend lead',
    focus: 'Front end, UI/UX and the artisan experience',
    items: [
      'Design system, typography and colour',
      'Responsive navigation and mobile menu',
      'Cultural discovery, search and filters',
      'Artisan directory and inquiry flow',
      'Workshop booking form and receipt',
      'Ask CultureLens Q&A interface',
      'Contribution form',
    ],
  },
  {
    role: 'Member A, backend lead',
    focus: 'Backend, AI and payment infrastructure (planned)',
    items: [
      'Node/Express API and routes',
      'PostgreSQL schema and Drizzle ORM migrations',
      'Gemma server-side retrieval adapter',
      'ALATPay payment start and verification',
      'Reviewer sign-in and audit logs',
      'Server-side access control and sensitivity rules',
    ],
  },
];

export const AboutPage: React.FC = () => (
  <div className="page">
    <PageIntro title="About CultureLens" lead="Discover the culture. Learn its story. Meet its makers.">
      <p className="mt-2 text-ink-soft">Ọ̀nà Àṣà, for Hack for Humanity Lagos 2026.</p>
    </PageIntro>

    <section aria-labelledby="mission" className="measure space-y-4 leading-[1.75]">
      <h2 id="mission" className="text-[2.2rem]">Joining cultural knowledge to living practice</h2>
      <p>
        This project explores a design idea: people may benefit from a respectful way to browse cultural records, see their sources and
        uncertainty, and find practitioner-led experiences. The prototype does not include research that supports the idea.
      </p>
      <p>
        It is meant to make room for practitioner agency and consent. The profiles and workshop listings are fixtures; they do not
        represent confirmed makers, needs, consent or economic arrangements.
      </p>
      <p>
        The goal is to connect cultural information with practitioner-led engagement only after community review, permission and the
        supporting infrastructure are in place.
      </p>
    </section>

    <section aria-labelledby="principles" className="mt-16">
      <div className="opener">
        <h2 id="principles" className="text-[2.2rem]">Principles</h2>
      </div>
      <ol className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-8 md:grid-cols-2">
        {PRINCIPLES.map((p, i) => (
          <li key={p.title} className="grid grid-cols-[2.5rem_1fr] gap-2">
            <span className="display text-[2rem] leading-none text-brass tnum" aria-hidden="true">{i + 1}</span>
            <div>
              <h3 className="text-[1.6rem]">{p.title}</h3>
              <p className="mt-2 text-ink-soft">{p.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>

    <section aria-labelledby="team" className="mt-16">
      <div className="opener">
        <h2 id="team" className="text-[2.2rem]">Team Àṣà and the split of work</h2>
      </div>
      <p className="measure mt-4 text-ink-soft">
        A two-person hackathon collaboration. This repository holds only the front end, which runs on sample fixtures. The backend services
        listed for Member A are planned, not built or connected here.
      </p>
      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2">
        {TEAM.map((member) => (
          <section key={member.role} className="plaque nails p-5 sm:p-7" aria-labelledby={`team-${member.role}`}>
            <p className="text-ink-soft">{member.role}</p>
            <h3 id={`team-${member.role}`} className="mt-1 text-[1.6rem]">{member.focus}</h3>
            <ul className="mt-4 list-disc space-y-1.5 pl-5 marker:text-brass">
              {member.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </section>

    <section className="mt-16 flex flex-wrap items-center gap-3 border-t border-rule pt-8" aria-label="Where to go next">
      <Link to="/discover" className="btn btn-primary">Browse the records</Link>
      <Link to="/artisans" className="btn btn-quiet">Meet the makers</Link>
    </section>
  </div>
);
