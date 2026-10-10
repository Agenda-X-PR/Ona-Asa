import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { apiService } from '../services/apiService';
import { ContributionSubmission, ContributionType, SensitivityLevel } from '../types';
import { 
  HeartHandshake, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Send, 
  BookOpen, 
  AlertCircle,
  FileText,
  Lock
} from 'lucide-react';

export const ContributePage: React.FC = () => {
  const { navigate } = useRouter();

  // Form State
  const [type, setType] = useState<ContributionType>('cultural_story');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [community, setCommunity] = useState('');
  const [region, setRegion] = useState('');
  const [language, setLanguage] = useState('');
  const [sources, setSources] = useState('');
  const [attributionPreference, setAttributionPreference] = useState<'public' | 'pseudonymous' | 'anonymous'>('public');
  const [contributorName, setContributorName] = useState('');
  const [contributorEmail, setContributorEmail] = useState('');
  const [sensitivityLevel, setSensitivityLevel] = useState<SensitivityLevel>('public');
  const [consentGiven, setConsentGiven] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [confirmedSubmission, setConfirmedSubmission] = useState<ContributionSubmission | null>(null);

  // Queue of recent contributions
  const [recentContributions, setRecentContributions] = useState<ContributionSubmission[]>([]);

  useEffect(() => {
    apiService.getRecentContributions()
      .then((items) => setRecentContributions(items.filter((item) => item.sensitivityLevel === 'public')))
      .catch(() => setLoadError(true));
  }, [confirmedSubmission]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Please provide a descriptive title for your contribution.');
      return;
    }
    if (!description.trim() || description.length < 30) {
      setErrorMessage('Please provide a detailed narrative (minimum 30 characters) explaining the cultural context.');
      return;
    }
    if (!community.trim()) {
      setErrorMessage('Please specify the originating community, lineage, or guild.');
      return;
    }
    if (!sources.trim()) {
      setErrorMessage('Please cite your sources, elder testimonies, or archival reference to uphold provenance standards.');
      return;
    }
    if (!contributorEmail.trim() || !contributorEmail.includes('@')) {
      setErrorMessage('Please provide a valid contact email for reviewer communication.');
      return;
    }
    if (!consentGiven) {
      setErrorMessage('You must confirm consent for cultural documentation and review.');
      return;
    }
    if (sensitivityLevel !== 'public') {
      setErrorMessage('This prototype cannot safely accept or store restricted, community-restricted, or sacred knowledge. Choose public sample content, or do not submit it here.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiService.submitContribution({
        type,
        title: title.trim(),
        description: description.trim(),
        community: community.trim(),
        region: region.trim() || 'Southwest Nigeria',
        language: language.trim() || undefined,
        sources: sources.trim(),
        attributionPreference,
        contributorName: contributorName.trim() || undefined,
        contributorEmail: contributorEmail.trim(),
        consentGiven,
        sensitivityLevel
      });

      if (res.success) {
        setConfirmedSubmission(res.submission);
        // Reset inputs
        setTitle('');
        setDescription('');
        setCommunity('');
        setRegion('');
        setLanguage('');
        setSources('');
        setConsentGiven(false);
      }
    } catch {
      setErrorMessage('An error occurred submitting your contribution. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-[#8A68C7]">
          COMMUNITY KNOWLEDGE GOVERNANCE
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#34205B] font-medium tracking-tight">
          Contribute Cultural Knowledge
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
          This prototype saves sample submissions only in this browser. Nothing is sent to a team or reviewer. Do not enter real personal information or restricted, community-restricted, or sacred knowledge.
        </p>
      </div>

      {/* Confirmation Card if Just Submitted */}
      {confirmedSubmission && (
        <div className="p-6 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-medium text-emerald-950">
                Demo Contribution Saved in This Browser
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                This is a local demo receipt only. No reviewer has received this submission, no review is scheduled, and no email will be sent. The sample data remains in this browser until its local storage is cleared.
              </p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs font-mono flex flex-wrap items-center justify-between gap-2">
            <span>REFERENCE: {confirmedSubmission.reference}</span>
            <span>STATUS: LOCAL DEMO ONLY</span>
            <span>DATE: {new Date(confirmedSubmission.submittedAt).toLocaleDateString()}</span>
          </div>

          <button
            onClick={() => setConfirmedSubmission(null)}
            className="text-xs font-medium text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
          >
            Submit an additional record or correction →
          </button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-2xl border-2 border-[#D7C8B3] shadow-sm space-y-8">
        
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Contribution Type */}
        <div className="space-y-3">
          <label className="block text-xs font-mono uppercase tracking-wider text-stone-700">
            1. CONTRIBUTION CATEGORY *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {[
              { id: 'cultural_story', label: 'Cultural Story & History' },
              { id: 'craft_technique', label: 'Craft Technique / Loom Spec' },
              { id: 'oral_history', label: 'Elder Oral Testimony' },
              { id: 'correction', label: 'Archival Correction' },
              { id: 'photo_archive', label: 'Photographic Documentation' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setType(cat.id as ContributionType)}
                className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                  type === cat.id
                    ? 'bg-[#34205B] text-white border-[#34205B]'
                    : 'bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-stone-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Title & Description */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Title of Contribution *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Traditional Etu Dyeing Techniques of the Oyo Weavers..."
              className="w-full p-3 rounded-lg border border-[#D7C8B3] text-stone-900 text-sm focus:ring-2 focus:ring-[#34205B]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Detailed Narrative & Cultural Context *
            </label>
            <textarea
              rows={5}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the background, materials, significance, and cultural lineage..."
              className="w-full p-3 rounded-lg border border-[#D7C8B3] text-stone-900 text-sm focus:ring-2 focus:ring-[#34205B]"
            />
          </div>
        </div>

        {/* 3. Community Provenance Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-medium text-stone-700 mb-1">Originating Community *</label>
            <input
              type="text"
              required
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              placeholder="e.g. Iseyin Weavers Guild"
              className="w-full p-2.5 rounded-lg border border-[#D7C8B3] text-stone-900 focus:ring-2 focus:ring-[#34205B]"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Geographic Region</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. Oyo State / Southwest"
              className="w-full p-2.5 rounded-lg border border-[#D7C8B3] text-stone-900 focus:ring-2 focus:ring-[#34205B]"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Indigenous Language / Dialect</label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g. Yorùbá (Ọ̀yọ́ dialect)"
              className="w-full p-2.5 rounded-lg border border-[#D7C8B3] text-stone-900 focus:ring-2 focus:ring-[#34205B]"
            />
          </div>
        </div>

        {/* 4. Sources & Supporting Citations (Mandatory) */}
        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">
            Supporting Sources or Elder Attribution *
          </label>
          <textarea
            rows={3}
            required
            value={sources}
            onChange={(e) => setSources(e.target.value)}
            placeholder="Enter sample citation text for the interface demo; this form does not validate sources..."
            className="w-full p-3 rounded-lg border border-[#D7C8B3] text-stone-900 text-xs focus:ring-2 focus:ring-[#34205B]"
          />
          <p className="text-[11px] text-stone-500 mt-1">
            A source field is required to preview the form. This demo does not check citations, approve content, or publish to an archive.
          </p>
        </div>

        {/* 5. Sensitivity Level */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-stone-700">
            5. SENSITIVITY & ACCESS LEVEL *
          </label>
          <p className="text-xs text-amber-800">This prototype blocks saving anything except public-sensitivity demo content. It has no secure access controls.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {[
              { level: 'public', label: 'Public Sample', desc: 'Public-sensitivity demo text only; not verified or published' },
              { level: 'community_restricted', label: 'Community Restricted', desc: 'Would require permission and access controls; not accepted here' },
              { level: 'sacred', label: 'Sacred / Closed Protocol', desc: 'Not accepted in this prototype; do not enter' }
            ].map((s) => (
              <label
                key={s.level}
                className={`p-3 rounded-lg border cursor-pointer flex flex-col justify-between ${
                  sensitivityLevel === s.level
                    ? 'bg-[#34205B]/5 border-[#34205B] ring-1 ring-[#34205B]'
                    : 'bg-white border-stone-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sensitivity"
                    checked={sensitivityLevel === s.level}
                    onChange={() => setSensitivityLevel(s.level as SensitivityLevel)}
                    className="text-[#34205B]"
                  />
                  <span className="font-medium text-stone-900">{s.label}</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">{s.desc}</p>
              </label>
            ))}
          </div>
        </div>

        {/* 6. Attribution Preferences & Contact */}
        <div className="space-y-3 pt-4 border-t border-stone-200 text-xs">
          <label className="block font-mono uppercase tracking-wider text-stone-700">
            6. ATTRIBUTION & CONTACT
          </label>

          <div className="flex flex-wrap gap-4">
            {[
              { id: 'public', label: 'Show Sample Name in This Browser' },
              { id: 'pseudonymous', label: 'Use Sample Initials' },
              { id: 'anonymous', label: 'Hide Attribution in This Browser' }
            ].map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="attribution"
                  checked={attributionPreference === opt.id}
                  onChange={() => setAttributionPreference(opt.id as 'public' | 'pseudonymous' | 'anonymous')}
                  className="text-[#34205B]"
                />
                <span className="text-stone-800">{opt.label}</span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {attributionPreference !== 'anonymous' && (
              <div>
                <label className="block text-stone-700 mb-1">Your Display Name</label>
                <input
                  type="text"
                  value={contributorName}
                  onChange={(e) => setContributorName(e.target.value)}
                  placeholder="Sample Contributor"
                  className="w-full p-2.5 rounded-lg border border-[#D7C8B3] text-stone-900 focus:ring-2 focus:ring-[#34205B]"
                />
              </div>
            )}

            <div className={attributionPreference === 'anonymous' ? 'sm:col-span-2' : ''}>
            <label className="block text-stone-700 mb-1">Demo Contact Email *</label>
              <input
                type="email"
                required
                value={contributorEmail}
                onChange={(e) => setContributorEmail(e.target.value)}
                placeholder="demo@example.invalid"
                className="w-full p-2.5 rounded-lg border border-[#D7C8B3] text-stone-900 focus:ring-2 focus:ring-[#34205B]"
              />
              <span className="text-[10px] text-stone-500">
                Use a placeholder address only. This prototype stores it in this browser and does not contact reviewers.
              </span>
            </div>
          </div>
        </div>

        {/* 7. Consent Checkbox */}
        <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#D7C8B3] space-y-2">
          <label className="flex items-start gap-3 cursor-pointer text-xs text-stone-700">
            <input
              type="checkbox"
              required
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-0.5 text-[#34205B] focus:ring-[#34205B] rounded"
            />
            <span className="leading-relaxed">
              I confirm that the public sample content I enter is suitable for this browser-only demonstration. I understand it is not sent for preservation or peer review.
            </span>
          </label>
        </div>

        {/* Submission Action */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-mono text-stone-500">
            LOCAL BROWSER DEMO · NOT SENT
          </span>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 text-sm font-medium text-white bg-[#34205B] hover:bg-[#251642] disabled:opacity-50 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Demo Locally...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Save Demo Locally</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* Local Browser Demo Register */}
      <div className="bg-white rounded-2xl border border-[#D7C8B3] p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#8A68C7]">
              THIS BROWSER ONLY · PUBLIC-SENSITIVITY DEMO ITEMS
            </span>
            <h3 className="font-serif text-xl font-medium text-[#34205B]">
              Local Demo Submissions
            </h3>
          </div>
          <span className="font-mono text-xs text-stone-500">
            {recentContributions.length} local items
          </span>
        </div>

        <div className="space-y-3">
          {loadError && <p role="alert" className="text-sm text-rose-800">Local demo entries could not be loaded.</p>}
          {!loadError && recentContributions.length === 0 && <p className="text-sm text-stone-500">No public-sensitivity demo submissions are saved in this browser.</p>}
          {recentContributions.map((c) => (
            <div key={c.id} className="p-4 bg-[#FAF7F2] rounded-xl border border-stone-200 text-xs space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-stone-900">{c.title}</span>
                <span className="font-mono text-[11px] text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded">
                  LOCAL DEMO · NOT REVIEWED
                </span>
              </div>
              <p className="text-stone-600 line-clamp-1">{c.description}</p>
              <div className="flex items-center gap-3 text-stone-500 font-mono text-[11px] pt-1">
                <span>REF: {c.reference}</span>
                <span>COMMUNITY: {c.community}</span>
                <span>SUBMITTED: {new Date(c.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
