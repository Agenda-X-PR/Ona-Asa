import React from 'react';
import type { ArtisanVerificationStatus, CraftKey, CulturalRecordStatus, SensitivityLevel } from '../types';
import { PHOTOS, type PhotoKey } from '../data/images';
import { CRAFT_NAMES, Motif } from './Motif';

/* Status marks: the line's form carries the state, the word confirms it. */

const STATUS_TEXT: Record<CulturalRecordStatus, string> = {
  documented: 'Documented',
  community_reviewed: 'Community reviewed',
  under_review: 'Under review',
  disputed: 'Contested',
};

const LineMark: React.FC<{ form: 'solid' | 'double' | 'dashed' | 'struck' }> = ({ form }) => (
  <svg width="26" height="10" viewBox="0 0 26 10" aria-hidden="true" focusable="false" className="shrink-0 text-patina">
    {form === 'double' ? (
      <>
        <path d="M1 3H25M1 7H25" stroke="currentColor" strokeWidth="1.6" />
      </>
    ) : (
      <path d="M1 5H25" stroke="currentColor" strokeWidth="2" strokeDasharray={form === 'dashed' ? '4 3' : undefined} />
    )}
    {form === 'struck' && <path d="M9 9L17 1" stroke="currentColor" strokeWidth="1.6" />}
  </svg>
);

export const StatusMark: React.FC<{ status: CulturalRecordStatus; className?: string }> = ({ status, className = '' }) => {
  const form = { documented: 'solid', community_reviewed: 'double', under_review: 'dashed', disputed: 'struck' } as const;
  return (
    <span className={`inline-flex items-center gap-2 text-[0.875rem] text-ink-soft ${className}`}>
      <LineMark form={form[status]} />
      <span>
        {STATUS_TEXT[status]} <span className="sr-only">(sample label, not a real review)</span>
      </span>
    </span>
  );
};

export const statusText = (status: CulturalRecordStatus) => STATUS_TEXT[status];

const VERIFY_TEXT: Record<ArtisanVerificationStatus, string> = {
  verified: 'Verified',
  community_acknowledged: 'Guild acknowledged',
  pending: 'Verification pending',
};

export const VerificationMark: React.FC<{ status: ArtisanVerificationStatus }> = ({ status }) => {
  const form = { verified: 'solid', community_acknowledged: 'double', pending: 'dashed' } as const;
  return (
    <span className="inline-flex items-center gap-2 text-[0.875rem] text-ink-soft">
      <LineMark form={form[status]} />
      <span>
        {VERIFY_TEXT[status]} <span className="sr-only">(sample label, not verified)</span>
      </span>
    </span>
  );
};

export const SensitivityText: React.FC<{ level: SensitivityLevel }> = ({ level }) => {
  const text: Record<SensitivityLevel, string> = {
    public: 'Public heritage',
    community_restricted: 'Community restricted',
    restricted: 'Restricted',
    sacred: 'Sacred, closed protocol',
  };
  return <>{text[level]}</>;
};

/* Figures: a photo only when it shows the craft, otherwise the drawn pattern. */

interface CraftFigureProps {
  craft: CraftKey;
  photo?: PhotoKey;
  /** Larger images for wide layouts. */
  size?: 'small' | 'large';
  className?: string;
  caption?: boolean;
  priority?: boolean;
}

export const CraftFigure: React.FC<CraftFigureProps> = ({ craft, photo, size = 'small', className = '', caption = false, priority }) => {
  const image = photo ? PHOTOS[photo] : undefined;
  return (
    <figure className={className}>
      <div className="plaque nails h-full overflow-hidden p-2.5">
        {image ? (
          <img
            src={size === 'large' ? image.large : image.small}
            srcSet={`${image.small} 640w, ${image.large} 1200w`}
            sizes={size === 'large' ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 768px) 33vw, 100vw'}
            width={image.width}
            height={image.height}
            alt={image.alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="h-full w-full rounded-[2px] object-cover"
          />
        ) : (
          <div className="motif-field h-full min-h-40 rounded-[2px]">
            <Motif craft={craft} />
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-[0.875rem] text-ink-soft">
          {image
            ? 'Illustrative photo. It does not show the people named on this site.'
            : `Drawn ${CRAFT_NAMES[craft].toLowerCase()} pattern. No photo of this craft has been supplied yet.`}
        </figcaption>
      )}
    </figure>
  );
};

/* Monogram: a small panel with initials, used instead of a portrait. */
export const Monogram: React.FC<{ name: string; craft: CraftKey; size?: 'sm' | 'lg' }> = ({ name, craft, size = 'sm' }) => {
  const initials = name
    .split(/\s+/)
    .filter((part) => /^[A-ZÀ-Ỵ]/u.test(part))
    .slice(-2)
    .map((part) => part[0])
    .join('');
  const box = size === 'lg' ? 'h-28 w-28 text-5xl' : 'h-16 w-16 text-2xl';
  return (
    <div className={`plaque relative shrink-0 overflow-hidden ${box}`} aria-hidden="true">
      <div className="motif-field absolute inset-1.5 rounded-[2px] opacity-70">
        <Motif craft={craft} scale={0.7} />
      </div>
      <span className="display relative flex h-full items-center justify-center text-ink">
        <span className="rounded-[2px] bg-face px-1.5 leading-none">{initials}</span>
      </span>
    </div>
  );
};

/* Page states */

export const Loading: React.FC<{ label: string }> = ({ label }) => (
  <div role="status" className="flex items-center gap-3 py-16 text-ink-soft">
    <span className="spinner" aria-hidden="true" />
    <span>{label}</span>
  </div>
);

export const ErrorBlock: React.FC<{ title: string; onRetry?: () => void; children?: React.ReactNode }> = ({ title, onRetry, children }) => (
  <div role="alert" className="notice notice-error my-10 max-w-xl space-y-3">
    <p className="font-semibold">{title}</p>
    {children}
    {onRetry && (
      <button type="button" onClick={onRetry} className="btn btn-quiet">
        Try again
      </button>
    )}
  </div>
);

/** Page title block. `lead` is the one sentence that answers why the page exists. */
export const PageIntro: React.FC<{ title: string; lead?: React.ReactNode; children?: React.ReactNode }> = ({ title, lead, children }) => (
  <header className="pt-10 pb-8 sm:pt-14">
    <h1 className="text-[clamp(2.75rem,7vw,5.25rem)]">{title}</h1>
    {lead && <p className="measure mt-4 text-[1.125rem] text-ink-soft">{lead}</p>}
    {children}
  </header>
);

export const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

export function formatSessionDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}
