import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { StatCard } from '../../components/admin/StatCard';
import { SourceHealthCard } from '../../components/admin/SourceHealthCard';
import { useCivic } from '../../context/CivicContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Badge } from '../../components/common/Badge';
import { ShieldCheck, FileCheck2, Database, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const { sources, adminReviews } = useCivic();

  const verifiedServicesCount = 70;
  const pendingReviewsCount = adminReviews.filter((r) => r.verificationStatus === 'pending_human_review').length;

  const recentActivities = [
    {
      service: 'Water Connection Application',
      location: 'Amravati, Maharashtra',
      source: 'Amravati Municipal Corporation Portal',
      status: 'verified',
      lastUpdated: '2026-09-25',
    },
    {
      service: 'Fresh Passport Application',
      location: 'National / Amravati',
      source: 'Passport Seva Official Portal',
      status: 'verified',
      lastUpdated: '2026-09-25',
    },
    {
      service: 'Fresh Driving Licence Application',
      location: 'National / Amravati',
      source: 'Sarathi Parivahan RTO Portal',
      status: 'verified',
      lastUpdated: '2026-09-24',
    },
    {
      service: 'Income Certificate Application',
      location: 'Amravati, Maharashtra',
      source: 'Aaple Sarkar MahaOnline Portal',
      status: 'verified',
      lastUpdated: '2026-09-24',
    },
  ];

  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="Overview of government sources, extraction reviews, and system health."
    >
      <div className="space-y-8 text-left">
        <div className="flex items-center justify-between gap-4">
          <Badge type="verified" size="md" />
        </div>

        {/* Top 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="VERIFIED SERVICES"
            value={verifiedServicesCount}
            subtitle="Published active catalog procedures"
            icon={ShieldCheck}
            color="emerald"
          />
          <StatCard
            title="PENDING REVIEWS"
            value={pendingReviewsCount}
            subtitle="Requires human verification"
            icon={FileCheck2}
            color="amber"
          />
          <StatCard
            title="TOTAL SOURCES"
            value={sources.length}
            subtitle="Registered official domains"
            icon={Database}
            color="blue"
          />
          <StatCard
            title="RECENT UPDATES"
            value={8}
            subtitle="Automated change scans"
            icon={Clock}
            color="purple"
          />
        </div>

        {/* Source Health Section */}
        <SourceHealthCard sources={sources} />

        {/* Recent Activity Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs space-y-4">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-white">Recent Activity & Updates</h2>
              <Badge type="verified" size="sm" />
            </div>
            <Link
              to="/admin/verification"
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>View Review Queue</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 text-left">Service</th>
                  <th className="py-3.5 px-4 text-left">Location</th>
                  <th className="py-3.5 px-4 text-left">Source</th>
                  <th className="py-3.5 px-4 text-left">Status</th>
                  <th className="py-3.5 px-4 text-right">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {recentActivities.map((act, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{act.service}</td>
                    <td className="py-3.5 px-4 text-slate-300">{act.location}</td>
                    <td className="py-3.5 px-4 font-mono text-blue-400">{act.source}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={act.status as any} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400">{act.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
