import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { apiService } from '../services/apiService';
import { CulturalExperience, ArtisanProfile, BookingRecord } from '../types';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  AlertCircle,
  FileText,
  CreditCard,
  ArrowRight
} from 'lucide-react';

export const ExperienceDetailPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const slug = params.slug;

  const [experience, setExperience] = useState<CulturalExperience | null>(null);
  const [artisan, setArtisan] = useState<ArtisanProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [participantCount, setParticipantCount] = useState<number>(1);
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [completedBooking, setCompletedBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    if (slug) {
      apiService.getExperienceBySlug(slug).then(async (exp) => {
        if (!isMounted) return;
        setExperience(exp);

        if (exp) {
          const art = await apiService.getArtisanById(exp.artisanId);
          if (isMounted) setArtisan(art);

          // Default select the first available session
          const firstAvail = exp.sessions.find(s => s.status === 'available');
          if (firstAvail) setSelectedSessionId(firstAvail.id);
        }
        setLoading(false);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!experience) return;
    if (!selectedSessionId) {
      setFormError('Please select an available workshop session date.');
      return;
    }
    if (!guestName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      setFormError('Please enter a valid contact email address.');
      return;
    }
    if (!guestPhone.trim() || guestPhone.length < 7) {
      setFormError('Please provide a valid telephone number for workshop access.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiService.createBookingRequest({
        experienceId: experience.id,
        sessionId: selectedSessionId,
        participantCount,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        specialRequests: specialRequests.trim() || undefined
      });

      if (res.success) {
        setCompletedBooking(res.booking);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Failed to record booking request. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#34205B] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono uppercase tracking-wider text-stone-500">
          Loading workshop itinerary...
        </p>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#34205B]">Experience Not Found</h2>
        <p className="text-sm text-stone-600">The requested workshop does not exist or has concluded.</p>
        <button
          onClick={() => navigate('/experiences')}
          className="px-4 py-2 text-xs font-medium text-white bg-[#34205B] rounded-md"
        >
          Return to Experiences
        </button>
      </div>
    );
  }

  const selectedSession = experience.sessions.find(s => s.id === selectedSessionId);
  const remainingSeats = selectedSession ? selectedSession.capacity - selectedSession.bookedCount : 0;
  const totalPrice = experience.priceNaira * participantCount;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Navigation & Header */}
      <div>
        <button
          onClick={() => navigate('/experiences')}
          className="inline-flex items-center gap-2 text-xs font-medium text-stone-600 hover:text-[#34205B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Experiences</span>
        </button>
      </div>

      {/* Main Title Banner */}
      <div className="space-y-4 max-w-4xl">
        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 font-sans">
          <span>{experience.category}</span>
          <span aria-hidden="true">·</span>
          <span>{experience.craft}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5 text-[#8A68C7]" />
            {experience.durationHours} Hours Session
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#34205B] font-medium leading-[1.15]">
          {experience.title}
        </h1>

        {artisan && (
          <div className="flex items-center gap-3 pt-1">
            <img
              src={artisan.avatarUrl}
              alt={artisan.displayName}
              className="w-10 h-10 rounded-full object-cover border border-[#8A68C7]"
              referrerPolicy="no-referrer"
            />
            <div className="text-xs">
              <span className="text-stone-500 block">Led by Master Artisan</span>
              <button
                onClick={() => navigate(`/artisans/${artisan.slug}`)}
                className="font-medium text-[#34205B] hover:text-[#8A68C7] transition-colors underline cursor-pointer"
              >
                {artisan.displayName} ({artisan.nativeTitle || artisan.craft})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Split Layout: 65% Details / 35% Booking Form Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Itinerary, What to Expect, Logistics */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Main Hero Photograph */}
          <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-[#D7C8B3] bg-stone-100 shadow-sm">
            <img
              src={experience.imageUrl}
              alt={experience.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Description & Narrative */}
          <div className="bg-white rounded-xl border border-[#D7C8B3] p-6 sm:p-8 space-y-4">
            <h2 className="font-serif text-2xl font-medium text-[#34205B]">
              Workshop Overview
            </h2>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans">
              {experience.description}
            </p>
          </div>

          {/* What Participants Can Expect */}
          <div className="bg-white rounded-xl border border-[#D7C8B3] p-6 sm:p-8 space-y-4">
            <h3 className="font-serif text-xl font-medium text-[#34205B]">
              What Participants Can Expect
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-stone-700">
              {experience.whatToExpect.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#8A68C7] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Materials & Tools Provided */}
          <div className="bg-white rounded-xl border border-[#D7C8B3] p-6 sm:p-8 space-y-4">
            <h3 className="font-serif text-xl font-medium text-[#34205B]">
              Tools & Materials Provided
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
              {experience.materialsProvided.map((mat, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34205B] mt-2 shrink-0" />
                  <span>{mat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Location & Cancellation Policy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-[#FAF7F2] rounded-xl border border-[#D7C8B3] space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-[#34205B]">
                <MapPin className="w-4 h-4 text-[#8A68C7]" />
                <span>Atelier Meeting Point</span>
              </div>
              <p className="text-stone-700 leading-relaxed">{experience.locationMeetingPoint}</p>
            </div>

            <div className="p-5 bg-[#FAF7F2] rounded-xl border border-[#D7C8B3] space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-[#34205B]">
                <ShieldCheck className="w-4 h-4 text-[#8A68C7]" />
                <span>Cancellation Policy</span>
              </div>
              <p className="text-stone-700 leading-relaxed">{experience.cancellationPolicy}</p>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Booking Form Card */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          
          <div className="bg-white rounded-2xl border-2 border-[#D7C8B3] p-6 sm:p-8 shadow-md space-y-6">
            
            <div className="border-b border-[#D7C8B3]/60 pb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
                RESERVE YOUR WORKSHOP SEAT
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-[#34205B] tabular-nums">
                  ₦{experience.priceNaira.toLocaleString()}
                </span>
                <span className="text-xs text-stone-500">per participant</span>
              </div>
            </div>

            {completedBooking ? (
              /* Success Confirmation Receipt */
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h3 className="font-serif text-lg font-medium text-emerald-900">
                    Booking Request Recorded
                  </h3>
                  <div className="font-mono text-sm font-semibold text-emerald-800 bg-white py-1 px-3 rounded-md inline-block border border-emerald-200">
                    REF: {completedBooking.reference}
                  </div>
                </div>

                <div className="text-xs space-y-2 bg-[#FAF7F2] p-4 rounded-xl border border-stone-200">
                  <div className="flex justify-between py-1 border-b border-stone-200">
                    <span className="text-stone-500">Workshop</span>
                    <span className="font-medium text-right">{experience.title}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200">
                    <span className="text-stone-500">Date & Time</span>
                    <span className="font-medium">{completedBooking.sessionDate} ({completedBooking.sessionTime})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200">
                    <span className="text-stone-500">Participants</span>
                    <span className="font-medium">{completedBooking.participantCount} Guest(s)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200">
                    <span className="text-stone-500">Guest Name</span>
                    <span className="font-medium">{completedBooking.guestName}</span>
                  </div>
                  <div className="flex justify-between py-1 font-semibold text-stone-900 pt-2">
                    <span>Total Amount</span>
                    <span className="font-mono">₦{completedBooking.totalAmountNaira.toLocaleString()}</span>
                  </div>
                </div>

                {/* Integration Boundary Note */}
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-relaxed space-y-1">
                  <strong className="block font-medium">Demonstration State Notice:</strong>
                  <span>
                    This booking request is safely saved in local state. In production, this transitions to Member A’s backend ALATPay transaction verification flow before issuing the final confirmed ticket.
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => navigate('/bookings')}
                    className="w-full py-2.5 text-xs font-medium text-white bg-[#34205B] hover:bg-[#251642] rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Verify in Booking Lookup</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCompletedBooking(null)}
                    className="w-full py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-md transition-colors"
                  >
                    Book another date
                  </button>
                </div>
              </div>
            ) : (
              /* Interactive Booking Form */
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                
                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Session Date Selection */}
                <div>
                  <label className="block font-medium text-stone-800 mb-2">
                    Select Workshop Date
                  </label>
                  <div className="space-y-2">
                    {experience.sessions.map((sess) => {
                      const isFull = sess.status === 'full';
                      const isSelected = selectedSessionId === sess.id;
                      const seatsLeft = sess.capacity - sess.bookedCount;

                      return (
                        <label
                          key={sess.id}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                            isFull 
                              ? 'bg-stone-100 border-stone-200 opacity-60 cursor-not-allowed'
                              : isSelected
                              ? 'bg-[#34205B]/5 border-[#34205B] ring-1 ring-[#34205B]'
                              : 'bg-white border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="session"
                              value={sess.id}
                              disabled={isFull}
                              checked={isSelected}
                              onChange={() => setSelectedSessionId(sess.id)}
                              className="text-[#34205B] focus:ring-[#34205B]"
                            />
                            <div>
                              <div className="font-medium text-stone-900">{sess.date}</div>
                              <div className="text-[11px] text-stone-500">{sess.time}</div>
                            </div>
                          </div>
                          
                          <div className="font-mono text-[11px] text-stone-600">
                            {isFull ? (
                              <span className="text-rose-700 font-medium">Session Full</span>
                            ) : (
                              <span>{seatsLeft} seat(s) open</span>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Participant Count */}
                <div>
                  <label className="block font-medium text-stone-800 mb-1">
                    Number of Participants
                  </label>
                  <select
                    value={participantCount}
                    onChange={(e) => setParticipantCount(Number(e.target.value))}
                    disabled={!selectedSession || remainingSeats === 0}
                    className="w-full p-2.5 rounded-lg border border-[#D7C8B3] bg-white text-stone-900 focus:ring-2 focus:ring-[#34205B]"
                  >
                    {[1, 2, 3, 4].filter(num => num <= Math.max(1, remainingSeats)).map((n) => (
                      <option key={n} value={n}>
                        {n} Participant{n > 1 ? 's' : ''} (₦{(experience.priceNaira * n).toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Guest Contact Details */}
                <div className="space-y-3 pt-2 border-t border-stone-200">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Babajide Sowore"
                      className="w-full p-2.5 rounded-md border border-[#D7C8B3] text-stone-900 focus:ring-2 focus:ring-[#34205B]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="e.g. jide.sowore@example.ng"
                      className="w-full p-2.5 rounded-md border border-[#D7C8B3] text-stone-900 focus:ring-2 focus:ring-[#34205B]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="e.g. +234 803 123 4567"
                      className="w-full p-2.5 rounded-md border border-[#D7C8B3] text-stone-900 focus:ring-2 focus:ring-[#34205B]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Special Requests or Accessibility</label>
                    <textarea
                      rows={2}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Any mobility requirements, left-hand loom adjustments, or queries..."
                      className="w-full p-2.5 rounded-md border border-[#D7C8B3] text-stone-900 focus:ring-2 focus:ring-[#34205B]"
                    />
                  </div>
                </div>

                {/* Real-time Order Summary */}
                <div className="p-3 bg-[#FAF7F2] rounded-lg border border-stone-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-stone-500 block">Total Due</span>
                    <span className="text-[11px] text-stone-500">
                      {participantCount} × ₦{experience.priceNaira.toLocaleString()}
                    </span>
                  </div>
                  <span className="font-mono text-lg font-bold text-[#34205B]">
                    ₦{totalPrice.toLocaleString()}
                  </span>
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  disabled={submitting || !selectedSessionId}
                  className="w-full py-3 text-sm font-medium text-white bg-[#34205B] hover:bg-[#251642] disabled:opacity-50 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Recording Request...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Request Workshop Reservation</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-stone-500 text-center leading-relaxed">
                  Demonstrative booking flow. No charges are incurred during this frontend evaluation.
                </p>

              </form>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
