import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { apiService } from '../services/apiService';
import { CulturalRecord, ArtisanProfile } from '../types';
import { CulturalStatusLabel, SensitivityLabel } from '../components/common/StatusIndicators';
import { 
  ArrowLeft, 
  BookOpen, 
  ShieldCheck, 
  Share2, 
  Users, 
  MapPin, 
  Compass, 
  AlertTriangle,
  ArrowRight,
  Send,
  Check
} from 'lucide-react';

export const CultureDetailPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const slug = params.slug;

  const [record, setRecord] = useState<CulturalRecord | null>(null);
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Correction suggestion modal/state
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);
  const [correctionNote, setCorrectionNote] = useState('');
  const [correctionSubmitted, setCorrectionSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setLoadError(false);

    if (slug) {
      apiService.getCulturalRecordBySlug(slug).then(async (rec) => {
        if (!isMounted) return;
        setRecord(rec);

        if (rec && rec.relatedArtisanIds.length > 0) {
          const artisanList: ArtisanProfile[] = [];
          for (const aId of rec.relatedArtisanIds) {
            const art = await apiService.getArtisanById(aId);
            if (art) artisanList.push(art);
          }
          if (isMounted) setArtisans(artisanList);
        }
        setLoading(false);
      }).catch(() => {
        if (isMounted) {
          setLoadError(true);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [slug, retryCount]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionNote.trim()) return;
    setCorrectionSubmitted(true);
    setTimeout(() => {
      setShowCorrectionForm(false);
      setCorrectionSubmitted(false);
      setCorrectionNote('');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#34205B] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono uppercase tracking-wider text-stone-500">
          Loading local sample record...
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div role="alert" className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#34205B]">The sample record could not be loaded</h2>
        <button onClick={() => setRetryCount((count) => count + 1)} className="px-4 py-2 text-xs font-medium text-white bg-[#34205B] rounded-md">Retry</button>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#34205B]">Cultural Record Not Found</h2>
        <p className="text-sm text-stone-600">
          No sample fixture matches this route.
        </p>
        <button
          onClick={() => navigate('/discover')}
          className="px-4 py-2 text-xs font-medium text-white bg-[#34205B] rounded-md"
        >
          Return to Discovery
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Back Navigation & Provenance Utility Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D7C8B3] pb-4">
        <button
          onClick={() => navigate('/discover')}
          className="inline-flex items-center gap-2 text-xs font-medium text-stone-600 hover:text-[#34205B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cultural Discovery</span>
        </button>

        <div className="flex items-center gap-4 text-xs font-mono text-stone-500">
          <span>SAMPLE FIXTURE: {record.id.toUpperCase()}</span>
          <span>·</span>
          <span>FIXTURE DATE: {record.lastReviewedDate}</span>
          <button
            onClick={handleShare}
            className="p-1 hover:text-[#34205B] transition-colors cursor-pointer inline-flex items-center gap-1"
            title="Copy link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Record Header & Editorial Title */}
      <div className="space-y-4 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 font-sans">
          <span>{record.category}</span>
          <span aria-hidden="true">·</span>
          <span>{record.region}</span>
          <span aria-hidden="true">·</span>
          <CulturalStatusLabel status={record.status} />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#34205B] font-medium leading-[1.15]">
          {record.title}
        </h1>

        {record.nativeName && (
          <div className="text-base sm:text-lg font-serif italic text-[#8A68C7]">
            {record.nativeName} ({record.language} language)
          </div>
        )}

        <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-sans pt-2 border-l-2 border-[#8A68C7] pl-4 italic">
          {record.shortDescription}
        </p>
      </div>

      {/* Primary Archival Photography & Caption */}
      <div className="space-y-2">
        <div className="w-full h-[360px] sm:h-[480px] rounded-xl overflow-hidden border border-[#D7C8B3] bg-stone-100 shadow-sm">
          <img
            src={record.imageUrl}
            alt={record.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-stone-500 italic px-1">
          <span>Fig. 1 — {record.imageCaption}</span>
          <span className="font-mono text-[11px] not-italic text-stone-400">SAMPLE IMAGE CAPTION</span>
        </div>
      </div>

      {/* Two-Column Editorial Asymmetric Layout (70% essay / 30% margin metadata) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Main Reading Essay (max-w-prose) */}
        <div className="lg:col-span-8 space-y-8 font-sans text-stone-800 leading-relaxed text-base">
          
          {/* Detailed Narrative with Drop Cap */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-medium text-[#34205B]">
              Cultural Context & Narrative
            </h2>
            
            {record.fullNarrative.map((paragraph, index) => (
              <p 
                key={index} 
                className={index === 0 ? "first-letter:text-5xl first-letter:font-serif first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#34205B] leading-relaxed" : "leading-relaxed"}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Historical Context Section */}
          <div className="p-6 bg-white rounded-xl border border-[#D7C8B3] space-y-3">
            <h3 className="font-serif text-lg font-medium text-[#34205B]">
              Historical Provenance & Lineage
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed">
              {record.historicalContext}
            </p>
          </div>

          {/* Materials & Technique */}
          <div className="p-6 bg-white rounded-xl border border-[#D7C8B3] space-y-3">
            <h3 className="font-serif text-lg font-medium text-[#34205B]">
              Materials & Traditional Techniques
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed">
              {record.materialAndTechnique}
            </p>
          </div>

          {/* Peer Review / Disputed Indication */}
          <div className="p-5 bg-[#FAF7F2] rounded-xl border border-[#D7C8B3] space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[#241F2B]">
                  Fixture Review Label: {record.status.replace('_', ' ').toUpperCase()}
                </h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {record.statusReason || 'This label is part of the local sample data and does not indicate that a real review occurred.'}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setShowCorrectionForm(!showCorrectionForm)}
                    className="text-xs font-medium text-[#34205B] hover:text-[#8A68C7] underline cursor-pointer"
                  >
                    Preview a correction form (not sent) →
                  </button>
                </div>
              </div>
            </div>

            {/* In-page suggestion form */}
            {showCorrectionForm && (
              <form onSubmit={handleCorrectionSubmit} className="pt-3 border-t border-stone-200 space-y-3">
                <div className="text-xs font-medium text-stone-700">
                  Sample correction note (not stored or sent):
                </div>
                <p className="text-xs text-amber-800">Do not enter personal, restricted, community-restricted, or sacred information in this prototype.</p>
                <label htmlFor="correction-note" className="sr-only">Sample correction note</label>
                <textarea
                  id="correction-note"
                  value={correctionNote}
                  onChange={(e) => setCorrectionNote(e.target.value)}
                  placeholder="Detail the variation, community lineage, or reference..."
                  rows={3}
                  required
                  className="w-full p-2.5 text-xs rounded-md border border-[#D7C8B3] bg-white focus:outline-none focus:ring-1 focus:ring-[#34205B]"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-medium text-white bg-[#34205B] hover:bg-[#251642] rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Preview Local Confirmation</span>
                  </button>
                </div>
                {correctionSubmitted && (
                  <p className="text-xs text-emerald-700 font-medium pt-1">
                    Demo only: nothing was sent, saved, or queued for review.
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Sources and Archival Provenance */}
          <div className="space-y-4 pt-4 border-t border-[#D7C8B3]">
            <h3 className="font-serif text-xl font-medium text-[#34205B]">
              Sample Source Fields · Not Independently Verified
            </h3>
            <div className="space-y-3">
              {record.sources.map((src) => (
                <div key={src.id} className="p-4 bg-white rounded-lg border border-stone-200 text-xs space-y-1">
                  <div className="font-medium text-stone-900">{src.citation}</div>
                  <div className="flex items-center gap-3 text-stone-500 font-mono text-[11px] pt-1">
                    <span>TYPE: {src.type.replace('_', ' ').toUpperCase()}</span>
                    {src.year && <span>YEAR: {src.year}</span>}
                    {src.institutionOrContributor && <span>ORIGIN: {src.institutionOrContributor}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Margin Sidebar (Metadata, Living Practitioners) */}
        <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-28">
          
          {/* Accession & Cultural Metadata Card */}
          <div className="bg-white rounded-xl border border-[#D7C8B3] p-6 space-y-4 text-xs">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#8A68C7]">
              SAMPLE METADATA · NOT VERIFIED
            </h3>
            
            <dl className="space-y-3 text-stone-700 divide-y divide-stone-100">
              <div className="pt-2 flex justify-between">
                <dt className="text-stone-500 font-mono">Community</dt>
                <dd className="font-medium text-right">{record.community}</dd>
              </div>
              <div className="pt-2 flex justify-between">
                <dt className="text-stone-500 font-mono">Region</dt>
                <dd className="font-medium text-right">{record.region.split('(')[0]}</dd>
              </div>
              <div className="pt-2 flex justify-between">
                <dt className="text-stone-500 font-mono">Language</dt>
                <dd className="font-medium text-right">{record.language || 'Multiple'}</dd>
              </div>
              <div className="pt-2 flex justify-between">
                <dt className="text-stone-500 font-mono">Sensitivity</dt>
                <dd><SensitivityLabel level={record.sensitivity} /></dd>
              </div>
              <div className="pt-2 flex justify-between">
                <dt className="text-stone-500 font-mono">Fixture Date</dt>
                <dd className="font-mono">{record.lastReviewedDate}</dd>
              </div>
            </dl>
          </div>

          {/* Living Practitioners Section */}
          <div className="bg-[#FAF7F2] rounded-xl border border-[#D7C8B3] p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#34205B]">
              <Users className="w-4 h-4 text-[#8A68C7]" />
              <h3 className="font-serif text-base font-medium">
                Related Sample Profiles · Not Verified
              </h3>
            </div>
            
            <p className="text-xs text-stone-600 leading-relaxed">
              These profile fixtures illustrate a possible connection between a record and practitioners; no identity, consent, or relationship is verified here.
            </p>

            {artisans.length === 0 ? (
              <div className="p-4 bg-white rounded-lg border border-stone-200 text-xs text-stone-500">
                No sample profile is linked to this record in the local fixture data.
              </div>
            ) : (
              <div className="space-y-3">
                {artisans.map((artisan) => (
                  <a
                    key={artisan.id}
                    href={`#/artisans/${artisan.slug}`}
                    onClick={(event) => { event.preventDefault(); navigate(`/artisans/${artisan.slug}`); }}
                    className="p-3.5 bg-white rounded-lg border border-stone-200 hover:border-[#8A68C7] transition-all flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34205B]"
                  >
                    <img
                      src={artisan.avatarUrl}
                      alt={artisan.displayName}
                      className="w-12 h-12 rounded-full object-cover shrink-0 border border-stone-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-xs text-[#34205B] group-hover:text-[#8A68C7] truncate">
                        {artisan.displayName}
                      </h4>
                      <p className="text-[11px] text-stone-500 truncate">{artisan.craft}</p>
                      <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-[#8A68C7]" />
                        <span>{artisan.publicLocation}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 group-hover:text-[#34205B] transition-all" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Ask AI Prompt Widget */}
          <div className="bg-white rounded-xl border border-[#D7C8B3] p-5 space-y-3 text-xs">
            <h4 className="font-serif font-medium text-sm text-[#34205B]">
              Explore sample Q&A about this craft
            </h4>
            <p className="text-stone-600 leading-relaxed">
              Preview a canned sample response; no AI service or live retrieval is connected.
            </p>
            <button
              onClick={() => navigate('/ask')}
              className="w-full py-2 text-xs font-medium text-[#34205B] bg-[#F4EFE5] hover:bg-[#D7C8B3]/50 border border-[#D7C8B3] rounded-md transition-colors cursor-pointer"
            >
              Ask CultureLens →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
