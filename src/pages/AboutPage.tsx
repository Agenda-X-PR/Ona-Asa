import React from 'react';
import { useRouter } from '../context/RouterContext';
import { ShieldCheck, Compass, HeartHandshake, Users, ArrowRight, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Hero Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-mono uppercase tracking-widest text-[#8A68C7]">
          Ọ̀NÀ ÀṢÀ · HACK FOR HUMANITY LAGOS 2026
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#34205B] font-medium tracking-tight">
          About CultureLens
        </h1>
        <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-sans">
          Discover the culture. Learn its story. Meet its makers.
        </p>
      </div>

      {/* Mission & Problem Statement */}
      <div className="bg-white rounded-2xl border border-[#D7C8B3] p-8 sm:p-10 space-y-6 shadow-sm">
        <h2 className="font-serif text-2xl font-medium text-[#34205B]">
          Bridging Cultural Knowledge and Living Practice
        </h2>
        
        <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
          This project explores a design hypothesis: people may benefit from a respectful way to browse cultural records, understand their sources and uncertainty, and discover practitioner-led experiences. This prototype does not provide independent research supporting that hypothesis.
        </p>

        <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
          Its intended direction is to make room for practitioner agency and consent. The profiles and workshop listings in this demonstration are fixtures; they do not represent confirmed makers, needs, consent, or economic arrangements.
        </p>

        <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-medium text-[#34205B]">
          The product goal is to connect cultural information with practitioner-led engagement only after community review, permission, and operational infrastructure are in place.
        </p>
      </div>

      {/* Core Design & Cultural Principles */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl font-medium text-[#34205B]">
          Our Cultural Governance Principles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-xl border border-[#D7C8B3] space-y-3">
            <ShieldCheck className="w-6 h-6 text-[#8A68C7]" />
            <h3 className="font-serif text-lg font-medium text-[#34205B]">
              1. Provenance over Hallucination
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Future production records should provide reviewed citations and community context. The current records are illustrative fixtures; neither sources nor claims are independently verified.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-[#D7C8B3] space-y-3">
            <HeartHandshake className="w-6 h-6 text-[#8A68C7]" />
            <h3 className="font-serif text-lg font-medium text-[#34205B]">
              2. Artisan Dignity & Consent
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Consent, control over information, privacy, and fair payment are design goals, not active safeguards in this prototype. The profile details and locations shown here are sample data.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-[#D7C8B3] space-y-3">
            <Compass className="w-6 h-6 text-[#8A68C7]" />
            <h3 className="font-serif text-lg font-medium text-[#34205B]">
              3. Community Agency & Protocols
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              A production system would need community-defined protocols and access controls. This frontend has no secure controls and must not be used to submit sacred or restricted information.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-[#D7C8B3] space-y-3">
            <Sparkles className="w-6 h-6 text-[#8A68C7]" />
            <h3 className="font-serif text-lg font-medium text-[#34205B]">
              4. Grounded AI Assistance (Gemma)
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              The current Q&A screen uses canned local fixtures and is not connected to an AI service. A future backend integration must be reviewed against approved sources and must not decide cultural truth on its own.
            </p>
          </div>
        </div>
      </div>

      {/* Team Structure & Technical Split */}
      <div className="bg-[#FAF7F2] rounded-2xl border border-[#D7C8B3] p-8 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#8A68C7]">
            TWO-PERSON HACKATHON COLLABORATION
          </span>
          <h2 className="font-serif text-2xl font-medium text-[#34205B] mt-1">
            Team Àṣà Architecture Split
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            This prototype separates the frontend fixture service from planned backend work. The services listed for Member A are not confirmed as implemented or connected in this checkout:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2">
            <span className="font-mono text-[#8A68C7] font-semibold block">MEMBER B (FRONTEND LEAD)</span>
            <h4 className="font-serif text-base font-medium text-stone-900">
              Frontend, UI/UX & Artisan Experience
            </h4>
            <ul className="space-y-1.5 text-stone-600 list-disc list-inside">
              <li>Design system, typography & color palette</li>
              <li>Responsive navigation & mobile drawer</li>
              <li>Cultural discovery, search & multi-filter catalog</li>
              <li>Artisan directory & interactive inquiry workflows</li>
              <li>Workshop booking forms & receipt feedback</li>
              <li>Ask CultureLens grounded Q&A interface</li>
              <li>Cultural knowledge contribution forms</li>
            </ul>
          </div>

          <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2">
            <span className="font-mono text-[#8A68C7] font-semibold block">MEMBER A (BACKEND LEAD)</span>
            <h4 className="font-serif text-base font-medium text-stone-900">
              Backend, AI & Payment Infrastructure
            </h4>
            <ul className="space-y-1.5 text-stone-600 list-disc list-inside">
              <li>Node/Express API architecture & routes</li>
              <li>PostgreSQL schema & Drizzle ORM migrations</li>
              <li>Gemma server-side retrieval adapter</li>
              <li>ALATPay transaction initiation & verification</li>
              <li>Review board authentication & audit logs</li>
              <li>Server-side access control & sensitivity rules</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4 pt-6 border-t border-[#D7C8B3]">
        <h3 className="font-serif text-2xl text-[#34205B] font-medium">
          Ready to explore Nigerian living heritage?
        </h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/discover')}
            className="px-6 py-3 text-sm font-medium text-white bg-[#34205B] hover:bg-[#251642] rounded-md transition-colors cursor-pointer flex items-center gap-2"
          >
            <span>Explore Cultural Records</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/artisans')}
            className="px-6 py-3 text-sm font-medium text-[#34205B] bg-white border border-[#D7C8B3] rounded-md transition-colors cursor-pointer"
          >
            Meet the Artisans
          </button>
        </div>
      </div>

    </div>
  );
};
