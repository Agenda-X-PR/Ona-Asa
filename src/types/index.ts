export type CulturalRecordStatus = 
  | 'documented'
  | 'community_reviewed'
  | 'disputed'
  | 'under_review';

export type SensitivityLevel = 
  | 'public'
  | 'community_restricted'
  | 'restricted'
  | 'sacred';

export interface SourceReference {
  id: string;
  citation: string;
  year?: number;
  type: 'oral_history' | 'academic_archive' | 'community_elder' | 'museum_catalogue' | 'fieldwork';
  institutionOrContributor?: string;
  accessionRef?: string;
}

export interface CulturalRecord {
  id: string;
  slug: string;
  title: string;
  nativeName?: string;
  language?: string;
  category: 'Textiles' | 'Pottery & Ceramics' | 'Beadwork' | 'Metalcraft & Bronze' | 'Woodcarving' | 'Oral Heritage';
  region: string;
  community: string;
  shortDescription: string;
  fullNarrative: string[];
  historicalContext: string;
  materialAndTechnique: string;
  status: CulturalRecordStatus;
  statusReason?: string;
  sensitivity: SensitivityLevel;
  sources: SourceReference[];
  relatedCraftSlugs: string[];
  relatedArtisanIds: string[];
  imageUrl: string;
  imageCaption: string;
  lastReviewedDate: string;
}

export type ArtisanVerificationStatus = 'verified' | 'community_acknowledged' | 'pending';

export interface ArtisanProfile {
  id: string;
  slug: string;
  displayName: string;
  nativeTitle?: string;
  craft: string;
  craftCategories: string[];
  bio: string;
  story: string;
  publicLocation: string; // approximate area to protect privacy
  workshopArea: string;
  experienceYears: number;
  verificationStatus: ArtisanVerificationStatus;
  publicationStatus: 'published' | 'draft';
  avatarUrl: string;
  studioImages: string[];
  associatedRecordSlugs: string[];
  experienceIds: string[];
  quote: string;
  contactOptions: {
    inquiryEnabled: boolean;
    whatsappInquiry: boolean;
    callPermitted: boolean;
    displayEmail?: string;
  };
}

export interface ExperienceSession {
  id: string;
  date: string;
  time: string;
  capacity: number;
  bookedCount: number;
  status: 'available' | 'full' | 'cancelled';
}

export interface CulturalExperience {
  id: string;
  slug: string;
  artisanId: string;
  title: string;
  craft: string;
  category: string;
  shortSummary: string;
  description: string;
  whatToExpect: string[];
  materialsProvided: string[];
  durationHours: number;
  priceNaira: number;
  currency: 'NGN';
  maxCapacityPerSession: number;
  locationMeetingPoint: string;
  cancellationPolicy: string;
  publicationStatus: 'published' | 'draft';
  imageUrl: string;
  sessions: ExperienceSession[];
}

export type BookingStatus = 'pending_request' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'pending' | 'initiated' | 'succeeded' | 'failed' | 'requires_review';

export interface BookingRecord {
  id: string;
  reference: string;
  experienceId: string;
  experienceTitle: string;
  sessionId: string;
  sessionDate: string;
  sessionTime: string;
  artisanId: string;
  artisanName: string;
  participantCount: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  totalAmountNaira: number;
  currency: 'NGN';
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentProvider: 'ALATPay (Demo Boundary)';
  createdAt: string;
}

export type ContributionType = 
  | 'cultural_story'
  | 'craft_technique'
  | 'oral_history'
  | 'correction'
  | 'photo_archive';

export interface ContributionSubmission {
  id: string;
  reference: string;
  type: ContributionType;
  title: string;
  description: string;
  community: string;
  region: string;
  language?: string;
  sources: string;
  attributionPreference: 'public' | 'pseudonymous' | 'anonymous';
  contributorName?: string;
  contributorEmail: string;
  consentGiven: boolean;
  sensitivityLevel: SensitivityLevel;
  status: 'submitted' | 'under_review' | 'clarification_requested' | 'approved';
  submittedAt: string;
  reviewNotes?: string;
}

export interface QnAResponse {
  id: string;
  question: string;
  answer: string;
  groundedRecordSlugs: string[];
  associatedArtisanIds: string[];
  uncertaintyOrDisputeNotes?: string;
  confidence: 'high' | 'partial_evidence' | 'insufficient_evidence' | 'unsupported';
}
