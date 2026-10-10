import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../context/RouterContext';
import { apiService } from '../services/apiService';
import { ArtisanProfile, CulturalExperience, CulturalRecord } from '../types';
import { ArtisanVerificationLabel } from '../components/common/StatusIndicators';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Mail, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Send,
  X
} from 'lucide-react';

export const ArtisanDetailPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const slug = params.slug;

  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [experiences, setExperiences] = useState<CulturalExperience[]>([]);
  const [associatedRecords, setAssociatedRecords] = useState<CulturalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Inquiry Modal State
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);
  const inquiryDialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!inquiryOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = inquiryDialogRef.current;
    (dialog?.querySelector<HTMLElement>('input, textarea') ?? dialog?.querySelector<HTMLElement>('button'))?.focus();

    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setInquiryOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !dialog) return;
      const focusable = [...dialog.querySelectorAll<HTMLElement>('button, input, textarea, [href], [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.hasAttribute('disabled'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', handleDialogKeyDown);
    return () => {
      document.removeEventListener('keydown', handleDialogKeyDown);
      previouslyFocused?.focus();
    };
  }, [inquiryOpen]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    if (slug) {
      apiService.getArtisanBySlug(slug).then(async (art) => {
        if (!isMounted) return;
        setArtisan(art);

        if (art) {
          // Fetch associated experiences
          const exps = await apiService.getExperiences();
          const matchedExps = exps.filter(e => art.experienceIds.includes(e.id));
          if (isMounted) setExperiences(matchedExps);

          // Fetch associated cultural records
          const recs: CulturalRecord[] = [];
          for (const rSlug of art.associatedRecordSlugs) {
            const rec = await apiService.getCulturalRecordBySlug(rSlug);
            if (rec) recs.push(rec);
          }
          if (isMounted) setAssociatedRecords(recs);
        }
        setLoading(false);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryMessage.trim()) return;

    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setInquiryOpen(false);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMessage('');
    }, 2200);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#34205B] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono uppercase tracking-wider text-stone-500">
          Loading artisan profile...
        </p>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#34205B]">Artisan Not Found</h2>
        <p className="text-sm text-stone-600">The requested artisan profile does not exist or has not been published.</p>
        <button
          onClick={() => navigate('/artisans')}
          className="px-4 py-2 text-xs font-medium text-white bg-[#34205B] rounded-md"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/artisans')}
          className="inline-flex items-center gap-2 text-xs font-medium text-stone-600 hover:text-[#34205B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Artisan Directory</span>
        </button>
      </div>

      {/* Artisan Profile Hero Banner */}
      <div className="bg-white rounded-2xl border border-[#D7C8B3] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start gap-8">
          
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-[#8A68C7] shrink-0 bg-stone-100 shadow-sm">
            <img
              src={artisan.avatarUrl}
              alt={artisan.displayName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                {artisan.nativeTitle && (
                  <span className="text-xs font-mono text-[#8A68C7] font-semibold uppercase tracking-wider block">
                    {artisan.nativeTitle}
                  </span>
                )}
                <h1 className="font-serif text-3xl sm:text-4xl text-[#34205B] font-medium">
                  {artisan.displayName}
                </h1>
                <p className="text-sm text-[#8A68C7] font-medium mt-0.5">{artisan.craft}</p>
              </div>

              <ArtisanVerificationLabel status={artisan.verificationStatus} />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8A68C7]" />
                <span>{artisan.workshopArea}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-stone-700">
                {artisan.experienceYears} Years of Traditional Craft
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium">
                Illustrative prototype profile
              </span>
            </div>

            <blockquote className="text-sm italic text-stone-700 border-l-2 border-[#8A68C7] pl-3.5 py-1">
              "{artisan.quote}"
            </blockquote>

            <div className="pt-2 flex flex-wrap gap-3">
              {artisan.contactOptions.inquiryEnabled && (
                <button
                  onClick={() => setInquiryOpen(true)}
                  className="px-5 py-2.5 text-xs font-medium text-white bg-[#34205B] hover:bg-[#251642] rounded-md transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Preview inquiry form · not sent</span>
                </button>
              )}

              {experiences.length > 0 && (
                <button
                  onClick={() => {
                    const el = document.getElementById('workshops-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 text-xs font-medium text-[#34205B] bg-[#F4EFE5] hover:bg-[#D7C8B3]/60 border border-[#D7C8B3] rounded-md transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#8A68C7]" />
                  <span>View sample workshop cards ({experiences.length})</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Grid: Story & Context */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Story & Studio */}
        <div className="lg:col-span-8 space-y-8 font-sans">
          
          {/* Craft Narrative */}
          <div className="bg-white rounded-xl border border-[#D7C8B3] p-6 sm:p-8 space-y-4">
            <h2 className="font-serif text-2xl font-medium text-[#34205B]">
              Artisan Story & Guild Lineage
            </h2>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              {artisan.story}
            </p>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed pt-2">
              {artisan.bio}
            </p>
          </div>

          {/* Studio & Craft Imagery */}
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-medium text-[#34205B]">
              Atelier & Traditional Work Gallery
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {artisan.studioImages.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#D7C8B3] bg-stone-100">
                  <img
                    src={img}
                    alt={`${artisan.displayName} studio ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#241F2B]/80 text-[#F4EFE5] text-[10px] font-mono px-2 py-0.5 rounded-sm">
                    STUDIO VIEW · LAGOS
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Workshop Cards */}
          <div id="workshops-section" className="space-y-4 pt-4 border-t border-[#D7C8B3]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#8A68C7]">
                  PRACTICAL LEARNING
                </span>
                <h3 className="font-serif text-2xl font-medium text-[#34205B]">
                  Artisan-Led Cultural Experiences
                </h3>
              </div>
            </div>

            {experiences.length === 0 ? (
              <div className="p-6 bg-white rounded-xl border border-[#D7C8B3] text-xs text-stone-500">
                This artisan does not currently have public scheduled workshops. You can send a direct inquiry to arrange private guild visits.
              </div>
            ) : (
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-6 bg-white rounded-xl border border-[#D7C8B3] hover:border-[#8A68C7] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 text-xs text-stone-500 font-sans">
                        <span>{exp.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#8A68C7]" />
                          {exp.durationHours} Hours
                        </span>
                      </div>
                      <h4 className="font-serif text-lg font-medium text-[#34205B]">
                        {exp.title}
                      </h4>
                      <p className="text-xs text-stone-600 line-clamp-2">
                        {exp.shortSummary}
                      </p>
                      <div className="text-xs text-stone-500">
                        Meeting point: <strong className="text-stone-700">{exp.locationMeetingPoint}</strong>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0 w-full sm:w-auto">
                      <div className="text-right">
                        <span className="text-[11px] text-stone-500 block">Tuition</span>
                        <span className="font-mono text-lg font-semibold text-[#34205B]">
                          ₦{exp.priceNaira.toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => navigate(`/experiences/${exp.slug}`)}
                        className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-white bg-[#34205B] hover:bg-[#251642] rounded-md transition-colors cursor-pointer"
                      >
                        Preview Booking Demo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Cultural Connection & Contact */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Associated Cultural Archives */}
          <div className="bg-[#FAF7F2] rounded-xl border border-[#D7C8B3] p-6 space-y-4">
            <h3 className="font-serif text-base font-medium text-[#34205B]">
              Associated Cultural Heritage Records
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              These illustrative profile and record fixtures are associated for the interface demo only; neither is independently verified:
            </p>
            <div className="space-y-3">
              {associatedRecords.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => navigate(`/culture/${rec.slug}`)}
                  className="p-3 bg-white rounded-lg border border-stone-200 hover:border-[#8A68C7] transition-all cursor-pointer group"
                >
                  <h5 className="font-serif text-xs font-medium text-[#34205B] group-hover:text-[#8A68C7]">
                    {rec.title}
                  </h5>
                  <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{rec.community}</p>
                  <span className="text-[11px] text-[#8A68C7] inline-flex items-center gap-1 mt-1 font-medium">
                    Read archive entry <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Location Disclosure */}
          <div className="bg-white rounded-xl border border-[#D7C8B3] p-5 space-y-3 text-xs text-stone-600">
            <div className="flex items-center gap-2 text-[#34205B] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#8A68C7]" />
              <span>Sample Location Notice</span>
            </div>
            <p className="leading-relaxed">
              Locations shown are sample fixture text, not verified directions. This prototype does not confirm bookings or share private studio details.
            </p>
          </div>

        </div>

      </div>

      {/* Inquiry Modal */}
      {inquiryOpen && (
        <div className="fixed inset-0 z-50 bg-[#241F2B]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div ref={inquiryDialogRef} role="dialog" aria-modal="true" aria-labelledby="inquiry-dialog-title" className="bg-white rounded-xl border border-[#D7C8B3] shadow-xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 id="inquiry-dialog-title" className="font-serif text-lg font-medium text-[#34205B]">
                Inquire with {artisan.displayName}
              </h3>
              <button
                onClick={() => setInquiryOpen(false)}
                aria-label="Close inquiry preview"
                className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inquirySent ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg font-medium text-[#34205B]">Local Demo Preview</h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  Nothing was sent or saved. No artisan is contacted and no reply will be received. Please do not enter real contact details in this demo.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
                <p className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">Local UI preview only. Do not enter real personal information; this form has no delivery service.</p>
                <div>
                  <label htmlFor="inquiry-name" className="block font-medium text-stone-700 mb-1">Sample Name</label>
                  <input
                    id="inquiry-name"
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="Sample Guest"
                    className="w-full p-2.5 rounded-md border border-[#D7C8B3] text-stone-800 focus:ring-2 focus:ring-[#34205B]"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-email" className="block font-medium text-stone-700 mb-1">Demo Email</label>
                  <input
                    id="inquiry-email"
                    type="email"
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="demo@example.invalid"
                    className="w-full p-2.5 rounded-md border border-[#D7C8B3] text-stone-800 focus:ring-2 focus:ring-[#34205B]"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-message" className="block font-medium text-stone-700 mb-1">Demo Message (no sensitive details)</label>
                  <textarea
                    id="inquiry-message"
                    rows={4}
                    required
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Sample question only; no real contact or sensitive information."
                    className="w-full p-2.5 rounded-md border border-[#D7C8B3] text-stone-800 focus:ring-2 focus:ring-[#34205B]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setInquiryOpen(false)}
                    className="px-4 py-2 font-medium text-stone-600 hover:bg-stone-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-medium text-white bg-[#34205B] hover:bg-[#251642] rounded-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Preview Local Confirmation</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
