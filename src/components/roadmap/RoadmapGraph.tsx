import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { RoadmapNode } from './RoadmapNode';
import { ProcedureStep } from '../../types';
import { isPlaceholder } from '../../utils/placeholderUtils';

interface RoadmapGraphProps {
  steps: ProcedureStep[];
  selectedStepId: string;
  onSelectStep: (stepId: string) => void;
  interactive?: boolean;
}

const nodeTypes = {
  roadmapNode: RoadmapNode,
};

export const RoadmapGraph: React.FC<RoadmapGraphProps> = ({
  steps,
  selectedStepId,
  onSelectStep,
  interactive = true,
}) => {
  const dynamicNodes: Node[] = useMemo(() => {
    if (!steps || steps.length === 0) return [];

    // Layout configuration: vertical ladder flow with branch offset for documents
    let mainY = 20;
    let docXOffset = 0;

    return steps.map((step, idx) => {
      const stepNodeId = step.id || step.nodeId || `step-${idx + 1}`;
      const cleanTitle = isPlaceholder(step.title) ? `Step ${idx + 1}` : step.title;
      const rawDesc = step.shortDescription || step.fullDescription || '';
      const cleanDesc = isPlaceholder(rawDesc) ? 'Procedure step' : rawDesc;

      let xPos = 250;
      let yPos = mainY;

      if (step.isDocument || stepNodeId.startsWith('doc-')) {
        xPos = docXOffset === 0 ? 0 : docXOffset === 1 ? 250 : 500;
        docXOffset = (docXOffset + 1) % 3;
        if (docXOffset === 0) mainY += 130;
      } else {
        mainY += 130;
        docXOffset = 0;
      }

      return {
        id: stepNodeId,
        type: 'roadmapNode',
        position: { x: xPos, y: yPos },
        data: {
          stepId: step.id,
          title: cleanTitle,
          shortDescription: cleanDesc,
          status: step.status || 'not_started',
          sourceStatus: step.sourceStatus || 'database_only',
          isDocument: step.isDocument || false,
          onNodeClick: onSelectStep,
        },
      };
    });
  }, [steps, onSelectStep]);

  const dynamicEdges: Edge[] = useMemo(() => {
    if (!steps || steps.length <= 1) return [];

    const edgesList: Edge[] = [];
    for (let i = 0; i < steps.length - 1; i++) {
      const sourceId = steps[i].id || steps[i].nodeId;
      const targetId = steps[i + 1].id || steps[i + 1].nodeId;

      edgesList.push({
        id: `e-${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId,
        animated: true,
        style: { stroke: '#2563eb', strokeWidth: 2 },
      });
    }

    return edgesList;
  }, [steps]);

  const [nodes, setNodes, onNodesChange] = useNodesState(dynamicNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(dynamicEdges);

  React.useEffect(() => {
    const selectedNodes = dynamicNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        selected: node.data.stepId === selectedStepId || node.id === selectedStepId,
      },
    }));
    setNodes(selectedNodes);
    setEdges(dynamicEdges);
  }, [dynamicNodes, dynamicEdges, selectedStepId, setNodes, setEdges]);

  return (
    <div className="w-full h-[680px] bg-slate-50/50 rounded-2xl border border-slate-200 relative overflow-hidden">
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 text-xs font-bold text-slate-700">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Interactive Civic Dependency Graph</span>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={interactive}
        nodesConnectable={false}
        zoomOnScroll={false}
        className="civic-roadmap-flow"
      >
        <Background color="#cbd5e1" gap={18} size={1} />
        <Controls showInteractive={interactive} />
      </ReactFlow>
    </div>
  );
};
