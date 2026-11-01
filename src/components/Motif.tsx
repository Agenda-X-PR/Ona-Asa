import React, { useId } from 'react';
import type { CraftKey } from '../types';

// Drawn patterns, one per craft, chased into a panel's ground. They stand in
// where no matching photo exists. Lines use currentColor so the panel sets
// the tone in both themes. Shapes are simplified abstractions, not copies of
// specific historical motifs.

export const CRAFT_NAMES: Record<CraftKey, string> = {
  'aso-oke': 'Aṣọ-Òkè strip weaving',
  adire: 'Àdìrẹ resist dyeing',
  ileke: 'Ìlẹ̀kẹ̀ beadwork',
  terracotta: 'Terracotta pottery',
  bronze: 'Lost-wax casting',
  uli: 'Uli line painting',
  woodcarving: 'Woodcarving',
};

type Tile = { w: number; h: number; body: React.ReactNode };

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const TILES: Record<Exclude<CraftKey, 'uli'>, Tile> = {
  // Narrow strips sewn edge to edge, crossed by weft bands and openwork eyelets.
  'aso-oke': {
    w: 48,
    h: 64,
    body: (
      <g {...S}>
        <path d="M24 0V64M0 0V64" strokeWidth={1.8} />
        <path d="M3 6H21M3 9H21M27 14H45M27 17H45M3 30H21M27 40H45M27 43H45M3 52H21M3 55H21" />
        <path d="M7 19h3v3H7zM14 19h3v3h-3zM31 27h3v3h-3zM38 27h3v3h-3zM7 41h3v3H7zM14 41h3v3h-3zM31 54h3v3h-3zM38 54h3v3h-3z" strokeWidth={1.1} />
      </g>
    ),
  },
  // Squares of a resist cloth, each carrying a different drawn sign.
  adire: {
    w: 96,
    h: 96,
    body: (
      <g {...S}>
        <path d="M0 0H96V96M48 0V96M0 48H96" strokeWidth={1.6} />
        <circle cx="24" cy="24" r="13" />
        <circle cx="24" cy="24" r="6" />
        <path d="M54 8L90 40M62 8L90 32M54 16L82 40M70 8L90 24M54 24L74 40" />
        <circle cx="12" cy="60" r="2" fill="currentColor" />
        <circle cx="24" cy="60" r="2" fill="currentColor" />
        <circle cx="36" cy="60" r="2" fill="currentColor" />
        <circle cx="18" cy="72" r="2" fill="currentColor" />
        <circle cx="30" cy="72" r="2" fill="currentColor" />
        <circle cx="12" cy="84" r="2" fill="currentColor" />
        <circle cx="24" cy="84" r="2" fill="currentColor" />
        <circle cx="36" cy="84" r="2" fill="currentColor" />
        <path d="M58 58H86V86H58zM65 65H79V79H65z" />
        <path d="M72 58V65M72 79V86M58 72H65M79 72H86" />
      </g>
    ),
  },
  // Strands crossing on the diagonal, each bead a small ring.
  ileke: {
    w: 36,
    h: 36,
    body: (
      <g {...S}>
        <path d="M-4 40L40 -4" strokeWidth={0.9} />
        <circle cx="6" cy="30" r="3.4" />
        <circle cx="18" cy="18" r="4.4" fill="currentColor" fillOpacity={0.25} />
        <circle cx="30" cy="6" r="3.4" />
        <path d="M14 40L40 14" strokeWidth={0.9} />
        <circle cx="27" cy="27" r="2.4" />
      </g>
    ),
  },
  // Combed incisions around a vessel: rings of shallow waves.
  terracotta: {
    w: 64,
    h: 28,
    body: (
      <g {...S}>
        <path d="M0 7C8 3 16 3 24 7S40 11 48 7 56 3 64 7" />
        <path d="M0 13C8 9 16 9 24 13S40 17 48 13 56 9 64 13" />
        <path d="M0 22H64" strokeDasharray="2 4" />
      </g>
    ),
  },
  // A punched ground of four-lobed leaves, the way a cast panel's background is chased.
  bronze: {
    w: 32,
    h: 32,
    body: (
      <g {...S} strokeWidth={1.2}>
        <path d="M16 6C19 10 19 13 16 16 13 13 13 10 16 6ZM16 26C13 22 13 19 16 16 19 19 19 22 16 26ZM6 16C10 13 13 13 16 16 13 19 10 19 6 16ZM26 16C22 19 19 19 16 16 19 13 22 13 26 16Z" />
        <circle cx="2" cy="2" r="0.9" fill="currentColor" />
        <circle cx="30" cy="30" r="0.9" fill="currentColor" />
        <circle cx="30" cy="2" r="0.9" fill="currentColor" />
        <circle cx="2" cy="30" r="0.9" fill="currentColor" />
      </g>
    ),
  },
  // Rows of chip-carved triangles.
  woodcarving: {
    w: 32,
    h: 20,
    body: (
      <g {...S} strokeWidth={1.1}>
        <path d="M0 18L8 2L16 18Z" fill="currentColor" fillOpacity={0.22} />
        <path d="M16 2L24 18L32 2Z" />
        <path d="M0 19.5H32" strokeWidth={0.7} />
      </g>
    ),
  },
};

/** Uli favours open space and freehand marks, so it is one sparse drawing, not a repeat. */
const UliDrawing: React.FC = () => (
  <g {...S} strokeWidth={1.6}>
    <path d="M60 70c0-14 12-24 26-24s26 11 26 25-10 22-22 22-19-8-19-17 7-14 14-14 12 5 12 11-4 9-8 9" />
    <path d="M112 72c18 4 30-6 44-2s20 18 34 16" />
    <path d="M232 40a26 26 0 1 0 6 36 20 20 0 1 1-6-36Z" />
    <path d="M40 150h70M48 150v14M58 150v14M68 150v14M78 150v14M88 150v14M98 150v14" strokeWidth={1.3} />
    <path d="M170 130c10 20 30 26 52 20" />
    <circle cx="150" cy="40" r="2.2" fill="currentColor" />
    <circle cx="160" cy="46" r="2.2" fill="currentColor" />
    <circle cx="170" cy="40" r="2.2" fill="currentColor" />
    <path d="M250 150l12-12 12 12-12 12z" strokeWidth={1.2} />
  </g>
);

interface MotifProps {
  craft: CraftKey;
  /** Scale of the repeat. 1 is the default panel density. */
  scale?: number;
  className?: string;
}

/** Decorative pattern for a craft. Hidden from assistive tech; pair it with a text label. */
export const Motif: React.FC<MotifProps> = ({ craft, scale = 1, className }) => {
  const id = useId().replace(/:/g, '');

  if (craft === 'uli') {
    return (
      <svg className={className} viewBox="0 0 300 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" width="100%" height="100%">
        <UliDrawing />
      </svg>
    );
  }

  const tile = TILES[craft];
  return (
    <svg className={className} aria-hidden="true" focusable="false" width="100%" height="100%">
      <defs>
        <pattern id={`m-${id}`} width={tile.w * scale} height={tile.h * scale} patternUnits="userSpaceOnUse">
          <g transform={`scale(${scale})`}>{tile.body}</g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#m-${id})`} />
    </svg>
  );
};
