import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Hash routing: #/discover?q=adire. The part before "?" is the path, the rest
// is the query. Pages keep filters in the query so links can be shared.

export interface Location {
  path: string;
  query: URLSearchParams;
}

interface RouterValue extends Location {
  params: Record<string, string>;
  /** Go to a path such as "/discover?q=adire". Adds a history entry. */
  navigate: (to: string) => void;
  /** Replace the current query without adding a history entry. */
  setQuery: (next: Record<string, string>) => void;
}

const RouterContext = createContext<RouterValue | undefined>(undefined);

export function parseHash(hash: string): Location {
  const raw = hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart = ''] = raw.split('?');
  const path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
  return { path: path.length > 1 ? path.replace(/\/+$/, '') : '/', query: new URLSearchParams(queryPart) };
}

export function buildHref(path: string, query?: Record<string, string>): string {
  const params = new URLSearchParams(Object.entries(query ?? {}).filter(([, v]) => v !== ''));
  const qs = params.toString();
  return `#${path}${qs ? `?${qs}` : ''}`;
}

const ROUTE_PATTERNS = ['/culture/:slug', '/artisans/:slug', '/experiences/:slug'];

export function matchParams(path: string): Record<string, string> {
  const actual = path.split('/').filter(Boolean);
  for (const pattern of ROUTE_PATTERNS) {
    const expected = pattern.split('/').filter(Boolean);
    if (expected.length !== actual.length) continue;
    const params: Record<string, string> = {};
    const ok = expected.every((segment, i) => {
      if (segment.startsWith(':')) {
        try {
          params[segment.slice(1)] = decodeURIComponent(actual[i]);
        } catch {
          return false;
        }
        return true;
      }
      return segment === actual[i];
    });
    if (ok) return params;
  }
  return {};
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<Location>(() => parseHash(window.location.hash));

  useEffect(() => {
    const sync = () => setLocation(parseHash(window.location.hash));
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const navigate = useCallback((to: string) => {
    const target = to.startsWith('#') ? to : `#${to.startsWith('/') ? to : `/${to}`}`;
    if (window.location.hash === target) return;
    window.location.hash = target;
  }, []);

  const setQuery = useCallback((next: Record<string, string>) => {
    const href = buildHref(parseHash(window.location.hash).path, next);
    if (href === window.location.hash) return;
    history.replaceState(history.state, '', href);
    setLocation(parseHash(href));
  }, []);

  const value = useMemo<RouterValue>(
    () => ({ ...location, params: matchParams(location.path), navigate, setQuery }),
    [location, navigate, setQuery],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};

export function useRouter(): RouterValue {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useRouter must be used within a RouterProvider');
  return context;
}

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string;
  query?: Record<string, string>;
};

/** A real link (<a href="#/...">): works with new tabs, copy link and middle click. */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link({ to, query, ...rest }, ref) {
  return <a ref={ref} href={buildHref(to, query)} {...rest} />;
});
