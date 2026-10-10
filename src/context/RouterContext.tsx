import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RouteMatch {
  path: string;
  params: Record<string, string>;
}

interface RouterContextType {
  currentPath: string;
  params: Record<string, string>;
  navigate: (to: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function matchRoute(pattern: string, actualPath: string): { matches: boolean; params: Record<string, string> } {
  const patternSegments = pattern.split('/').filter(Boolean);
  const actualSegments = actualPath.split('/').filter(Boolean);

  if (patternSegments.length !== actualSegments.length) {
    return { matches: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternSegments.length; i++) {
    const pSeg = patternSegments[i];
    const aSeg = actualSegments[i];

    if (pSeg.startsWith(':')) {
      const paramName = pSeg.slice(1);
      params[paramName] = decodeURIComponent(aSeg);
    } else if (pSeg !== aSeg) {
      return { matches: false, params: {} };
    }
  }

  return { matches: true, params };
}

function parseCurrentHash(): string {
  const hash = window.location.hash;
  if (!hash || hash === '#' || hash === '#/') {
    return '/';
  }
  const clean = hash.replace(/^#/, '');
  return clean.startsWith('/') ? clean : `/${clean}`;
}

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => parseCurrentHash());
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const handleHashChange = () => {
      const newPath = parseCurrentHash();
      setCurrentPath(newPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (to: string) => {
    const target = to.startsWith('/') ? to : `/${to}`;
    window.location.hash = target;
    setCurrentPath(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine params based on active route
  let activeParams: Record<string, string> = {};
  const knownPatterns = [
    '/culture/:slug',
    '/artisans/:slug',
    '/experiences/:slug'
  ];

  for (const pattern of knownPatterns) {
    const result = matchRoute(pattern, currentPath);
    if (result.matches) {
      activeParams = result.params;
      break;
    }
  }

  return (
    <RouterContext.Provider
      value={{
        currentPath,
        params: activeParams,
        navigate,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
