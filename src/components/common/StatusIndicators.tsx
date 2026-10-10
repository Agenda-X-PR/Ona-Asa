import React from 'react';
import { CulturalRecordStatus, ArtisanVerificationStatus, SensitivityLevel } from '../../types';
import { CheckCircle2, AlertCircle, Clock, ShieldAlert, Sparkles } from 'lucide-react';

export const CulturalStatusLabel: React.FC<{ status: CulturalRecordStatus }> = ({ status }) => {
  switch (status) {
    case 'documented':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Archivally Documented</span>
        </span>
      );
    case 'community_reviewed':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#34205B]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#8A68C7]" aria-hidden="true" />
          <span>Community Reviewed</span>
        </span>
      );
    case 'under_review':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800">
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Under Peer Review</span>
        </span>
      );
    case 'disputed':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-800">
          <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Contested Tradition</span>
        </span>
      );
  }
};

export const ArtisanVerificationLabel: React.FC<{ status: ArtisanVerificationStatus }> = ({ status }) => {
  switch (status) {
    case 'verified':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#34205B]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#8A68C7]" aria-hidden="true" />
          <span>Verified Master Artisan</span>
        </span>
      );
    case 'community_acknowledged':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700">
          <Sparkles className="w-3.5 h-3.5 text-stone-500" aria-hidden="true" />
          <span>Guild Acknowledged</span>
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800">
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Verification Pending</span>
        </span>
      );
  }
};

export const SensitivityLabel: React.FC<{ level: SensitivityLevel }> = ({ level }) => {
  if (level === 'public') {
    return (
      <span className="text-xs text-stone-600">
        Public Heritage
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-900">
      <ShieldAlert className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
      <span>{level.replace('_', ' ').toUpperCase()}</span>
    </span>
  );
};
