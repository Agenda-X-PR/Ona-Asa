import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { ShieldCheck, Compass, HeartHandshake, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <footer className="bg-[#241F2B] text-[#F4EFE5] border-t border-[#34205B]">
      {/* Curatorial Principles Ribbon */}
      <div className="border-b border-[#34205B]/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#8A68C7] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-[#F4EFE5]">Sample Content</h4>
                <p className="text-xs text-[#D7C8B3]/75 mt-1 leading-relaxed">
                  Records, source fields, and status labels are illustrative fixtures; citations and cultural claims have not been independently verified.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <HeartHandshake className="w-5 h-5 text-[#8A68C7] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-[#F4EFE5]">Consent & Agency</h4>
                <p className="text-xs text-[#D7C8B3]/75 mt-1 leading-relaxed">
                  Consent and maker agency are design goals. These sample profiles do not establish real consent, ownership, availability, or payment arrangements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Compass className="w-5 h-5 text-[#8A68C7] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-[#F4EFE5]">Experience UI</h4>
                <p className="text-xs text-[#D7C8B3]/75 mt-1 leading-relaxed">
                  Workshop listings and booking screens are illustrative only; no sessions or booking service are active.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Purpose */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#F4EFE5]">
                CultureLens
              </span>
              <span className="text-xs font-sans uppercase tracking-widest text-[#8A68C7]">
                Àṣà
              </span>
            </div>
            <p className="text-xs text-[#D7C8B3] leading-relaxed">
              A prototype for browsing sample cultural records, profile cards, and local-only demo flows, created for Hack for Humanity Lagos 2026.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#D7C8B3]/60">
              BUILD: Ọ̀NÀ ÀṢÀ · FRONTEND PROTOTYPE
            </div>
          </div>

          {/* Column 2: Cultural Knowledge */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-wider text-[#8A68C7]">
              Sample Records
            </h5>
            <ul className="space-y-2 text-sm text-[#D7C8B3]">
              <li>
                <button 
                  onClick={() => navigate('/culture/aso-oke-weaving')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Aso-Òkè Weaving
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/culture/adire-eleko-indigo')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Àdìrẹ Ẹlẹ́kọ Indigo
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/culture/ileke-beadwork')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Ìlẹ̀kẹ̀ Royal Beadwork
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/culture/traditional-terracotta-pottery')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Living Terracotta Clay
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/discover')} 
                  className="hover:text-white transition-colors cursor-pointer text-left text-xs text-[#8A68C7]"
                >
                  Browse all sample records →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Experiences */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-wider text-[#8A68C7]">
              Platform Journeys
            </h5>
            <ul className="space-y-2 text-sm text-[#D7C8B3]">
              <li>
                <button 
                  onClick={() => navigate('/artisans')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Artisan Directory
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/experiences')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Artisan Workshops
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/ask')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Ask CultureLens
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/contribute')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contribute Knowledge
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/bookings')} 
                  className="hover:text-white transition-colors cursor-pointer text-left text-xs text-[#8A68C7]"
                >
                  Look up a local demo request →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Governance & Integrity */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-wider text-[#8A68C7]">
              Prototype Limits
            </h5>
            <p className="text-xs text-[#D7C8B3]/80 leading-relaxed">
              This checkout does not verify cultural claims, sources, identities, consent, or community permissions. Do not submit real personal, restricted, or sacred information: the local demo has no secure review or access controls.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/about')}
                className="inline-flex items-center gap-1.5 text-xs text-[#F4EFE5] hover:text-[#8A68C7] transition-colors cursor-pointer underline underline-offset-4"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read our Team & Mission Statement</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Baseline Bar */}
        <div className="mt-12 pt-6 border-t border-[#34205B]/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D7C8B3]/60">
          <div>
            © 2026 CultureLens · Ọ̀nà Àṣà. Prototype for Hack for Humanity Lagos.
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>LAGOS, NIGERIA</span>
            <span>·</span>
            <span>LOCAL SAMPLE Q&A · NO AI SERVICE</span>
            <span>·</span>
            <span>DEMO BOOKING · NO PAYMENT</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
