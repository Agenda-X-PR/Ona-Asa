import type {
  ArtisanProfile,
  BookingRecord,
  ContributionSubmission,
  CulturalExperience,
  CulturalRecord,
  QnAResponse,
} from '../types';
import { ARTISANS, CULTURAL_RECORDS, EXPERIENCES, MOCK_QNA_RESPONSES } from '../data/mockData';
import { bestKeywordMatch, matchesSearchQuery } from '../utils/search';
import { checkBookingRequest, generateReference, todayInLagos } from '../lib/booking';

// Stand-in for a real API. Everything below reads fixtures or this browser's
// localStorage; nothing leaves the device.

const STORAGE_KEY_BOOKINGS = 'culturelens_demo_bookings_v1';
const STORAGE_KEY_CONTRIBUTIONS = 'culturelens_demo_contributions_v1';
const STORAGE_KEY_SEATS = 'culturelens_demo_session_seats_v1';

/** Short pause so loading states are exercised the way a network call would. */
const settle = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function readList<T>(key: string, isValid: (item: unknown) => boolean): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed.filter(isValid) as T[]) : [];
  } catch {
    return [];
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    throw new Error('This browser blocked local storage, so the demo could not save. Allow site data and try again.');
  }
}

const isBooking = (b: unknown) =>
  typeof b === 'object' && b !== null && typeof (b as BookingRecord).reference === 'string' && (b as BookingRecord).id !== 'bk_demo_01';
const isContribution = (c: unknown) =>
  typeof c === 'object' && c !== null && typeof (c as ContributionSubmission).reference === 'string' && (c as ContributionSubmission).id !== 'contrib_demo_01';

const getStoredBookings = () => readList<BookingRecord>(STORAGE_KEY_BOOKINGS, isBooking);
const getStoredContributions = () => readList<ContributionSubmission>(STORAGE_KEY_CONTRIBUTIONS, isContribution);

/** Seats this browser has requested, per session id. */
function getRequestedSeats(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SEATS);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(
        (entry): entry is [string, number] => typeof entry[1] === 'number' && entry[1] > 0,
      ),
    );
  } catch {
    return {};
  }
}

/** Fold this browser's requests into the fixture's booked counts. */
function withRequestedSeats(experience: CulturalExperience): CulturalExperience {
  const requested = getRequestedSeats();
  return {
    ...experience,
    sessions: experience.sessions.map((session) => ({
      ...session,
      bookedCount: session.bookedCount + (requested[session.id] ?? 0),
    })),
  };
}

/** Keywords that route a question to one of the four canned answers. */
const QNA_KEYWORDS: Record<keyof typeof MOCK_QNA_RESPONSES, string[]> = {
  'adire-indigo': ['adire', 'indigo', 'dye', 'dyes', 'dyed', 'dyeing', 'eleko', 'resist', 'cassava'],
  'aso-oke-looms': ['aso oke', 'aso', 'loom', 'looms', 'weave', 'weaver', 'sanyan', 'etu', 'alaari'],
  'benin-bronze-casting': ['bronze', 'benin', 'brass', 'cast', 'lost wax', 'igun', 'plaque'],
  'ileke-beads': ['ileke', 'bead', 'beads', 'beadwork', 'coral', 'crown', 'regalia'],
};

