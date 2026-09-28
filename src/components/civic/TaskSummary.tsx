import React from 'react';
import { Edit3, MapPin, FileText, User } from 'lucide-react';
import { LocationState } from '../../types';
import { Badge } from '../common/Badge';

interface TaskSummaryProps {
  taskInput: string;
  location: LocationState;
  onEditTask: () => void;
  onEditLocation: () => void;
  onEditAnswers: () => void;
}

export const TaskSummary: React.FC<TaskSummaryProps> = ({
  taskInput,
  location,
  onEditTask,
  onEditLocation,
  onEditAnswers,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto space-y-4 text-left">
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        {/* Task row */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                TASK
              </span>
              <h3 className="text-base font-bold text-slate-900">{taskInput}</h3>
            </div>
          </div>
          <button
            onClick={onEditTask}
            className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="Edit task"
          >
            <Edit3 size={16} />
          </button>
        </div>

        {/* Location row */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                LOCATION
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {location.city}, {location.state}
              </h3>
            </div>
          </div>
          <button
            onClick={onEditLocation}
            className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="Edit location"
          >
            <Edit3 size={16} />
          </button>
        </div>

        {/* Applicant Details row */}
        <div className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <User size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                APPLICANT PROFILE
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Standard Citizen Application • Official Municipal Jurisdiction
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Trust message banner */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs leading-relaxed text-emerald-900">
        <div className="flex flex-col gap-1.5 shrink-0 mt-0.5">
          <Badge type="official" size="sm" />
          <Badge type="demo" size="sm" />
        </div>
        <div>
          <strong className="text-emerald-950 font-bold block mb-0.5">
            Built from verified official sources
          </strong>
          CivicPath organizes information from verified official sources only. Always check original official sources for final processing.
        </div>
      </div>
    </div>
  );
};
