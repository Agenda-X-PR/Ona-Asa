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

const STORAGE_KEY_BOOKINGS = 'culturelens_demo_bookings_v1';
const STORAGE_KEY_CONTRIBUTIONS = 'culturelens_demo_contributions_v1';

// Seed initial bookings into localStorage if empty
function getStoredBookings(): BookingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (!raw) {
      const initialBookings: BookingRecord[] = [
        {
          id: 'bk_demo_01',
          reference: 'CL-BK-89210',
          experienceId: 'exp_asooke_workshop',
          experienceTitle: 'Hands-on Aso-Òkè Loom Workshop: Weave Your First Strip',
          sessionId: 'sess_aso_01',
          sessionDate: '2026-10-18',
          sessionTime: '10:00 AM – 1:30 PM',
          artisanId: 'art_babatunde_adeyemi',
          artisanName: 'Babatunde Adeyemi',
          participantCount: 2,
          guestName: 'Tunde Bakare',
          guestEmail: 'tunde.bakare@example.ng',
          guestPhone: '+234 802 345 6789',
          totalAmountNaira: 70000,
          currency: 'NGN',
          status: 'pending_request',
          paymentStatus: 'pending',
          paymentProvider: 'ALATPay (Demo Boundary)',
          createdAt: '2026-10-09T14:22:00Z',
          specialRequests: 'Would love to focus on indigo Etu stripe pattern.'
        }
      ];
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(initialBookings));
      return initialBookings;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function getStoredContributions(): ContributionSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONTRIBUTIONS);
    if (!raw) {
      const initialSubmissions: ContributionSubmission[] = [
        {
          id: 'contrib_demo_01',
          reference: 'CL-CT-40192',
          type: 'oral_history',
          title: 'Iseyin Cotton Spindle Lore & Weaver Incantations',
          description: 'Documenting the songs sung by women spinners when winding cotton bobbins for horizontal loom weavers.',
          community: 'Iseyin Weaving Guild',
          region: 'Oyo State',
          language: 'Yorùbá',
          sources: 'Recorded from Mama Ayinke Adekoya, elder spinner in Iseyin.',
          attributionPreference: 'public',
          contributorName: 'Folake Adeleke',
          contributorEmail: 'f.adeleke@example.org',
          consentGiven: true,
          sensitivityLevel: 'public',
          status: 'under_review',
          submittedAt: '2026-10-08T09:15:00Z',
          reviewNotes: 'Assigned to Cultural Review Board for lineage verification.'
        }
      ];
      localStorage.setItem(STORAGE_KEY_CONTRIBUTIONS, JSON.stringify(initialSubmissions));
      return initialSubmissions;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export const apiService = {
  // Cultural Records
  async getCulturalRecords(query = '', category = '', status = ''): Promise<CulturalRecord[]> {
    await new Promise((r) => setTimeout(r, 80));
    return CULTURAL_RECORDS.filter((rec) => {
      const matchQuery = !query.trim() || 
        rec.title.toLowerCase().includes(query.toLowerCase()) ||
        (rec.nativeName && rec.nativeName.toLowerCase().includes(query.toLowerCase())) ||
        rec.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
        rec.region.toLowerCase().includes(query.toLowerCase()) ||
        rec.community.toLowerCase().includes(query.toLowerCase());
      
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
      message: 'Booking request recorded successfully. Pending server verification & ALATPay settlement.'
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
      message: 'Cultural knowledge contribution submitted for review.'
    };
  },

  async getRecentContributions(): Promise<ContributionSubmission[]> {
    await new Promise((r) => setTimeout(r, 80));
    return getStoredContributions();
  },

  // Grounded Cultural Q&A (Gemma boundary)
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
      answer: 'Our current documented records do not contain verified archival evidence specifically addressing this inquiry. In accordance with Team Àṣà’s provenance policy, CultureLens refrains from fabricating cultural claims or guessing undocumented practices.',
      groundedRecordSlugs: [],
      associatedArtisanIds: [],
      uncertaintyOrDisputeNotes: 'You can contribute oral history, community documentation, or archival references regarding this topic on our Contribute page to assist peer reviewers.',
      confidence: 'insufficient_evidence'
    };
  }
};
