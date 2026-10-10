import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { CULTURAL_RECORDS, ARTISANS, EXPERIENCES } from '../data/mockData';
import { CulturalStatusLabel, ArtisanVerificationLabel } from '../components/common/StatusIndicators';
import heroImg from '../assets/images/hero_nigerian_crafts_1791632798829.jpg';
import { 
  Search, 
  ArrowRight, 
  Compass, 
  BookOpen, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate, setSearchQuery } = useRouter();
  const [localSearch, setLocalSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      navigate('/discover');
    } else {
      navigate('/discover');
    }
  };

  const handleQuickTopic = (topic: string) => {
    setSearchQuery(topic);
    navigate('/discover');
  };

  // Curated slice of records
  const featuredStories = CULTURAL_RECORDS.slice(0, 3);
  const featuredArtisans = ARTISANS.slice(0, 3);
  const featuredExperiences = EXPERIENCES.slice(0, 2);

  return (
    <div className="space-y-20 lg:space-y-28 pb-20">
      
      {/* 1. Hero Section: Editorial Split with Full 1440px Balance */}
      <section className="relative pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            
            {/* Left Column: Editorial Headline & Search */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6 lg:pr-4">
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-widest text-[#8A68C7]">
                  LAGOS · SOUTHWEST CORRIDOR · CULTURAL KNOWLEDGE PLATFORM
                </div>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#34205B] font-medium tracking-tight leading-[1.12] text-balance">
                  Every tradition holds a story.
                </h1>
              </div>

              <p className="text-base sm:text-lg text-[#241F2B]/85 font-sans leading-relaxed max-w-2xl">
                Discover documented Nigerian cultural heritage, uncover the ancestral context behind ancient practices, and connect directly with the master artisans who preserve these living crafts.
              </p>

              {/* Cultural Search Bar */}
              <form onSubmit={handleSearchSubmit} className="pt-2">
                <div className="relative flex items-center shadow-sm border border-[#D7C8B3] rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#34205B] focus-within:border-transparent transition-all">
                  <div className="pl-4 text-[#8A68C7]">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Search by craft, community, tradition, or city (e.g. Aso-Òkè, Adire, Benin)..."
                    className="w-full py-4 pl-3 pr-28 text-sm sm:text-base text-[#241F2B] placeholder:text-stone-400 focus:outline-none"
                    aria-label="Cultural discovery search"
                  />
                  <div className="absolute right-2">
                    <button
                      type="submit"
                      className="px-4 py-2.5 text-xs sm:text-sm font-medium text-white bg-[#34205B] hover:bg-[#251642] rounded-md transition-colors cursor-pointer"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* Quick Topic Prompts */}
                <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-[#241F2B]/70">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-stone-500">Explore topics:</span>
                  {['Aso-Òkè Weaving', 'Adire Eleko Indigo', 'Royal Ileke Beads', 'Terracotta Pottery', 'Lost-Wax Bronze'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleQuickTopic(t)}
                      className="hover:text-[#34205B] hover:underline cursor-pointer transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </form>

              {/* Dual Primary CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('/discover')}
                  className="px-6 py-3 text-sm font-medium text-white bg-[#34205B] hover:bg-[#251642] rounded-md transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Explore culture</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/artisans')}
                  className="px-6 py-3 text-sm font-medium text-[#34205B] bg-[#D7C8B3]/40 hover:bg-[#D7C8B3]/70 border border-[#D7C8B3] rounded-md transition-all cursor-pointer"
                >
                  Meet the artisans
                </button>
              </div>

              {/* Curatorial Provenance Trust Line */}
              <div className="pt-2 flex items-center gap-3 text-xs text-stone-500 font-sans border-t border-[#D7C8B3]/40">
                <ShieldCheck className="w-4 h-4 text-[#8A68C7] shrink-0" />
                <span>Documented with Nigerian cultural elders & university archives. No fabricated sources.</span>
              </div>
            </div>

            {/* Right Column: High-Fidelity Hero Image Composition */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full h-[400px] sm:h-[460px] lg:h-full min-h-[420px] rounded-xl overflow-hidden border border-[#D7C8B3]/80 shadow-md">
                <img
                  src={heroImg}
                  alt="Master Nigerian artisan in Lagos weaving intricate Aso-Oke textile on a traditional wooden loom"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Measured Scrim for Typographic Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#241F2B]/90 via-[#241F2B]/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="text-[11px] font-mono tracking-widest uppercase text-[#D7C8B3]">
                    LIVING ARCHIVE · FIELD RECORD #01
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-medium mt-1">
                    Master Loom Weaving
                  </h3>
                  <p className="text-xs text-[#D7C8B3] mt-1 line-clamp-2">
                    Lagos Island atelier continuing the 15th-century narrow-strip treadle loom lineage of southwestern Nigeria.
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs font-mono text-[#D7C8B3]/80 border-t border-white/20 pt-2">
                    <span>RECORD: CBAAC ARCHIVE</span>
                    <button
                      onClick={() => navigate('/culture/aso-oke-weaving')}
                      className="text-white hover:text-[#D7C8B3] inline-flex items-center gap-1 font-sans text-xs underline cursor-pointer"
                    >
                      <span>Read Story</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Curatorial Loop: How CultureLens Works */}
      <section className="bg-white/60 border-y border-[#D7C8B3]/60 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8A68C7]">
              OUR CURATORIAL ARCHITECTURE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#34205B] font-medium">
              The Living Knowledge Loop
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Culture is not a static museum exhibit. We unite verified cultural documentation with practical artisan workshops and community knowledge contributions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: '01',
                title: 'Discover',
                desc: 'Explore crafts, traditions, names, and cultural practices across Nigerian regions.',
                icon: Search,
              },
              {
                step: '02',
                title: 'Learn Context',
                desc: 'Read documented narratives with explicit provenance, sources, and uncertainty indicators.',
                icon: BookOpen,
              },
              {
                step: '03',
                title: 'Find Makers',
                desc: 'Locate verified master artisans and guilds actively practicing traditional disciplines.',
                icon: Users,
              },
              {
                step: '04',
                title: 'Connect & Experience',
                desc: 'Participate in hands-on workshops, loom sessions, and dye demonstrations in Lagos.',
                icon: Calendar,
              },
              {
                step: '05',
                title: 'Preserve & Contribute',
                desc: 'Submit oral histories and community corrections reviewed by authorized cultural elders.',
                icon: Sparkles,
              },
            ].map((item) => (
              <div 
                key={item.step} 
                className="bg-[#F4EFE5]/50 border border-[#D7C8B3]/60 rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-[#8A68C7]/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#8A68C7] font-semibold">{item.step}</span>
                  <item.icon className="w-4 h-4 text-[#34205B]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#34205B]">{item.title}</h3>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Cultural Stories: Editorial Asymmetric Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#8A68C7]">
              DOCUMENTED TRADITIONS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#34205B] font-medium mt-1">
              Curated Cultural Records
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-xl">
              Historical context, material techniques, and recorded provenance across Nigerian craft disciplines.
            </p>
          </div>
          <button
            onClick={() => navigate('/discover')}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#34205B] hover:text-[#8A68C7] transition-colors cursor-pointer self-start md:self-auto"
          >
            <span>Browse all records</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredStories.map((story) => (
            <article 
              key={story.id} 
              onClick={() => navigate(`/culture/${story.slug}`)}
              className="group cursor-pointer bg-white rounded-xl border border-[#D7C8B3]/70 overflow-hidden hover:shadow-md hover:border-[#8A68C7]/50 transition-all flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {/* Clean unboxed metadata with dot separators */}
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-sans">
                    <span>{story.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{story.region.split('(')[0].trim()}</span>
                  </div>

                  <h3 className="font-serif text-xl font-medium text-[#34205B] group-hover:text-[#8A68C7] transition-colors leading-snug">
                    {story.title}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {story.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#D7C8B3]/40 flex items-center justify-between text-xs">
                  <CulturalStatusLabel status={story.status} />
                  <span className="text-[#34205B] font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Featured Artisans: The Custodians of Heritage */}
      <section className="bg-[#34205B] text-[#F4EFE5] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#D7C8B3]">
                HERITAGE PRACTITIONERS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium mt-1 text-white">
                Meet the Master Artisans
              </h2>
              <p className="text-sm text-[#D7C8B3]/80 mt-1 max-w-xl">
                Every listed practitioner has opted in to share their craft story, workshop area, and authentic cultural lineage.
              </p>
            </div>
            <button
              onClick={() => navigate('/artisans')}
              className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-[#D7C8B3] transition-colors cursor-pointer self-start md:self-auto"
            >
              <span>View all artisans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArtisans.map((artisan) => (
              <div 
                key={artisan.id}
                onClick={() => navigate(`/artisans/${artisan.slug}`)}
                className="group cursor-pointer bg-[#241F2B] rounded-xl border border-[#D7C8B3]/20 overflow-hidden hover:border-[#8A68C7] transition-all flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#8A68C7]/50 shrink-0">
                      <img
                        src={artisan.avatarUrl}
                        alt={artisan.displayName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-medium text-white group-hover:text-[#8A68C7] transition-colors">
                        {artisan.displayName}
                      </h3>
                      <p className="text-xs text-[#8A68C7] font-medium">{artisan.craft}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#D7C8B3]/70 mt-1">
                        <MapPin className="w-3 h-3 text-[#8A68C7]" />
                        <span>{artisan.publicLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Curatorial Quote */}
                  <blockquote className="text-xs italic text-[#D7C8B3]/85 leading-relaxed border-l border-[#8A68C7]/50 pl-3 my-2">
                    "{artisan.quote}"
                  </blockquote>

                  <p className="text-xs text-[#D7C8B3]/75 line-clamp-2">
                    {artisan.bio}
                  </p>
                </div>

                <div className="px-6 py-4 bg-[#2b2433] border-t border-[#D7C8B3]/10 flex items-center justify-between text-xs">
                  <span className="font-mono text-[#D7C8B3]/70">
                    {artisan.experienceYears} Years Practice
                  </span>
                  <span className="text-[#8A68C7] group-hover:text-white transition-colors inline-flex items-center gap-1">
                    View Profile <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Artisan-Led Experiences: Practical Engagement */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#8A68C7]">
              PRACTICAL ENGAGEMENT · WORKSHOPS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#34205B] font-medium mt-1">
              Immersive Cultural Experiences
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-xl">
              Learn directly from master craftspeople in Lagos. Participate in loom weaving, natural indigo vat dyeing, and bead stringing.
            </p>
          </div>
          <button
            onClick={() => navigate('/experiences')}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#34205B] hover:text-[#8A68C7] transition-colors cursor-pointer self-start md:self-auto"
          >
            <span>See all experiences</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredExperiences.map((exp) => (
            <div 
              key={exp.id}
              onClick={() => navigate(`/experiences/${exp.slug}`)}
              className="group cursor-pointer bg-white rounded-xl border border-[#D7C8B3]/70 overflow-hidden hover:shadow-md hover:border-[#8A68C7]/50 transition-all flex flex-col sm:flex-row"
            >
              <div className="sm:w-2/5 relative aspect-square sm:aspect-auto overflow-hidden bg-stone-100">
                <img
                  src={exp.imageUrl}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="sm:w-3/5 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-sans">
                    <span>{exp.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#8A68C7]" />
                      {exp.durationHours} Hours
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-medium text-[#34205B] group-hover:text-[#8A68C7] transition-colors leading-snug">
                    {exp.title}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {exp.shortSummary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#D7C8B3]/40 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-500 block">Price per guest</span>
                    <span className="font-mono text-base font-semibold text-[#34205B] tabular-nums">
                      ₦{exp.priceNaira.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/experiences/${exp.slug}`);
                    }}
                    className="px-4 py-2 text-xs font-medium text-white bg-[#34205B] hover:bg-[#251642] rounded-md transition-colors cursor-pointer"
                  >
                    Reserve workshop
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Ask CultureLens Preview: Grounded AI Discovery Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F4EFE5] border-2 border-[#D7C8B3] rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8A68C7]">
              <Sparkles className="w-4 h-4" />
              <span>Gemma AI · Grounded Cultural Discovery</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#34205B] font-medium leading-tight">
              Have questions about Nigerian customs, loom mechanics, or craft symbols?
            </h2>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              Ask CultureLens uses strict retrieval-augmented grounding from verified platform archives. If evidence is unverified or conflicting, the system tells you honestly instead of inventing answers.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/ask')}
                className="px-6 py-3 text-sm font-medium text-white bg-[#34205B] hover:bg-[#251642] rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Ask CultureLens</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/contribute')}
                className="px-6 py-3 text-sm font-medium text-[#34205B] bg-white hover:bg-stone-50 border border-[#D7C8B3] rounded-md transition-colors cursor-pointer"
              >
                Contribute Cultural Knowledge
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
