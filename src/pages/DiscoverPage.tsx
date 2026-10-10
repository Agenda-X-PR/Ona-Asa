import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { apiService } from '../services/apiService';
import { CulturalRecord } from '../types';
import { CulturalStatusLabel } from '../components/common/StatusIndicators';
import { Search, Filter, RotateCcw, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';

export const DiscoverPage: React.FC = () => {
  const { navigate, searchQuery, setSearchQuery } = useRouter();
  const [records, setRecords] = useState<CulturalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const categories = [
    'All Categories',
    'Textiles',
    'Pottery & Ceramics',
    'Beadwork',
    'Metalcraft & Bronze',
    'Oral Heritage'
  ];

  const statuses = [
    { label: 'All Review States', value: '' },
    { label: 'Archivally Documented', value: 'documented' },
    { label: 'Community Reviewed', value: 'community_reviewed' },
    { label: 'Under Peer Review', value: 'under_review' },
    { label: 'Contested', value: 'disputed' },
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setLoadError(false);

    const categoryParam = selectedCategory === 'All Categories' ? '' : selectedCategory;
    apiService.getCulturalRecords(searchQuery, categoryParam, selectedStatus)
      .then((data) => {
        if (isMounted) {
          setRecords(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoadError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedCategory, selectedStatus, retryCount]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStatus('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* Header & Curatorial Context */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-[#8A68C7]">
          CULTURAL RECORD PROTOTYPE
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#34205B] font-medium tracking-tight">
          Cultural Discovery
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Search the illustrative record fixtures in this prototype. Their citations and cultural claims have not been independently verified.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-xl border border-[#D7C8B3] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              id="culture-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by craft, community, region, or keyword (e.g. Aso-Oke, Indigo, Benin)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-[#D7C8B3] text-[#241F2B] focus:outline-none focus:ring-2 focus:ring-[#34205B]"
            />
          </div>

              {/* Category Filter */}
              <label htmlFor="culture-category" className="sr-only">Filter by category</label>
          <div className="w-full md:w-56">
            <select
              id="culture-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-3 text-sm rounded-lg border border-[#D7C8B3] bg-white text-[#241F2B] focus:outline-none focus:ring-2 focus:ring-[#34205B]"
            >
              {categories.map((c) => (
                <option key={c} value={c === 'All Categories' ? '' : c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

              {/* Status Filter */}
              <label htmlFor="culture-review-status" className="sr-only">Filter by fixture review label</label>
          <div className="w-full md:w-56">
            <select
              id="culture-review-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2.5 px-3 text-sm rounded-lg border border-[#D7C8B3] bg-white text-[#241F2B] focus:outline-none focus:ring-2 focus:ring-[#34205B]"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(searchQuery || selectedCategory || selectedStatus) && (
            <button
              onClick={handleReset}
              className="text-xs font-medium text-stone-500 hover:text-[#34205B] inline-flex items-center gap-1.5 py-2 px-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

        </div>

        {/* Filter Summary Tags (Unboxed Text with Separators) */}
        <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-500 font-sans">
          <div className="flex items-center gap-2">
            <span>Showing {records.length} fixture records</span>
            {searchQuery && (
              <>
                <span aria-hidden="true">·</span>
                <span>Keyword: "{searchQuery}"</span>
              </>
            )}
            {selectedCategory && (
              <>
                <span aria-hidden="true">·</span>
                <span>Category: {selectedCategory}</span>
              </>
            )}
          </div>
          <span className="font-mono text-[11px] text-[#8A68C7]">
            SAMPLE FIXTURES · VERIFY BEFORE RELYING ON THEM
          </span>
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#34205B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-wider text-stone-500">
            Loading local sample records...
          </p>
        </div>
      ) : loadError ? (
        <div role="alert" className="bg-rose-50 rounded-xl border border-rose-200 p-8 text-center max-w-xl mx-auto space-y-4">
          <AlertCircle className="w-8 h-8 text-rose-700 mx-auto" />
          <h3 className="font-serif text-xl font-medium text-rose-900">The sample archive could not be loaded</h3>
          <p className="text-sm text-rose-800">This prototype could not retrieve its local fixture data. Please try again.</p>
          <button onClick={() => setRetryCount((count) => count + 1)} className="px-4 py-2 text-xs font-medium text-white bg-[#34205B] rounded-md">
            Retry
          </button>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#D7C8B3] p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#F4EFE5] flex items-center justify-center mx-auto text-stone-500">
            <AlertCircle className="w-6 h-6 text-[#8A68C7]" />
          </div>
          <h3 className="font-serif text-xl font-medium text-[#34205B]">
            No sample records matched your search
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            The current sample dataset has no match for these terms. You can clear filters or preview the local-only contribution form.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-xs font-medium bg-stone-100 hover:bg-stone-200 rounded-md transition-colors cursor-pointer"
            >
              Clear filters
            </button>
            <button
              onClick={() => navigate('/contribute')}
              className="px-4 py-2 text-xs font-medium text-white bg-[#34205B] hover:bg-[#251642] rounded-md transition-colors cursor-pointer"
            >
              Contribute this topic
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {records.map((record) => (
            <article key={record.id} className="group bg-white rounded-xl border border-[#D7C8B3]/70 overflow-hidden hover:shadow-md hover:border-[#8A68C7] transition-all flex flex-col justify-between">
              <a href={`#/culture/${record.slug}`} onClick={(event) => { event.preventDefault(); navigate(`/culture/${record.slug}`); }} className="flex h-full flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#34205B]" aria-label={`Read sample record: ${record.title}`}>
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <img
                    src={record.imageUrl}
                    alt={record.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {record.nativeName && (
                    <div className="absolute top-3 left-3 bg-[#241F2B]/80 backdrop-blur-sm text-[#F4EFE5] text-[11px] font-mono px-2.5 py-1 rounded-sm">
                      {record.nativeName}
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-sans">
                    <span>{record.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{record.region.split('(')[0].trim()}</span>
                  </div>

                  <h2 className="font-serif text-xl font-medium text-[#34205B] group-hover:text-[#8A68C7] transition-colors leading-snug">
                    {record.title}
                  </h2>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {record.shortDescription}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[#D7C8B3]/40 flex items-center justify-between text-xs bg-[#FAF7F2]">
                <CulturalStatusLabel status={record.status} />
                <span className="text-[#34205B] font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Read Record <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
              </a>
            </article>
          ))}
        </div>
      )}

      {/* Contribution Callout */}
      <div className="border-t border-[#D7C8B3] pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#8A68C7]" />
          <span>Notice an omission or wish to document a regional variant?</span>
        </div>
        <button
          onClick={() => navigate('/contribute')}
          className="text-xs font-medium text-[#34205B] hover:text-[#8A68C7] underline underline-offset-4 cursor-pointer"
        >
          Preview the local-only contribution form →
        </button>
      </div>

    </div>
  );
};
