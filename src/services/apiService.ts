import { 
  CulturalRecord, 
  ArtisanProfile, 
  CulturalExperience, 
  BookingRecord, 
  ContributionSubmission, 
  QnAResponse 
} from '../types';
import { 
  CULTURAL_RECORDS, 
  ARTISANS, 
  EXPERIENCES, 
  MOCK_QNA_RESPONSES 
} from '../data/mockData';
import { matchesSearchQuery } from '../utils/search';

const STORAGE_KEY_BOOKINGS = 'culturelens_demo_bookings_v1';
const STORAGE_KEY_CONTRIBUTIONS = 'culturelens_demo_contributions_v1';

function getStoredBookings(): BookingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (!raw) return [];
    const stored = JSON.parse(raw);
    if (!Array.isArray(stored)) return [];
    const bookings = stored.filter((booking) => booking?.id !== 'bk_demo_01');
    if (bookings.length !== stored.length) {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
    }
    return bookings;
  } catch {
    return [];
  }
}

function getStoredContributions(): ContributionSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONTRIBUTIONS);
    if (!raw) return [];
    const stored = JSON.parse(raw);
    if (!Array.isArray(stored)) return [];
    const submissions = stored.filter((submission) => submission?.id !== 'contrib_demo_01');
    if (submissions.length !== stored.length) {
      localStorage.setItem(STORAGE_KEY_CONTRIBUTIONS, JSON.stringify(submissions));
    }
    return submissions;
  } catch {
    return [];
  }
}

