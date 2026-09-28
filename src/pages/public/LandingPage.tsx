import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Lock, MapPin, Search } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useCivic } from '../../context/CivicContext';

import { AskCivicAiCard } from '../../components/civic/AskCivicAiCard';
import { ServiceCatalog } from '../../components/civic/ServiceCatalog';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentTaskInput, setCurrentTaskInput } = useCivic();
  const [inputVal, setInputVal] = useState(currentTaskInput);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setCurrentTaskInput(inputVal.trim());
      navigate('/generating');
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-xs font-bold border border-blue-200">
            <Sparkles size={14} className="text-blue-600" />
            <span>AI-powered civic guidance</span>
          </div>

          {/* Headings */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Civic procedures, without the confusion.
          </h1>

          <p className="text-xl sm:text-2xl font-semibold text-blue-600">
            "Your path through government, made simple."
          </p>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            Tell us what you want to do. We'll help you understand the required steps using verified official government information.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mt-8">
            <div className="bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-300 shadow-xl shadow-blue-500/5 flex flex-col sm:flex-row items-center gap-2">
              <div className="flex-1 w-full px-3 py-1 flex flex-col text-left">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
                  What do you want to do?
                </label>
                <div className="flex items-center gap-2 mt-0.5">
                  <Search size={18} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="I want to apply for a passport"
                    className="w-full text-base font-semibold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
              <Button kind="primary" size="lg" type="submit" className="w-full sm:w-auto shrink-0">
                Find My Path →
              </Button>
            </div>
          </form>

          {/* Embedded Grounded AI Guidance Section */}
          <div className="mt-10 max-w-3xl mx-auto">
            <AskCivicAiCard />
          </div>

          {/* Trust Indicators */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 size={14} />
              </div>
              <span>Official sources</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 size={14} />
              </div>
              <span>Verified information</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 size={14} />
              </div>
              <span>Step-by-step guidance</span>
            </div>
          </div>


          {/* Official Source Badge Note */}
          <div className="pt-4 flex flex-col items-center justify-center gap-2 text-xs text-slate-500">
            <Badge type="official" size="md" />
            <p className="max-w-md font-medium">
              Important information is linked to its original government source.
            </p>
          </div>

          {/* Location note */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <MapPin size={14} className="text-blue-600" />
            <span>Location will be confirmed before generating your path.</span>
          </div>
        </div>
      </section>

      {/* Service Catalog Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ServiceCatalog />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            SIMPLE & TRANSPARENT
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">How CivicPath Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 relative shadow-xs hover:border-blue-300 transition-all">
            <span className="absolute top-6 right-6 text-2xl font-black text-slate-200">01</span>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg mb-6">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Tell us what you need</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Describe your goal in plain words and confirm your municipality location.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 relative shadow-xs hover:border-blue-300 transition-all">
            <span className="absolute top-6 right-6 text-2xl font-black text-slate-200">02</span>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg mb-6">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">We verify the path</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We map dependencies strictly against verified official government sources.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 relative shadow-xs hover:border-blue-300 transition-all">
            <span className="absolute top-6 right-6 text-2xl font-black text-slate-200">03</span>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg mb-6">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Follow your roadmap</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Track document checklists, dependencies, and official portals with zero guesswork.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 bg-white border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <Badge type="official" size="md" />
          <h2 className="text-2xl font-bold text-slate-900">Democratizing Municipal Bureaucracy</h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            CivicPath converts complex municipal gazettes and department manuals into visual, interactive procedural roadmaps, connecting Indian citizens directly to verified government endpoints.
          </p>
        </div>
      </section>
    </MainLayout>
  );
};