export const apiService = {
  async getCulturalRecords(query = '', category = '', status = ''): Promise<CulturalRecord[]> {
    await settle(60);
    return CULTURAL_RECORDS.filter((rec) => {
      const matchQuery = matchesSearchQuery(query, [
        rec.title,
        rec.nativeName ?? '',
        rec.language ?? '',
        rec.category,
        rec.region,
        rec.community,
        rec.shortDescription,
        ...rec.fullNarrative,
        rec.historicalContext,
        rec.materialAndTechnique,
        ...rec.sources.map((source) => source.citation),
      ]);
      const matchCategory = !category || rec.category === category;
      const matchStatus = !status || rec.status === status;
      return matchQuery && matchCategory && matchStatus;
    });
  },

  async getCulturalRecordBySlug(slug: string): Promise<CulturalRecord | null> {
    await settle(40);
    return CULTURAL_RECORDS.find((r) => r.slug === slug) ?? null;
  },

  async getCulturalRecordsBySlugs(slugs: string[]): Promise<CulturalRecord[]> {
    await settle(20);
    return slugs.map((slug) => CULTURAL_RECORDS.find((r) => r.slug === slug)).filter((r): r is CulturalRecord => !!r);
  },

  async getArtisans(query = '', craftFilter = '', locationFilter = ''): Promise<ArtisanProfile[]> {
    await settle(60);
    return ARTISANS.filter((art) => {
      const matchQuery = matchesSearchQuery(query, [
        art.displayName,
        art.nativeTitle ?? '',
        art.craft,
        ...art.craftCategories,
        art.bio,
        art.publicLocation,
      ]);
      const matchCraft = !craftFilter || art.craftCategories.some((c) => c.toLowerCase() === craftFilter.toLowerCase());
      const matchLocation = !locationFilter || art.publicLocation.toLowerCase().includes(locationFilter.toLowerCase());
      return matchQuery && matchCraft && matchLocation;
    });
  },

  async getArtisanBySlug(slug: string): Promise<ArtisanProfile | null> {
    await settle(40);
    return ARTISANS.find((a) => a.slug === slug) ?? null;
  },

  async getArtisansByIds(ids: string[]): Promise<ArtisanProfile[]> {
    await settle(20);
    return ids.map((id) => ARTISANS.find((a) => a.id === id)).filter((a): a is ArtisanProfile => !!a);
  },

  async getExperiences(query = '', category = ''): Promise<CulturalExperience[]> {
    await settle(60);
    return EXPERIENCES.filter((exp) => {
      const artisan = ARTISANS.find((a) => a.id === exp.artisanId);
      const matchQuery = matchesSearchQuery(query, [
        exp.title,
        exp.craft,
        exp.category,
        exp.shortSummary,
        exp.locationMeetingPoint,
        artisan?.displayName ?? '',
      ]);
      const matchCategory = !category || exp.category.toLowerCase() === category.toLowerCase();
      return matchQuery && matchCategory;
    }).map(withRequestedSeats);
  },

  async getExperiencesByIds(ids: string[]): Promise<CulturalExperience[]> {
    await settle(20);
    return EXPERIENCES.filter((e) => ids.includes(e.id)).map(withRequestedSeats);
  },

  async getExperienceBySlug(slug: string): Promise<CulturalExperience | null> {
    await settle(40);
    const experience = EXPERIENCES.find((e) => e.slug === slug);
    return experience ? withRequestedSeats(experience) : null;
  },

  async createBookingRequest(
    payload: {
      experienceId: string;
      sessionId: string;
      participantCount: number;
      guestName: string;
      guestEmail: string;
      guestPhone: string;
      specialRequests?: string;
    },
    today: string = todayInLagos(),
  ): Promise<{ booking: BookingRecord; message: string }> {
    await settle(250);
    const fixture = EXPERIENCES.find((e) => e.id === payload.experienceId);
    if (!fixture) throw new Error('That workshop no longer exists.');
    const experience = withRequestedSeats(fixture);
    const session = experience.sessions.find((s) => s.id === payload.sessionId);

    const check = checkBookingRequest(session, payload.participantCount, today);
    if (!check.ok || !session) throw new Error(check.ok ? 'That session date no longer exists.' : check.reason);

    const artisan = ARTISANS.find((a) => a.id === experience.artisanId);
    const existing = getStoredBookings();
    const booking: BookingRecord = {
      id: `bk_${crypto.randomUUID()}`,
      reference: generateReference('CL-BK', existing.map((b) => b.reference)),
      experienceId: experience.id,
      experienceTitle: experience.title,
      sessionId: session.id,
      sessionDate: session.date,
      sessionTime: session.time,
      artisanId: experience.artisanId,
      artisanName: artisan?.displayName ?? 'Sample artisan',
      participantCount: payload.participantCount,
      guestName: payload.guestName,
      guestEmail: payload.guestEmail,
      guestPhone: payload.guestPhone,
      specialRequests: payload.specialRequests,
      totalAmountNaira: experience.priceNaira * payload.participantCount,
      currency: 'NGN',
      status: 'pending_request',
      paymentStatus: 'pending',
      paymentProvider: 'ALATPay (Demo Boundary)',
      createdAt: new Date().toISOString(),
    };

    const requested = getRequestedSeats();
    requested[session.id] = (requested[session.id] ?? 0) + payload.participantCount;
    write(STORAGE_KEY_BOOKINGS, [booking, ...existing]);
    write(STORAGE_KEY_SEATS, requested);

    return {
      booking,
      message: 'Demo booking request saved only in this browser. No reservation or payment was made.',
    };
  },

  async lookupBooking(reference: string): Promise<BookingRecord | null> {
    await settle(100);
    const clean = reference.trim().toUpperCase();
    return getStoredBookings().find((b) => b.reference.toUpperCase() === clean) ?? null;
  },

  async submitContribution(
    payload: Omit<ContributionSubmission, 'id' | 'reference' | 'status' | 'submittedAt'>,
  ): Promise<{ submission: ContributionSubmission; message: string }> {
    await settle(200);
    if (payload.sensitivityLevel !== 'public') {
      throw new Error('The local demo cannot safely store restricted or sacred knowledge.');
    }
    const existing = getStoredContributions();
    const submission: ContributionSubmission = {
      ...payload,
      id: `ct_${crypto.randomUUID()}`,
      reference: generateReference('CL-CT', existing.map((c) => c.reference)),
      status: 'under_review',
      submittedAt: new Date().toISOString(),
    };
    write(STORAGE_KEY_CONTRIBUTIONS, [submission, ...existing]);
    return {
      submission,
      message: 'Demo contribution saved only in this browser. It was not sent for review.',
    };
  },

  async getRecentContributions(): Promise<ContributionSubmission[]> {
    await settle(40);
    return getStoredContributions();
  },

  /** Canned answers chosen by whole-word keyword match. No model is called. */
  async askCulturalQuestion(query: string): Promise<QnAResponse> {
    await settle(350);
    const key = bestKeywordMatch(query, QNA_KEYWORDS);
    // Keep the fixture's own question: the page shows which sample question was answered.
    if (key) return MOCK_QNA_RESPONSES[key];

    return {
      id: `qna_unsupported_${Date.now()}`,
      question: query,
      answer:
        'The sample dataset has no answer for this question. This prototype cannot tell whether evidence exists elsewhere, and it does not generate answers.',
      groundedRecordSlugs: [],
      associatedArtisanIds: [],
      uncertaintyOrDisputeNotes: 'The Contribute page is a local-only demo form; entries are not sent to reviewers.',
      confidence: 'insufficient_evidence',
    };
  },
};

export { QNA_KEYWORDS };
