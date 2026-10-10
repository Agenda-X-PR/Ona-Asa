import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { apiService } from '../services/apiService';
import { CulturalExperience, ArtisanProfile } from '../types';
import { Clock, MapPin, Search, RotateCcw, ArrowRight, Calendar, Users, ShieldCheck } from 'lucide-react';

export const ExperiencesPage: React.FC = () => {
  const { navigate } = useRouter();
  const [experiences, setExperiences] = useState<CulturalExperience[]>([]);
  const [artisansMap, setArtisansMap] = useState<Record<string, ArtisanProfile>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All Categories',
    'Textiles',
    'Beadwork',
    'Pottery & Ceramics',
    'Metalcraft & Bronze'
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setLoadError(false);

    const catParam = categoryFilter === 'All Categories' ? '' : categoryFilter;
    apiService.getExperiences(catParam).then(async (data) => {
      if (!isMounted) return;

      const filtered = data.filter((exp) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          exp.title.toLowerCase().includes(q) ||
          exp.craft.toLowerCase().includes(q) ||
          exp.shortSummary.toLowerCase().includes(q) ||
          exp.locationMeetingPoint.toLowerCase().includes(q)
        );
      });

      // Load artisan display names
      const aMap: Record<string, ArtisanProfile> = {};
      for (const e of filtered) {
        if (!aMap[e.artisanId]) {
          const a = await apiService.getArtisanById(e.artisanId);
          if (a) aMap[e.artisanId] = a;
        }
      }

      setArtisansMap(aMap);
      setExperiences(filtered);
      setLoading(false);
    }).catch(() => {
      if (isMounted) {
        setLoadError(true);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [categoryFilter, searchQuery, retryCount]);

  const handleReset = () => {
    setCategoryFilter('');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-[#8A68C7]">
          ARTISAN-LED WORKSHOPS & IMMERSIONS
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#34205B] font-medium tracking-tight">
          Cultural Experiences
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Preview illustrative workshop listings and their booking interface. These sample sessions are not confirmed, bookable, or evidence of artisan participation or compensation.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-xl border border-[#D7C8B3] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiences by craft, keyword, or location..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-[#D7C8B3] text-[#241F2B] focus:outline-none focus:ring-2 focus:ring-[#34205B]"
            />
          </div>

          <div className="w-full sm:w-64">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2.5 px-3 text-sm rounded-lg border border-[#D7C8B3] bg-white text-[#241F2B] focus:outline-none focus:ring-2 focus:ring-[#34205B]"
            >
              {categories.map((c) => (
                <option key={c} value={c === 'All Categories' ? '' : c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {(categoryFilter || searchQuery) && (
            <button
              onClick={handleReset}
              className="text-xs font-medium text-stone-500 hover:text-[#34205B] inline-flex items-center gap-1.5 py-2 px-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-sans">
          <span>Showing {experiences.length} sample workshops</span>
          <span className="font-mono text-[11px] text-[#8A68C7]">
            ILLUSTRATIVE FIXTURES · NOT BOOKABLE
          </span>
        </div>
      </div>

      {/* Experiences Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#34205B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-wider text-stone-500">
            Loading cultural experiences...
          </p>
        </div>
      ) : loadError ? (
        <div role="alert" className="bg-rose-50 rounded-xl border border-rose-200 p-8 text-center max-w-xl mx-auto space-y-4">
          <p className="text-sm text-rose-900">The local sample workshop data could not be loaded.</p>
          <button onClick={() => setRetryCount((count) => count + 1)} className="px-4 py-2 text-xs font-medium text-white bg-[#34205B] rounded-md">Retry</button>
        </div>
      ) : experiences.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#D7C8B3] p-12 text-center max-w-xl mx-auto space-y-4">
          <p className="font-serif text-lg text-[#34205B]">No experiences matched your search criteria.</p>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-xs font-medium bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experiences.map((exp) => {
            const artisan = artisansMap[exp.artisanId];
            const nextSession = exp.sessions.find(s => s.status === 'available');

            return (
              <article key={exp.id} className="group bg-white rounded-xl border border-[#D7C8B3]/80 overflow-hidden hover:shadow-md hover:border-[#8A68C7] transition-all flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/9] overflow-hidden bg-stone-100">
                    <img
                      src={exp.imageUrl}
                      alt={exp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-[#241F2B]/80 text-[#F4EFE5] text-[11px] font-mono px-2.5 py-1 rounded-sm">
                      {exp.category}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-[#34205B] text-[11px] font-mono px-2.5 py-1 rounded-sm flex items-center gap-1.5 font-medium">
                      <Clock className="w-3 h-3 text-[#8A68C7]" />
                      <span>{exp.durationHours} Hours</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h2 className="font-serif text-xl font-medium text-[#34205B] group-hover:text-[#8A68C7] transition-colors leading-snug">
                      <a href={`#/experiences/${exp.slug}`} onClick={(event) => { event.preventDefault(); navigate(`/experiences/${exp.slug}`); }} className="focus-visible:outline-none focus-visible:underline">{exp.title}</a>
                    </h2>

                    {artisan && (
                      <p className="text-xs text-stone-500 font-sans">
                        Sample profile association · <strong className="text-stone-800 font-medium">{artisan.displayName}</strong> ({artisan.craft})
                      </p>
                    )}

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {exp.shortSummary}
                    </p>

                    <div className="pt-2 text-xs text-stone-500 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#8A68C7] shrink-0" />
                      <span className="truncate">{exp.locationMeetingPoint}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-[#D7C8B3]/40 bg-[#FAF7F2] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-500 block">Sample price · not an offer</span>
                    <span className="font-mono text-base font-semibold text-[#34205B]">
                      ₦{exp.priceNaira.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {nextSession && (
                      <span className="text-[11px] text-stone-500 font-mono hidden sm:inline">
                        Sample date: {nextSession.date}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/experiences/${exp.slug}`);
                      }}
                      className="px-4 py-2 text-xs font-medium text-white bg-[#34205B] hover:bg-[#251642] rounded-md transition-colors cursor-pointer"
                    >
                      Preview details
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Commercial & Payment Boundary Disclosure */}
      <div className="p-5 bg-white/70 rounded-xl border border-[#D7C8B3] text-xs text-stone-600 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-[#8A68C7] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-stone-800">Prototype notice:</strong> Dates, capacities, prices, locations, and artisan associations are illustrative fixtures only. No booking or payment service is connected, and these listings do not establish an artisan's participation or compensation.
        </p>
      </div>

    </div>
  );
};
