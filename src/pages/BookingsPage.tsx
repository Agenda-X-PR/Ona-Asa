import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { apiService } from '../services/apiService';
import { BookingRecord } from '../types';
import { Search, Calendar, Clock, MapPin, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

export const BookingsPage: React.FC = () => {
  const { navigate } = useRouter();
  const [referenceInput, setReferenceInput] = useState('');
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceInput.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await apiService.lookupBooking(referenceInput.trim());
      setBooking(res);
    } catch {
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      <div>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-medium text-stone-600 hover:text-[#34205B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </button>
      </div>

      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-[#8A68C7]">
          LOCAL DEMO REQUEST LOOKUP
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#34205B] font-medium tracking-tight">
          Booking Status Lookup
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          This browser-only demo can look up sample booking requests created here. It cannot confirm a real reservation or payment. Use placeholder contact details only; do not enter real personal information.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleLookup} className="bg-white p-6 rounded-2xl border-2 border-[#D7C8B3] shadow-sm space-y-3">
        <label htmlFor="booking-reference" className="block text-xs font-mono uppercase tracking-wider text-stone-700">
          ENTER A LOCAL DEMO REFERENCE
        </label>
        <div className="relative flex items-center">
          <input
            id="booking-reference"
            type="text"
            value={referenceInput}
            onChange={(e) => setReferenceInput(e.target.value)}
            placeholder="CL-BK-XXXXX"
            className="w-full py-3 pl-4 pr-28 text-sm sm:text-base font-mono uppercase rounded-lg border border-[#D7C8B3] text-[#241F2B] focus:outline-none focus:ring-2 focus:ring-[#34205B]"
          />
          <button
            type="submit"
            disabled={loading || !referenceInput.trim()}
            className="absolute right-2 px-5 py-2 text-xs sm:text-sm font-medium text-white bg-[#34205B] hover:bg-[#251642] disabled:opacity-50 rounded-md transition-colors cursor-pointer"
          >
            {loading ? 'Checking...' : 'Search local demos'}
          </button>
        </div>
        <p className="text-[11px] text-stone-500 font-sans">
          Only demo requests created in this browser can be looked up. There is no pre-seeded booking reference.
        </p>
      </form>

      {/* Result Display */}
      {searched && !loading && (
        <div className="animate-in fade-in duration-200">
          {booking ? (
            <div className="bg-white rounded-2xl border border-[#D7C8B3] p-6 sm:p-8 space-y-6 shadow-sm">
              
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D7C8B3]/60 pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block">
                    REFERENCE
                  </span>
                  <div className="font-mono text-xl font-bold text-[#34205B]">
                    {booking.reference}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block">
                    SAMPLE STATE · NOT CONFIRMED
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded">
                    {booking.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#FAF7F2] rounded-xl border border-stone-200 space-y-1">
                    <span className="text-stone-500 font-mono text-[11px]">WORKSHOP</span>
                    <h3 className="font-serif text-sm font-medium text-stone-900">
                      {booking.experienceTitle}
                    </h3>
                    <p className="text-stone-600">Led by {booking.artisanName}</p>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] rounded-xl border border-stone-200 space-y-1">
                    <span className="text-stone-500 font-mono text-[11px]">SESSION SCHEDULE</span>
                    <div className="font-medium text-stone-900">{booking.sessionDate}</div>
                    <div className="text-stone-600">{booking.sessionTime}</div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <p className="text-stone-500">Guest contact details are hidden in this demo.</p>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Participants</span>
                    <span className="font-medium">{booking.participantCount} Participant(s)</span>
                  </div>
                  <div className="flex justify-between py-1 text-sm font-semibold text-stone-900 pt-1">
                    <span>Total Amount</span>
                    <span className="font-mono text-base">₦{booking.totalAmountNaira.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Server-Side Payment Verification Notice */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs text-stone-700">
                <div className="flex items-center gap-2 font-medium text-stone-900">
                  <ShieldCheck className="w-4 h-4 text-[#8A68C7]" />
                  <span>Demo Status · No Payment Service</span>
                </div>
                <p className="leading-relaxed">
                  This local sample request is <strong>{booking.status.replace('_', ' ')}</strong>; that is not a confirmed reservation. No payment was initiated or received, and the payment status shown here is only fixture data ({booking.paymentStatus.toUpperCase()}).
                </p>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-stone-400 mx-auto" />
              <h3 className="font-serif text-lg text-stone-900">No Local Demo Request Found</h3>
              <p className="text-xs text-stone-500">
                This browser has no saved demo record with reference "{referenceInput}". Real booking systems are not connected.
              </p>
            </div>
          )}
        </div>
      )}

      {searched && loading && (
        <p role="status" className="text-center text-sm text-stone-600">Checking local demo data…</p>
      )}

    </div>
  );
};
