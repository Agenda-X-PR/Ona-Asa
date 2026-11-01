# TODO for Team Àṣà

Items the code cannot settle on its own. Nothing here should be filled in with
guessed content.

## Names and credits
- [ ] Replace "Member A" and "Member B" with the real team credits, or remove
      them. They appear in `src/pages/AboutPage.tsx` and the prototype notice in
      `src/App.tsx`.

## Images the team needs to supply
The prototype only ships five illustrative photos. Pages without a matching
photo show a drawn craft pattern instead. To add photos, put them in
`src/assets/images/` and map them in `src/data/images.ts`.
- [ ] Bronze casting (record `benin-bronze-lost-wax`, workshop
      `benin-bronze-lost-wax-demo`). It previously reused a loom photo.
- [ ] Uli line painting (record `uli-mural-and-body-art`). It previously reused
      the adire photo.
- [ ] Woodcarving (the category exists but has no record yet).
- [ ] Artisan portraits for all five sample profiles, with the subject's
      consent. Craft photos are no longer shown as portraits.
- [ ] Studio photos for each artisan, if wanted. The old "studio view" gallery
      showed generic craft photos and was removed.
- [ ] Confirm what the five existing photos actually show and where they came
      from, so captions can be written. They currently carry neutral,
      descriptive alt text only.

## Content to verify
- [ ] Bronze record: the "UNESCO cultural heritage zone" claim
      (`src/data/mockData.ts`, `historicalContext` of `rec_bronze_05`).
- [ ] Bronze record: the source "Oral histories of the Enogie of Igun Street".
- [ ] Ìlẹ̀kẹ̀ Q&A answer names the sample profile "Kemi Balogun" as a real
      custodian. Either confirm a real, consenting person or reword.
- [ ] Ìlẹ̀kẹ̀ Q&A note on "Ile-Ife dichroic glass beads".
- [ ] Q&A confidence labels were lowered from "high" to "partial evidence" to
      match the site's "not verified" framing. Raise them only after review.
- [ ] Uli is filed under the "Oral Heritage" category. Confirm the right
      category.

## Schedule data
- [ ] Every sample workshop session date is now in the past (latest
      2026-11-01), so the booking demo correctly shows no open dates. Add
      upcoming sample dates to `EXPERIENCES` in `src/data/mockData.ts` if the
      demo should be bookable.

## Backend (not started in this repo)
- [ ] Real booking, payment, contribution review and Q&A services. Everything
      currently lives in the visitor's browser.
