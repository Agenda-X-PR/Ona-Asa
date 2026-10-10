import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { apiService } from '../services/apiService';
import { ArtisanProfile } from '../types';
import { ArtisanVerificationLabel } from '../components/common/StatusIndicators';
import { Search, MapPin, ArrowRight, RotateCcw, ShieldCheck, Calendar, Sparkles } from 'lucide-react';

export const ArtisansPage: React.FC = () => {
  const { navigate } = useRouter();
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [craftFilter, setCraftFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const craftOptions = [
    'All Crafts',
    'Textiles',
    'Weaving',
    'Indigo Dyeing',
    'Beadwork',
    'Pottery & Ceramics',
    'Metalcraft & Bronze'
  ];

  const locationOptions = [
    'All Locations',
    'Lagos Island',
    'Mainland',
    'Lekki',
    'Surulere',
    'Ikeja'
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const craftParam = craftFilter === 'All Crafts' ? '' : craftFilter;
    const locParam = locationFilter === 'All Locations' ? '' : locationFilter;

    apiService.getArtisans(craftParam, locParam).then((data) => {
      if (!isMounted) return;
      const filtered = data.filter((art) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          art.displayName.toLowerCase().includes(q) ||
          art.craft.toLowerCase().includes(q) ||
          art.bio.toLowerCase().includes(q) ||
          art.publicLocation.toLowerCase().includes(q)
        );
      });
      setArtisans(filtered);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [craftFilter, locationFilter, searchQuery]);

  const handleReset = () => {
    setCraftFilter('');
    setLocationFilter('');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* Header & Artisan Agency Note */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-[#8A68C7]">
          HERITAGE CUSTODIANS & GUILDS
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#34205B] font-medium tracking-tight">
          Artisan Directory
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Connect with traditional makers, weavers, ceramicists, and metalworkers in Lagos and surrounding cultural corridors. Every listed artisan has chosen their public profile fields, workshop locations, and availability.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-xl border border-[#D7C8B3] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artisan name, craft, or specialty..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-[#D7C8B3] text-[#241F2B] focus:outline-none focus:ring-2 focus:ring-[#34205B]"
            />
          </div>

          <div className="w-full md:w-56">
            <select
              value={craftFilter}
              onChange={(e) => setCraftFilter(e.target.value)}
              className="w-full py-2.5 px-3 text-sm rounded-lg border border-[#D7C8B3] bg-white text-[#241F2B] focus:outline-none focus:ring-2 focus:ring-[#34205B]"
            >
              {craftOptions.map((c) => (
                <option key={c} value={c === 'All Crafts' ? '' : c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-56">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full py-2.5 px-3 text-sm rounded-lg border border-[#D7C8B3] bg-white text-[#241F2B] focus:outline-none focus:ring-2 focus:ring-[#34205B]"
            >
              {locationOptions.map((l) => (
                <option key={l} value={l === 'All Locations' ? '' : l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {(craftFilter || locationFilter || searchQuery) && (
            <button
              onClick={handleReset}
              className="text-xs font-medium text-stone-500 hover:text-[#34205B] inline-flex items-center gap-1.5 py-2 px-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

        </div>

        {/* Clean unboxed metadata strip */}
        <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-500 font-sans">
          <div className="flex items-center gap-2">
            <span>Showing {artisans.length} active practitioners</span>
            {craftFilter && (
              <>
                <span aria-hidden="true">·</span>
                <span>Craft: {craftFilter}</span>
              </>
            )}
            {locationFilter && (
              <>
                <span aria-hidden="true">·</span>
                <span>Area: {locationFilter}</span>
              </>
            )}
          </div>
          <span className="font-mono text-[11px] text-[#8A68C7]">
            VERIFIED GUILD LISTINGS
          </span>
        </div>
      </div>

      {/* Artisan Cards Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#34205B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-wider text-stone-500">
            Querying artisan registry...
          </p>
        </div>
      ) : artisans.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#D7C8B3] p-12 text-center max-w-xl mx-auto space-y-4">
          <p className="font-serif text-lg text-[#34205B]">No artisans matched your current filters.</p>
          <p className="text-xs text-stone-600">
            CultureLens only presents genuine registered practitioners and never generates artificial filler profiles.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-xs font-medium bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artisans.map((artisan) => (
            <article
              key={artisan.id}
              onClick={() => navigate(`/artisans/${artisan.slug}`)}
              className="group cursor-pointer bg-white rounded-xl border border-[#D7C8B3]/80 overflow-hidden hover:shadow-md hover:border-[#8A68C7] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Profile Image & Native Title */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <img
                    src={artisan.avatarUrl}
                    alt={artisan.displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {artisan.nativeTitle && (
                    <div className="absolute top-3 left-3 bg-[#241F2B]/85 backdrop-blur-sm text-[#F4EFE5] text-[11px] font-mono px-2.5 py-1 rounded-sm">
                      {artisan.nativeTitle}
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-[#34205B] text-[11px] font-mono px-2 py-0.5 rounded-sm">
                    {artisan.experienceYears} Yrs Practice
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-3">
                  <div>
                    <h2 className="font-serif text-xl font-medium text-[#34205B] group-hover:text-[#8A68C7] transition-colors">
                      {artisan.displayName}
                    </h2>
                    <p className="text-xs text-[#8A68C7] font-medium mt-0.5">{artisan.craft}</p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-[#8A68C7]" />
                    <span>{artisan.publicLocation}</span>
                  </div>

                  <blockquote className="text-xs italic text-stone-600 border-l border-[#8A68C7]/40 pl-2.5 py-0.5 line-clamp-2">
                    "{artisan.quote}"
                  </blockquote>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {artisan.bio}
                  </p>
                </div>
              </div>

              {/* Footer Strip */}
              <div className="px-6 py-4 border-t border-[#D7C8B3]/40 bg-[#FAF7F2] flex items-center justify-between text-xs">
                <ArtisanVerificationLabel status={artisan.verificationStatus} />
                <span className="text-[#34205B] font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  View Profile <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Illustrative Demo Safety Note */}
      <div className="p-4 bg-white/60 rounded-xl border border-[#D7C8B3] text-xs text-stone-600 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-[#8A68C7] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-stone-800">Demonstration Integrity:</strong> These profiles represent real traditional disciplines and illustrative master artisans prepared for Hack for Humanity Lagos. In production, every artisan profile undergoes verified guild authentication and explicit consent checks before publication.
        </p>
      </div>

    </div>
  );
};