export const apiService = {
  // Cultural Records
  async getCulturalRecords(query = '', category = '', status = ''): Promise<CulturalRecord[]> {
    await new Promise((r) => setTimeout(r, 80));
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
    await new Promise((r) => setTimeout(r, 60));
    return CULTURAL_RECORDS.find((r) => r.slug === slug) || null;
  },

  // Artisans
  async getArtisans(craftFilter = '', locationFilter = ''): Promise<ArtisanProfile[]> {
    await new Promise((r) => setTimeout(r, 80));
    return ARTISANS.filter((art) => {
      const matchCraft = !craftFilter || art.craftCategories.some(c => c.toLowerCase() === craftFilter.toLowerCase());
      const matchLocation = !locationFilter || art.publicLocation.toLowerCase().includes(locationFilter.toLowerCase());
      return matchCraft && matchLocation;
    });
  },

  async getArtisanBySlug(slug: string): Promise<ArtisanProfile | null> {
    await new Promise((r) => setTimeout(r, 60));
    return ARTISANS.find((a) => a.slug === slug) || null;
  },

  async getArtisanById(id: string): Promise<ArtisanProfile | null> {
    return ARTISANS.find((a) => a.id === id) || null;
  },

  // Experiences
  async getExperiences(category = ''): Promise<CulturalExperience[]> {
    await new Promise((r) => setTimeout(r, 80));
    return EXPERIENCES.filter((exp) => {
      return !category || exp.category.toLowerCase() === category.toLowerCase();
    });
  },

  async getExperienceBySlug(slug: string): Promise<CulturalExperience | null> {
    await new Promise((r) => setTimeout(r, 60));
    return EXPERIENCES.find((e) => e.slug === slug) || null;
  },

  // Bookings (demonstrative workflow with explicit server boundary note)
  async createBookingRequest(payload: {
    experienceId: string;
    sessionId: string;
    participantCount: number;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    specialRequests?: string;
  }): Promise<{ success: boolean; booking: BookingRecord; message: string }> {
    await new Promise((r) => setTimeout(r, 300));
    const experience = EXPERIENCES.find(e => e.id === payload.experienceId);
    if (!experience) {
      throw new Error('Experience not found.');
    }
    const session = experience.sessions.find(s => s.id === payload.sessionId);
    if (!session) {
      throw new Error('Selected session date is no longer available.');
    }
    if (session.status === 'full' || session.bookedCount + payload.participantCount > session.capacity) {
      throw new Error('Requested participant count exceeds remaining capacity for this session.');
    }

    const artisan = ARTISANS.find(a => a.id === experience.artisanId);
    const referenceNum = 'CL-BK-' + Math.floor(10000 + Math.random() * 90000);
    const totalAmount = experience.priceNaira * payload.participantCount;

    const newBooking: BookingRecord = {
      id: 'bk_' + Date.now(),
      reference: referenceNum,
      experienceId: experience.id,
      experienceTitle: experience.title,
      sessionId: session.id,
      sessionDate: session.date,
      sessionTime: session.time,
      artisanId: experience.artisanId,
      artisanName: artisan?.displayName || 'Master Artisan',
      participantCount: payload.participantCount,
      guestName: payload.guestName,
      guestEmail: payload.guestEmail,
      guestPhone: payload.guestPhone,
      specialRequests: payload.specialRequests,
      totalAmountNaira: totalAmount,
      currency: 'NGN',
      status: 'pending_request',
      paymentStatus: 'pending',
      paymentProvider: 'ALATPay (Demo Boundary)',
      createdAt: new Date().toISOString()
    };

    const currentBookings = getStoredBookings();
    currentBookings.unshift(newBooking);
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(currentBookings));

    return {
      success: true,
      booking: newBooking,
      message: 'Demo booking request saved only in this browser. No reservation or payment was made.'
    };
  },

  async lookupBooking(reference: string): Promise<BookingRecord | null> {
    await new Promise((r) => setTimeout(r, 120));
    const list = getStoredBookings();
    const cleanRef = reference.trim().toUpperCase();
    return list.find(b => b.reference.toUpperCase() === cleanRef) || null;
  },

  // Contributions
  async submitContribution(payload: Omit<ContributionSubmission, 'id' | 'reference' | 'status' | 'submittedAt'>): Promise<{
    success: boolean;
    submission: ContributionSubmission;
    message: string;
  }> {
    await new Promise((r) => setTimeout(r, 250));
    if (payload.sensitivityLevel !== 'public') {
      throw new Error('The local demo cannot safely store restricted or sacred knowledge.');
    }
    const ref = 'CL-CT-' + Math.floor(10000 + Math.random() * 90000);
    const newSubmission: ContributionSubmission = {
      ...payload,
      id: 'ct_' + Date.now(),
      reference: ref,
      status: 'under_review',
      submittedAt: new Date().toISOString()
    };

    const current = getStoredContributions();
    current.unshift(newSubmission);
    localStorage.setItem(STORAGE_KEY_CONTRIBUTIONS, JSON.stringify(current));

    return {
      success: true,
      submission: newSubmission,
      message: 'Demo contribution saved only in this browser. It was not sent for review.'
    };
  },

  async getRecentContributions(): Promise<ContributionSubmission[]> {
    await new Promise((r) => setTimeout(r, 80));
    return getStoredContributions();
  },

  // Local keyword-matched Q&A fixtures; no Gemma or retrieval service is called.
  async askCulturalQuestion(query: string): Promise<QnAResponse> {
    await new Promise((r) => setTimeout(r, 450));
    const clean = query.toLowerCase().trim();

    // Check predefined grounded responses
    if (clean.includes('indigo') || clean.includes('adire') || clean.includes('dye')) {
      return MOCK_QNA_RESPONSES['adire-indigo'];
    }
    if (clean.includes('aso') || clean.includes('loom') || clean.includes('weave') || clean.includes('sanyan')) {
      return MOCK_QNA_RESPONSES['aso-oke-looms'];
    }
    if (clean.includes('bronze') || clean.includes('benin') || clean.includes('cast') || clean.includes('wax')) {
      return MOCK_QNA_RESPONSES['benin-bronze-casting'];
    }
    if (clean.includes('bead') || clean.includes('ileke') || clean.includes('coral') || clean.includes('crown')) {
      return MOCK_QNA_RESPONSES['ileke-beads'];
    }

    // Default honest grounded limitation (PRD explicit requirement: never hallucinate or invent facts)
    return {
      id: 'qna_unsupported_' + Date.now(),
      question: query,
      answer: 'The local sample dataset has no matching fixture for this inquiry. This prototype cannot establish whether evidence exists elsewhere, and this response is not a researched or model-generated answer.',
      groundedRecordSlugs: [],
      associatedArtisanIds: [],
      uncertaintyOrDisputeNotes: 'The Contribute page is a local-only demo form; entries are not sent to reviewers.',
      confidence: 'insufficient_evidence'
    };
  }
};
