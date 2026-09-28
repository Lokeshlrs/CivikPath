import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, ShieldAlert, AlertTriangle, ArrowRight, Building2, MapPin, Sparkles, Filter } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useCivic } from '../../context/CivicContext';
import { procedureService } from '../../services/procedureService';

interface ServiceItem {
  _id: string;
  id: string;
  title: string;
  description: string;
  serviceType: string;
  jurisdiction: string;
  location: {
    state: string;
    district: string;
    city: string;
  };
  status: string;
  sourceStatus: string;
  groundingStatus: {
    databaseGrounded: boolean;
    officialSourceVerified: boolean;
    status: string;
  };
  sourcesCount: number;
  sources: Array<{
    sourceId: string;
    title: string;
    url: string;
    officialDomain: string;
    verificationStatus: string;
  }>;
  stepsCount: number;
}

export const ServiceCatalog: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentTaskInput } = useCivic();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'verified' | 'database'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await procedureService.getProcedures();
      if (res.success && Array.isArray(res.data)) {
        setServices(res.data as any);
      }
    } catch (err) {
      console.error('Failed to fetch service catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectService = (service: ServiceItem) => {
    setCurrentTaskInput(service.title);
    navigate('/generating');
  };

  // Extract unique categories
  const categories = Array.from(new Set(services.map((s) => s.serviceType).filter(Boolean)));

  // Filtered services
  const filteredServices = services.filter((service) => {
    const query = searchQuery.toLowerCase().trim();
    const aliasesStr = Array.isArray((service as any).aliases) ? (service as any).aliases.join(' ') : '';
    const keywordsStr = Array.isArray((service as any).keywords) ? (service as any).keywords.join(' ') : '';

    // Search query filter (Part K: title, aliases, keywords, description, department, sector, jurisdiction)
    const matchesSearch =
      !query ||
      service.title.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query) ||
      (service.serviceType || '').toLowerCase().includes(query) ||
      ((service as any).department || '').toLowerCase().includes(query) ||
      ((service as any).jurisdiction || '').toLowerCase().includes(query) ||
      aliasesStr.toLowerCase().includes(query) ||
      keywordsStr.toLowerCase().includes(query);

    // Verification filter
    let matchesVerification = true;
    if (selectedFilter === 'verified') {
      matchesVerification = service.groundingStatus?.officialSourceVerified === true;
    } else if (selectedFilter === 'database') {
      matchesVerification = service.groundingStatus?.officialSourceVerified === false;
    }

    // Category filter
    let matchesCategory = true;
    if (selectedCategory !== 'all') {
      matchesCategory = service.serviceType.toLowerCase() === selectedCategory.toLowerCase();
    }

    return matchesSearch && matchesVerification && matchesCategory;
  });

  return (
    <div className="space-y-8 text-left">
      {/* Search and Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
            <Building2 size={14} />
            <span>REAL GOVERNMENT SERVICE CATALOG</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Explore Verified Civic Services
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl">
            Browse official government procedures, document checklists, and verified municipal roadmaps.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search civic services (e.g. Caste Certificate, Trade License, Water Connection)..."
            className="w-full h-12 pl-11 pr-4 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-white text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-slate-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Filter size={13} /> Trust Level:
          </span>
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            All Services ({services.length})
          </button>
          <button
            onClick={() => setSelectedFilter('verified')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedFilter === 'verified'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-emerald-400 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck size={14} /> Officially Verified
          </button>
          <button
            onClick={() => setSelectedFilter('database')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedFilter === 'database'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-amber-400 hover:bg-slate-800'
            }`}
          >
            <ShieldAlert size={14} /> Database Only
          </button>
        </div>

        {/* Category Pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60">
            <span className="text-xs font-semibold text-slate-400">Category:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-800/40 text-slate-400 hover:text-white'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-800/40 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 font-medium space-y-2">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm">Loading verified civic catalog...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <ShieldAlert size={36} className="text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No matching services found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query or filter settings. CivicPath only returns procedures present in its authoritative database.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const isVerified = service.groundingStatus?.officialSourceVerified === true;
            const isReviewRequired = service.groundingStatus?.status === 'review_required';

            return (
              <div
                key={service._id || service.id}
                onClick={() => handleSelectService(service)}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      {service.serviceType || 'Municipal Service'}
                    </span>

                    {/* Trust Indicator */}
                    {isVerified ? (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                        <ShieldCheck size={13} className="text-emerald-600" />
                        <span>Officially Verified</span>
                      </div>
                    ) : isReviewRequired ? (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                        <AlertTriangle size={13} className="text-rose-600" />
                        <span>Review Required</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                        <ShieldAlert size={13} className="text-amber-600" />
                        <span>Database Only</span>
                      </div>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {service.description || 'Verified government application roadmap.'}
                    </p>
                  </div>
                </div>

                {/* Bottom Metadata & Button */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1">
                      <MapPin size={13} className="text-blue-600" />
                      <span>{service.location?.city || 'Amravati'}, {service.location?.state || 'Maharashtra'}</span>
                    </div>
                    <span>{service.stepsCount || 3} steps</span>
                  </div>

                  {/* Sources indication */}
                  <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
                    <span>
                      {service.sourcesCount > 0
                        ? `✓ ${service.sourcesCount} Verified Govt Source`
                        : 'No official source attached'}
                    </span>
                    <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Explore Roadmap <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
