import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { CultureDetailPage } from './pages/CultureDetailPage';
import { ArtisansPage } from './pages/ArtisansPage';
import { ArtisanDetailPage } from './pages/ArtisanDetailPage';
import { ExperiencesPage } from './pages/ExperiencesPage';
import { ExperienceDetailPage } from './pages/ExperienceDetailPage';
import { AskCultureLensPage } from './pages/AskCultureLensPage';
import { ContributePage } from './pages/ContributePage';
import { AboutPage } from './pages/AboutPage';
import { BookingsPage } from './pages/BookingsPage';

const AppContent: React.FC = () => {
  const { currentPath } = useRouter();

  const renderActiveRoute = () => {
    if (currentPath === '/') {
      return <HomePage />;
    }
    if (currentPath === '/discover') {
      return <DiscoverPage />;
    }
    if (currentPath.startsWith('/culture/')) {
      return <CultureDetailPage />;
    }
    if (currentPath === '/artisans') {
      return <ArtisansPage />;
    }
    if (currentPath.startsWith('/artisans/')) {
      return <ArtisanDetailPage />;
    }
    if (currentPath === '/experiences') {
      return <ExperiencesPage />;
    }
    if (currentPath.startsWith('/experiences/')) {
      return <ExperienceDetailPage />;
    }
    if (currentPath === '/ask') {
      return <AskCultureLensPage />;
    }
    if (currentPath === '/contribute') {
      return <ContributePage />;
    }
    if (currentPath === '/about') {
      return <AboutPage />;
    }
    if (currentPath === '/bookings') {
      return <BookingsPage />;
    }

    return (
      <section className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4" aria-labelledby="not-found-title">
        <p className="text-xs font-mono uppercase tracking-widest text-[#8A68C7]">404 · PAGE NOT FOUND</p>
        <h1 id="not-found-title" className="font-serif text-3xl text-[#34205B]">This page is not available</h1>
        <p className="text-sm text-stone-600">The address may be incorrect, or this prototype does not include that route.</p>
        <button onClick={() => window.location.hash = '#/'} className="px-4 py-2 text-sm font-medium text-white bg-[#34205B] rounded-md">
          Return to CultureLens
        </button>
      </section>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4EFE5] text-[#241F2B]">
      {/* Top Banner Notice (Operational boundary for judges & reviewers) */}
      <aside aria-label="Development announcement" className="bg-[#34205B] text-[#D7C8B3] text-xs py-2 px-4 border-b border-[#251642]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] font-sans">
          <div className="flex items-center gap-2">
            <span className="font-mono uppercase font-semibold text-white">Ọ̀NÀ ÀṢÀ</span>
            <span>·</span>
            <span>Hack for Humanity Lagos 2026</span>
            <span>·</span>
            <span className="hidden md:inline">Frontend Lead: Member B</span>
          </div>
          <div className="flex items-center gap-3 text-stone-300">
            <span className="text-center">Prototype demo · sample fixtures · no live services</span>
            <span>·</span>
            <a href="#/about" className="text-white hover:text-[#8A68C7] underline cursor-pointer">
              Architecture & Team Split
            </a>
          </div>
        </div>
      </aside>

      <Navbar />

      <main className="flex-1">
        {renderActiveRoute()}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
