import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { Menu, X, Search, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Discover', path: '/discover' },
    { label: 'Artisans', path: '/artisans' },
    { label: 'Experiences', path: '/experiences' },
    { label: 'Ask CultureLens', path: '/ask' },
    { label: 'Contribute', path: '/contribute' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/discover' && (currentPath === '/discover' || currentPath.startsWith('/culture/'))) return true;
    if (path === '/artisans' && (currentPath === '/artisans' || currentPath.startsWith('/artisans/'))) return true;
    if (path === '/experiences' && (currentPath === '/experiences' || currentPath.startsWith('/experiences/'))) return true;
    return currentPath === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F4EFE5]/95 backdrop-blur-md border-b border-[#D7C8B3]/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNav('/')}
            className="group flex items-baseline gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#34205B] rounded-sm py-1"
            aria-label="CultureLens Home"
          >
            <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#34205B] group-hover:text-[#8A68C7] transition-colors whitespace-nowrap shrink-0">
              CultureLens
            </span>
            <span className="hidden sm:inline-block text-[11px] font-sans font-medium uppercase tracking-widest text-[#8A68C7] border-l border-[#D7C8B3] pl-2">
              Àṣà
            </span>
          </button>

          {/* Zone 2: Primary Nav Links (Single-Line Controls) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {navLinks.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`whitespace-nowrap shrink-0 transition-colors py-2 relative text-sm ${
                    active
                      ? 'text-[#34205B] font-semibold'
                      : 'text-[#241F2B]/75 hover:text-[#34205B]'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#34205B] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNav('/discover')}
              className="px-5 py-2.5 text-sm font-medium text-white bg-[#34205B] hover:bg-[#251642] active:scale-[0.98] transition-all rounded-md shadow-sm whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#8A68C7]"
            >
              <Search className="w-4 h-4 text-[#F4EFE5]/80" />
              <span>Explore culture</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#34205B] hover:bg-[#D7C8B3]/30 rounded-md transition-colors"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#D7C8B3]/60 bg-[#F4EFE5] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="grid gap-1 py-2">
            {navLinks.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`text-left px-3 py-2.5 text-base rounded-md font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-[#34205B] text-white'
                    : 'text-[#241F2B] hover:bg-[#D7C8B3]/40'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#D7C8B3]/40 flex flex-col gap-2">
            <button
              onClick={() => handleNav('/discover')}
              className="w-full py-3 px-4 text-center text-sm font-medium text-white bg-[#34205B] hover:bg-[#251642] rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Explore culture</span>
            </button>

            <button
              onClick={() => handleNav('/about')}
              className="w-full py-2.5 px-4 text-center text-xs font-medium text-[#34205B] hover:bg-[#D7C8B3]/30 rounded-md transition-colors"
            >
              About Team Àṣà
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
