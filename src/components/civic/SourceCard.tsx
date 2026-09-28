import React from 'react';
import { ExternalLink, Calendar, ShieldCheck, CheckCircle2, Building2 } from 'lucide-react';
import { GovernmentSource } from '../../types';
import { SourceStatusBadge } from '../common/SourceStatusBadge';

interface SourceCardProps {
  source: GovernmentSource;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
  const isVerified = source.status === 'verified' || (source as any).verificationStatus === 'approved';
  const targetUrl = source.sourceUrl || (source as any).url || 'https://igod.gov.in/';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-left">
      {/* Top Banner with Trust Indicator */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{source.department}</h2>
              <SourceStatusBadge status={isVerified ? 'verified' : 'database_only'} size="sm" />
            </div>
            <p className="text-xs text-slate-500 font-semibold">{source.service}</p>
          </div>
        </div>

        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <span>View Official Portal</span>
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Main 2-Card Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Information Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              OFFICIAL GOVERNMENT SOURCE METADATA
            </h3>
            <SourceStatusBadge status={isVerified ? 'verified' : 'database_only'} size="sm" />
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="font-semibold text-slate-500 block">Department / Authority</span>
              <span className="font-bold text-slate-900 text-sm">{source.department}</span>
            </div>

            <div>
              <span className="font-semibold text-slate-500 block">Government Service</span>
              <span className="font-semibold text-slate-800">{source.service}</span>
            </div>

            <div>
              <span className="font-semibold text-slate-500 block">Official Domain</span>
              <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md inline-block mt-1 border border-blue-100">
                {source.officialDomain}
              </span>
            </div>

            <div>
              <span className="font-semibold text-slate-500 block">Source Verification Status</span>
              <span className="font-semibold text-slate-700 flex items-center gap-1.5 mt-1">
                <ShieldCheck size={14} className={isVerified ? 'text-emerald-600' : 'text-amber-600'} />
                {isVerified ? 'Officially Verified Government Source' : 'Database Grounded — Pending Verification'}
              </span>
            </div>
          </div>
        </div>

        {/* Information Obtained Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              EXTRACTED PROCEDURAL SCOPE
            </h3>
          </div>

          {Array.isArray(source.documentsObtained) && source.documentsObtained.length > 0 ? (
            <ul className="space-y-2.5 text-xs font-medium text-slate-700">
              {source.documentsObtained.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Verified Procedural Information</p>
              <p className="text-slate-500">
                Official procedural steps, mandatory document requirements, and department jurisdiction extracted directly from government portal records.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Important Disclaimer */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-center">
        <div className="text-xs text-slate-500 max-w-2xl mx-auto leading-relaxed">
          <strong>Official Government Source Compliance Notice:</strong> CivicPath organizes procedure information directly from official Indian government portals. Always submit final application forms and fee payments on official government domains (`.gov.in` / `.nic.in` / `.mahaonline.gov.in`).
        </div>
      </div>
    </div>
  );
};
