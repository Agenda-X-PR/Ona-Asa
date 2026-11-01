// Lets node:test import modules that pull in Vite-handled assets.
// Image and stylesheet imports resolve to their file URL instead of failing.
import { register } from 'node:module';

register('./asset-loader.mjs', import.meta.url);
