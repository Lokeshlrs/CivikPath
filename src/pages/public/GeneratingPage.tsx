import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { Route, CheckCircle2, Loader2, Circle, ShieldCheck, AlertTriangle, ArrowLeft, Search } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useCivic } from '../../context/CivicContext';
import { guideCivicService } from '../../services/aiService';

export const GeneratingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentTaskInput, setGuidedProcedure } = useCivic();
  const [matchFailed, setMatchFailed] = useState<boolean>(false);
  const [queryText, setQueryText] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const taskQuery = (currentTaskInput || 'Water Connection Application').trim();
    setQueryText(taskQuery);

    guideCivicService(taskQuery)
      .then((res) => {
        if (!isMounted) return;
        if (res && res.matched && res.task && res.roadmap) {
          // Immediately set procedure and navigate to roadmap without artificial delay
          setGuidedProcedure(res);
          navigate('/roadmap', { replace: true });
        } else {
          setMatchFailed(true);
        }
      })
      .catch((err) => {
        console.warn('[GeneratingPage] API guide call failed:', err);
        if (isMounted) setMatchFailed(true);
      });

    return () => {
      isMounted = false;
    };
  }, [currentTaskInput, navigate, setGuidedProcedure]);

  if (matchFailed) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-between p-6 text-left">
        <div className="w-full max-w-7xl mx-auto flex justify-start pt-2">
          <Logo size="sm" />
        </div>

        <div className="w-full max-w-lg mx-auto my-auto py-10 space-y-6">
          <div className="bg-white border border-amber-200 rounded-3xl p-8 shadow-lg space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Service Not Found
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight pt-2">
                We couldn't find a matching government service
              </h1>
              <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                CivicPath grounds guidance strictly in verified government database procedures. We couldn't find an official service matching your request:
              </p>
              <div className="bg-slate-100 p-3 rounded-xl text-xs font-mono font-bold text-slate-800 border border-slate-200 mt-2">
                "{queryText || currentTaskInput || 'Unknown Request'}"
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-left">
              <span className="font-bold text-slate-700 block">Try entering requests such as:</span>
              <ul className="text-slate-600 space-y-1 font-medium list-disc list-inside">
                <li>I want to apply for a passport</li>
                <li>I need an income certificate / caste certificate</li>
                <li>I want a water connection application</li>
                <li>I need a driving licence</li>
                <li>I want to register my business (Udyam MSME / Trade License)</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                kind="secondary"
                size="md"
                icon={ArrowLeft}
                onClick={() => navigate('/task')}
                className="w-full sm:w-auto"
              >
                Try Another Request
              </Button>
              <Button
                kind="primary"
                size="md"
                icon={Search}
                onClick={() => navigate('/services')}
                className="w-full sm:w-auto"
              >
                Browse All Services
              </Button>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 pb-4 text-center">
          CivicPath • Authoritative Indian Government Service Platform
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/80 via-white to-slate-50 flex flex-col items-center justify-between p-6">
      <div className="w-full max-w-7xl mx-auto flex justify-start pt-2">
        <Logo size="sm" />
      </div>

      <div className="w-full max-w-md mx-auto text-center space-y-8 my-auto py-12">
        {/* Route Icon animation */}
        <div className="relative w-20 h-20 rounded-3xl bg-white border border-blue-200 shadow-xl shadow-blue-500/10 flex items-center justify-center mx-auto text-blue-600">
          <Route size={36} className="animate-pulse" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white">
            <Loader2 size={12} className="animate-spin" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Building your civic path...
          </h1>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Fetching verified government procedure from MongoDB catalog...
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200 w-fit mx-auto">
          <ShieldCheck size={14} />
          <span>Verifying database catalog & official sources</span>
        </div>
      </div>

      <div className="text-xs text-slate-400 pb-4">
        CivicPath • Authoritative Municipal Bureaucracy Visualizer
      </div>
    </div>
  );
};
