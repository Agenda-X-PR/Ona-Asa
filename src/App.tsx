import React, { useEffect, useRef } from 'react';
import { Link, RouterProvider, useRouter } from './lib/router';
import { Header } from './components/layout/Header';
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

function pageFor(path: string): React.ReactElement {
  if (path === '/') return <HomePage />;
  if (path === '/discover') return <DiscoverPage />;
  if (path.startsWith('/culture/')) return <CultureDetailPage />;
  if (path === '/artisans') return <ArtisansPage />;
  if (path.startsWith('/artisans/')) return <ArtisanDetailPage />;
  if (path === '/experiences') return <ExperiencesPage />;
  if (path.startsWith('/experiences/')) return <ExperienceDetailPage />;
  if (path === '/ask') return <AskCultureLensPage />;
  if (path === '/contribute') return <ContributePage />;
  if (path === '/about') return <AboutPage />;
  if (path === '/bookings') return <BookingsPage />;
  return <NotFound />;
}

const NotFound: React.FC = () => (
  <section className="page py-20">
    <h1 className="text-[clamp(2.5rem,6vw,4.5rem)]">This page is not here</h1>
    <p className="measure mt-4 text-ink-soft">The address may be mistyped, or the prototype does not include this page.</p>
    <Link to="/" className="btn btn-primary mt-6">
      Go to the home page
    </Link>
  </section>
);

export const AppContent: React.FC = () => {
  const { path } = useRouter();
  const main = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // On a new page (not a filter change): back to the top, and move focus so
  // screen reader and keyboard users start at the new content.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    main.current?.focus({ preventScroll: true });
  }, [path]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          main.current?.focus();
        }}
        className="sr-only z-50 bg-face px-4 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <p className="bg-ground-deep text-[0.875rem] text-ink-soft">
        <span className="page block py-1.5">
          Prototype for Hack for Humanity Lagos 2026. All content is sample data and nothing you enter leaves this browser.{' '}
          <Link to="/about" className="link">
            How it is built
          </Link>
          <span className="hidden lg:inline">. Frontend lead: Member B.</span>
        </span>
      </p>
      <Header />
      {/* Keyed by path: moving between two records gives a fresh page with no state carried over. */}
      <main id="main" ref={main} tabIndex={-1} className="flex-1 outline-none">
        <React.Fragment key={path}>{pageFor(path)}</React.Fragment>
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
