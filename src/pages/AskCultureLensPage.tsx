import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { apiService } from '../services/apiService';
import { QnAResponse, CulturalRecord, ArtisanProfile } from '../types';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle,
  Users
} from 'lucide-react';

export const AskCultureLensPage: React.FC = () => {
  const { navigate } = useRouter();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<QnAResponse | null>(null);
  const [groundedRecords, setGroundedRecords] = useState<CulturalRecord[]>([]);
  const [associatedArtisans, setAssociatedArtisans] = useState<ArtisanProfile[]>([]);

  const exampleQuestions = [
    {
      label: 'Natural Indigo in Adire',
      query: 'What is the cultural and symbolic meaning of natural indigo in Yoruba Adire?'
    },
    {
      label: 'Loom Weaving Traditions',
      query: 'How does Aso-Oke weaving differ between traditional horizontal and vertical looms?'
    },
    {
      label: 'Benin Bronze Lost-Wax',
      query: 'What materials and techniques were used in ancient Benin bronze casting?'
    },
    {
      label: 'Royal Beaded Regalia',
      query: 'Who makes authentic royal Yoruba Ileke beads and what do the colors signify?'
    }
  ];

  const handleAsk = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setResponse(null);
    setGroundedRecords([]);
    setAssociatedArtisans([]);

    try {
      const res = await apiService.askCulturalQuestion(queryText);
      setResponse(res);

      // Load referenced records
      if (res.groundedRecordSlugs.length > 0) {
        const recList: CulturalRecord[] = [];
        for (const slug of res.groundedRecordSlugs) {
          const r = await apiService.getCulturalRecordBySlug(slug);
          if (r) recList.push(r);
        }
        setGroundedRecords(recList);
      }

      // Load associated artisans
      if (res.associatedArtisanIds.length > 0) {
        const artList: ArtisanProfile[] = [];
        for (const aId of res.associatedArtisanIds) {
          const a = await apiService.getArtisanById(aId);
          if (a) artList.push(a);
        }
        setAssociatedArtisans(artList);
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(question);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#8A68C7]">
          <Sparkles className="w-4 h-4" />
          <span>GEMMA AI · GROUNDED CULTURAL DISCOVERY</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#34205B] font-medium tracking-tight">
          Ask CultureLens
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
          Inquire into Nigerian cultural practices, craft techniques, and historical origins. Answers are strictly grounded in verified platform archives. If verifiable evidence is absent or disputed, the system acknowledges the boundary rather than fabricating information.
        </p>
      </div>

      {/* Question Input Console */}
      <div className="bg-white p-6 rounded-2xl border-2 border-[#D7C8B3] shadow-sm space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-xs font-mono uppercase tracking-wider text-stone-500">
            ENTER YOUR CULTURAL QUESTION
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What is the symbolic meaning of Indigo in Yoruba Adire?..."
              className="w-full py-3.5 pl-4 pr-28 text-sm sm:text-base rounded-lg border border-[#D7C8B3] text-[#241F2B] focus:outline-none focus:ring-2 focus:ring-[#34205B]"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="absolute right-2 px-5 py-2 text-xs sm:text-sm font-medium text-white bg-[#34205B] hover:bg-[#251642] disabled:opacity-50 rounded-md transition-colors cursor-pointer"
            >
              {loading ? 'Consulting...' : 'Ask'}
            </button>
          </div>
        </form>

        {/* Example Query Prompts */}
        <div className="pt-2 border-t border-stone-100 space-y-2">
          <span className="text-xs text-stone-500 font-mono block">SAMPLE PROMPTS:</span>
          <div className="flex flex-wrap gap-2">
            {exampleQuestions.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => {
                  setQuestion(ex.query);
                  handleAsk(ex.query);
                }}
                className="px-3 py-1.5 text-xs text-[#34205B] bg-[#F4EFE5] hover:bg-[#D7C8B3]/60 border border-[#D7C8B3] rounded-md transition-colors cursor-pointer text-left"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-8 bg-white rounded-xl border border-[#D7C8B3] text-center space-y-3 animate-pulse">
          <div className="w-8 h-8 border-2 border-[#34205B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-wider text-stone-600">
            Retrieving verified records & evaluating evidence...
          </p>
        </div>
      )}

      {/* Answer Presentation Card */}
      {response && !loading && (
        <div className="bg-white rounded-2xl border border-[#D7C8B3] overflow-hidden shadow-sm space-y-6 p-6 sm:p-8 animate-in fade-in duration-200">
          
          {/* Question Echo */}
          <div className="border-b border-[#D7C8B3]/50 pb-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400">
              USER INQUIRY
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-[#34205B] font-medium mt-1">
              "{response.question}"
            </h2>
          </div>

          {/* Grounded Answer Body */}
          <div className="space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#8A68C7]">
              GROUNDED SYNTHESIS
            </span>
            <div className="text-sm sm:text-base text-stone-800 leading-relaxed font-sans space-y-3">
              <p>{response.answer}</p>
            </div>
          </div>

          {/* Uncertainty or Conflict Notes (PRD Requirement FR-025) */}
          {response.uncertaintyOrDisputeNotes && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-amber-900 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Regional Variation & Nuance Note</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                {response.uncertaintyOrDisputeNotes}
              </p>
            </div>
          )}

          {/* Traceable Platform Records (PRD FR-024) */}
          {groundedRecords.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-[#D7C8B3]/50">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block">
                RETRIEVED ARCHIVE SOURCES
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {groundedRecords.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => navigate(`/culture/${rec.slug}`)}
                    className="p-3.5 bg-[#FAF7F2] rounded-lg border border-stone-200 hover:border-[#8A68C7] transition-all cursor-pointer group flex items-start justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-serif text-xs font-medium text-[#34205B] group-hover:text-[#8A68C7]">
                        {rec.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">{rec.community}</p>
                      <span className="text-[10px] font-mono text-emerald-800 mt-1 block">
                        VERIFIED ENTRY
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform shrink-0 mt-1" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Associated Artisans (Connecting knowledge to real practitioners) */}
          {associatedArtisans.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-[#D7C8B3]/50">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block">
                CONNECTED LIVING ARTISANS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {associatedArtisans.map((artisan) => (
                  <div
                    key={artisan.id}
                    onClick={() => navigate(`/artisans/${artisan.slug}`)}
                    className="p-3.5 bg-[#FAF7F2] rounded-lg border border-stone-200 hover:border-[#8A68C7] transition-all cursor-pointer group flex items-center gap-3"
                  >
                    <img
                      src={artisan.avatarUrl}
                      alt={artisan.displayName}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-xs text-[#34205B] group-hover:text-[#8A68C7] truncate">
                        {artisan.displayName}
                      </h5>
                      <p className="text-[11px] text-stone-500 truncate">{artisan.craft}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Architecture & AI Grounding Governance Card */}
      <div className="p-6 bg-[#FAF7F2] rounded-xl border border-[#D7C8B3] space-y-3 text-xs text-stone-700">
        <div className="flex items-center gap-2 text-[#34205B] font-medium text-sm">
          <ShieldCheck className="w-4 h-4 text-[#8A68C7]" />
          <span>Architectural Integrity Notice</span>
        </div>
        <p className="leading-relaxed">
          CultureLens strictly follows Team Àṣà’s AI principles. We do not use general-purpose ungrounded generation. Factual answers rely exclusively on retrieved platform records. When Member A deploys the backend Gemma adapter, real-time embedding matching will run directly on our PostgreSQL database.
        </p>
      </div>

    </div>
  );
};
