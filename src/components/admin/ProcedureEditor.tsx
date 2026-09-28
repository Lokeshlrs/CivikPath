import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { RoadmapGraph } from '../roadmap/RoadmapGraph';
import { Plus, Save, Send, GitBranch } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const ProcedureEditor: React.FC = () => {
  const { activeProcedure, selectedStep, setSelectedStep, updateStepInProcedure } = useCivic();

  const [editTitle, setEditTitle] = useState(selectedStep.title);
  const [editDescription, setEditDescription] = useState(selectedStep.fullDescription);
  const [editSource, setEditSource] = useState(selectedStep.officialSource || '');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Keep local state in sync when selected step changes
  React.useEffect(() => {
    setEditTitle(selectedStep.title);
    setEditDescription(selectedStep.fullDescription);
    setEditSource(selectedStep.officialSource || '');
  }, [selectedStep]);

  const handleSaveStep = () => {
    updateStepInProcedure({
      ...selectedStep,
      title: editTitle,
      fullDescription: editDescription,
      officialSource: editSource,
    });
    alert('Step changes saved to local procedure draft.');
  };

  const handlePublish = () => {
    setIsPublishModalOpen(false);
    alert('Procedure successfully published to citizen-facing roadmap!');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header & Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
              PROCEDURE WORKFLOW EDITOR
            </span>
            <Badge type="verified" size="sm" />
          </div>
          <h2 className="text-xl font-bold text-white mt-0.5">{activeProcedure.title}</h2>
          <p className="text-xs text-slate-400">Location: {activeProcedure.location}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button kind="secondary" size="md" icon={Save} onClick={handleSaveStep}>
            Save Draft
          </Button>
          <Button
            kind="primary"
            size="md"
            icon={Send}
            onClick={() => setIsPublishModalOpen(true)}
          >
            Publish Verified Procedure
          </Button>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Procedure Steps (3 cols) */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">STEPS LIST</h3>
          </div>

          <div className="space-y-2">
            {activeProcedure.steps.map((step, idx) => {
              const isSelected = step.id === selectedStep.id;
              return (
                <div
                  key={step.id}
                  onClick={() => setSelectedStep(step)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[11px] font-bold text-slate-400">Step {idx + 1}</div>
                  <div className="text-xs font-semibold truncate">{step.title}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER: React Flow Graph (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <GitBranch size={16} className="text-blue-400" /> DEPENDENCY GRAPH
            </h3>
          </div>
          <RoadmapGraph
            steps={activeProcedure.steps}
            selectedStepId={selectedStep.id}
            onSelectStep={(id) => {
              const step = activeProcedure.steps.find((s) => s.id === id);
              if (step) setSelectedStep(step);
            }}
          />
        </div>

        {/* RIGHT: Selected Step Editor (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              SELECTED STEP EDITOR
            </h3>
            <div className="text-sm font-bold text-white mt-1">{selectedStep.title}</div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Step Name</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Full Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Official Source</label>
              <input
                type="text"
                value={editSource}
                onChange={(e) => setEditSource(e.target.value)}
                className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleSaveStep}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
              >
                Update Selected Step
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal before Publish */}
      <Modal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        title="Confirm Procedure Publication"
      >
        <div className="space-y-4 text-slate-700 text-sm">
          <p className="font-semibold text-slate-900">
            Publishing changes will update the citizen-facing roadmap.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Ensure all legal prerequisites, document checklists, and official source URLs have been verified against original government gazettes.
          </p>
          <div className="pt-4 flex justify-end gap-2">
            <Button kind="secondary" size="md" onClick={() => setIsPublishModalOpen(false)}>
              Cancel
            </Button>
            <Button kind="primary" size="md" onClick={handlePublish}>
              Confirm & Publish
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
