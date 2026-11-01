// Illustrative photos shipped with the prototype. Their origin is not recorded
// in the repo (they arrived with the first commit), and they do not show the
// named sample artisans. Alt text describes only what is visible.
// See TODO.md for the photos the team still needs to supply.
import loomSmall from '../assets/images/hero_nigerian_crafts-640.webp';
import loomLarge from '../assets/images/hero_nigerian_crafts-1200.webp';
import clothSmall from '../assets/images/craft_asooke_weaving-640.webp';
import clothLarge from '../assets/images/craft_asooke_weaving-1200.webp';
import adireSmall from '../assets/images/craft_adire_indigo-640.webp';
import adireLarge from '../assets/images/craft_adire_indigo-1200.webp';
import beadsSmall from '../assets/images/craft_beadmaking_ileke-640.webp';
import beadsLarge from '../assets/images/craft_beadmaking_ileke-1200.webp';
import potterySmall from '../assets/images/artisan_pottery_studio-640.webp';
import potteryLarge from '../assets/images/artisan_pottery_studio-1200.webp';

export type PhotoKey = 'loom' | 'cloth' | 'adire' | 'beads' | 'pottery';

export interface Photo {
  small: string;
  large: string;
  width: number;
  height: number;
  alt: string;
}

export const PHOTOS: Record<PhotoKey, Photo> = {
  loom: {
    small: loomSmall,
    large: loomLarge,
    width: 1200,
    height: 670,
    alt: 'A man in a blue robe and cap weaves at a wooden loom, with indigo cloth hanging around the workshop.',
  },
  cloth: {
    small: clothSmall,
    large: clothLarge,
    width: 1200,
    height: 896,
    alt: 'Close view of a woven cloth on the loom, patterned with indigo, purple and gold zigzag bands.',
  },
  adire: {
    small: adireSmall,
    large: adireLarge,
    width: 1200,
    height: 896,
    alt: 'Indigo-dyed cloths with resist patterns hang on a line above dye pots in an open yard while a woman works at a pot.',
  },
  beads: {
    small: beadsSmall,
    large: beadsLarge,
    width: 1200,
    height: 896,
    alt: 'Strands of red, yellow and blue beads and bowls of loose beads on a carved wooden table.',
  },
  pottery: {
    small: potterySmall,
    large: potteryLarge,
    width: 1200,
    height: 896,
    alt: 'A woman in a head wrap shapes a clay pot on a turntable in a workshop lined with finished pots.',
  },
};
