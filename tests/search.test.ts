import assert from 'node:assert/strict';
import test from 'node:test';
import { matchesSearchQuery } from '../src/utils/search';

const fixtures = [
  {
    slug: 'aso-oke-weaving',
    fields: ['Aso-Òkè: The Woven Prestige of Yoruba Heritage', 'Aṣọ-Òkè', 'Textiles', 'loom weaving tradition'],
  },
  {
    slug: 'adire-eleko-indigo',
    fields: ['Àdìrẹ Ẹlẹ́kọ: Cassava Stencil Indigo Resist', 'Adire', 'fermented indigo vats'],
  },
  {
    slug: 'ileke-beadwork',
    fields: ['Ìlẹ̀kẹ̀: Sacred and Royal Yoruba Beadwork', 'Ìlẹ̀kẹ̀ Ọba', 'royal bead makers'],
  },
  {
    slug: 'traditional-terracotta-pottery',
    fields: ['Earthen Vessels: Nigerian Terracotta', 'Pottery & Ceramics', 'coil-built vessels'],
  },
  {
    slug: 'benin-bronze-lost-wax',
    fields: ['Igun Eronmwon: Benin Guild Bronze Casting & Lost-Wax Heritage', 'investment casting'],
  },
];

const quickTopics = [
  { query: 'Aso-Òkè Weaving', slug: 'aso-oke-weaving' },
  { query: 'Adire Eleko Indigo', slug: 'adire-eleko-indigo' },
  { query: 'Royal Ileke Beads', slug: 'ileke-beadwork' },
  { query: 'Terracotta Pottery', slug: 'traditional-terracotta-pottery' },
  { query: 'Lost-Wax Bronze', slug: 'benin-bronze-lost-wax' },
];

test('homepage quick topics each match their intended cultural record', () => {
  for (const { query, slug } of quickTopics) {
    const results = fixtures.filter((record) => matchesSearchQuery(query, record.fields));
    assert.ok(results.some((record) => record.slug === slug), `${query} should find ${slug}`);
  }
});

test('terracotta topic does not broaden into unrelated beadwork records', () => {
  const results = fixtures.filter((record) => matchesSearchQuery('Terracotta Pottery', record.fields));
  assert.deepEqual(results.map((record) => record.slug), ['traditional-terracotta-pottery']);
});

test('search ignores diacritics and punctuation', () => {
  const record = fixtures.find((item) => item.slug === 'aso-oke-weaving');
  assert.ok(record);
  assert.equal(matchesSearchQuery('Aso Oke', record.fields), true);
  assert.equal(matchesSearchQuery('Aṣọ-Òkè weaving', record.fields), true);
});

test('search can match material and technique fields', () => {
  const record = fixtures.find((item) => item.slug === 'benin-bronze-lost-wax');
  assert.ok(record);
  assert.equal(matchesSearchQuery('investment casting', record.fields), true);
});
