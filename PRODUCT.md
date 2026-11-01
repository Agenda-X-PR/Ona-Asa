# Product

<!-- impeccable:product-schema 1 -->

> Inferred record. No interview channel was available in this session, so every
> fact below is taken from the repository (`metadata.json`, page copy, mock data)
> and the coordinator's brief. Confirm or correct with Team Àṣà.

## Platform

web

## Users
(inferred) People curious about Nigerian craft heritage (visitors to Lagos,
diaspora, students) who want to learn the story behind a craft and find a maker
or workshop. Secondary: hackathon judges reviewing the prototype for
Hack for Humanity Lagos 2026.

## Product Purpose
CultureLens ("Ọ̀nà Àṣà", by Team Àṣà) lets people discover Nigerian cultural
heritage, understand the stories behind traditional crafts, and connect with
local artisans. Success for the prototype: a reviewer can follow the full loop
(discover a record, meet a maker, preview a workshop booking, ask a question,
propose a contribution) and understands exactly what is sample data.

## Positioning
(inferred) Heritage records, makers and workshops joined in one loop, with
provenance and review status shown on every record rather than hidden.

## Operating Context
Front-end prototype only. All records, artisans, sessions, and Q&A answers are
local fixtures. Booking requests and contributions are stored in the visitor's
browser. No AI service, payment, or review backend is connected.

## Capabilities and Constraints
- Routes: home, discover, record detail, artisans, artisan detail, experiences,
  experience detail with booking demo, ask, contribute, about, bookings lookup.
- Stack: React 19, Vite, Tailwind v4, TypeScript, hash routing.
- Must keep the "sample / unverified / local only" disclosures visible.

## Brand Commitments
Names: CultureLens, Ọ̀nà Àṣà, Team Àṣà. Yoruba diacritics must render correctly.

## Evidence on Hand
Five craft photos in `src/assets/images/` (loom weaving, adire, beadmaking,
pottery studio, a hero loom image). No photos exist for bronze casting, uli, or
woodcarving. No real artisan identities, consent, testimonials, or verified
citations exist; never fabricate them.

## Product Principles
1. Provenance before polish: every claim shows its review status.
2. Makers keep agency: no private details, no implied consent.
3. Honest about the prototype: demo flows say what they do not do.
