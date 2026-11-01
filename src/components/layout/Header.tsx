import React, { useEffect, useRef, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { Link, useRouter } from '../../lib/router';
import { useTheme } from '../../lib/theme';

const NAV = [
  { label: 'Discover', to: '/discover', section: ['/discover', '/culture/'] },
  { label: 'Artisans', to: '/artisans', section: ['/artisans'] },
  { label: 'Experiences', to: '/experiences', section: ['/experiences'] },
  { label: 'Ask', to: '/ask', section: ['/ask'] },
  { label: 'Contribute', to: '/contribute', section: ['/contribute'] },
];

function isCurrent(path: string, section: string[]) {
  return section.some((s) => (s.endsWith('/') ? path.startsWith(s) : path === s || path.startsWith(`${s}/`)));
}

export const Header: React.FC = () => {
  const { path } = useRouter();
  const [theme, toggleTheme] = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  // Close the menu whenever the route changes.
  useEffect(() => setMenuOpen(false), [path]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const themeLabel = theme === 'dark' ? 'Use light theme' : 'Use dark theme';

  return (
    <header className="sticky top-0 z-40 bg-frame text-frame-ink shadow-[0_1px_0_rgb(0_0_0/0.4)]">
      <div className="page flex h-16 items-center gap-6">
        <Link to="/" className="group flex items-baseline gap-2 no-underline" aria-label="CultureLens home">
          <span className="display text-[1.9rem] tracking-[0.005em] text-frame-ink">CultureLens</span>
          <span className="hidden text-[0.9375rem] text-frame-accent sm:inline">Ọ̀nà Àṣà</span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const current = isCurrent(path, item.section);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={current ? 'page' : undefined}
                    className={`relative block px-3 py-2 text-[0.9375rem] no-underline transition-colors ${
                      current ? 'text-frame-ink' : 'text-frame-soft hover:text-frame-ink'
                    }`}
                  >
                    {item.label}
                    {current && (
                      <span aria-hidden="true" className="absolute -bottom-[0.55rem] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-frame-accent shadow-[0_0_0_3px_var(--frame)]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={themeLabel}
            title={themeLabel}
            className="grid grid-cols-[minmax(0,1fr)] h-11 w-11 place-items-center rounded-[3px] text-frame-soft transition-colors hover:text-frame-ink"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
          </button>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="grid grid-cols-[minmax(0,1fr)] h-11 w-11 place-items-center rounded-[3px] text-frame-ink md:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

      <nav id="mobile-nav" aria-label="Main" hidden={!menuOpen} className="border-t border-white/10 md:hidden">
        <ul className="page grid grid-cols-[minmax(0,1fr)] py-2">
          {NAV.map((item) => {
            const current = isCurrent(path, item.section);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-current={current ? 'page' : undefined}
                  className={`flex min-h-12 items-center gap-3 text-[1.0625rem] no-underline ${current ? 'text-frame-ink' : 'text-frame-soft'}`}
                >
                  <span aria-hidden="true" className={`h-2 w-2 rounded-full ${current ? 'bg-frame-accent' : 'bg-white/15'}`} />
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link to="/about" className="flex min-h-12 items-center gap-3 text-[1.0625rem] text-frame-soft no-underline">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-white/15" />
              About the prototype
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
