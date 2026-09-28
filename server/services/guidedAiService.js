import { matchCivicService, isPromptInjection } from './civicMatcherService.js';
import { ProcedureStep } from '../models/ProcedureStep.js';
import { DocumentRequirement } from '../models/DocumentRequirement.js';
import { Dependency } from '../models/Dependency.js';
import { GovernmentSource } from '../models/GovernmentSource.js';
import { Procedure } from '../models/Procedure.js';
import { getVerifiedSources } from './verifiedSourceRetrievalService.js';
import { GoogleGenAI } from '@google/genai';

const UNMATCHED_FALLBACK_GUIDANCE = "CivicPath does not currently have a verified roadmap for this service.";
const INJECTION_SAFETY_GUIDANCE = "CivicPath can only provide guidance based on its existing civic-service data and verified government sources.";

const isPlaceholder = (val) => {
  if (!val || typeof val !== 'string') return true;
  const trimmed = val.trim();
  return (
    trimmed.startsWith('[') ||
    trimmed.endsWith(']') ||
    /\[.*department.*\]/i.test(trimmed) ||
    /\[.*document.*\]/i.test(trimmed) ||
    /\[.*domain.*\]/i.test(trimmed)
  );
};

export const generateGuidedCivicService = async (question) => {
  if (!question || typeof question !== 'string' || !question.trim()) {
    return {
      success: false,
      statusCode: 400,
      matched: false,
      grounded: false,
      grounding: {
        databaseGrounded: false,
        officialSourceVerified: false,
        status: 'unavailable',
      },
      guidance: 'Please provide a valid, non-empty question.',
      roadmap: [],
      sources: [],
    };
  }

  const cleanQuestion = question.trim();

  // Safety check for prompt injection
  if (isPromptInjection(cleanQuestion)) {
    console.log(`[GuidedAiService] Prompt injection / fabrication attempt blocked: "${cleanQuestion}"`);
    return {
      success: true,
      statusCode: 200,
      matched: false,
      grounded: false,
      grounding: {
        databaseGrounded: false,
        officialSourceVerified: false,
        status: 'unavailable',
      },
      guidance: INJECTION_SAFETY_GUIDANCE,
      roadmap: [],
      sources: [],
    };
  }

  // Match against catalog procedures in MongoDB
  const matchResult = await matchCivicService(cleanQuestion);

  if (!matchResult.matched || !matchResult.procedure) {
    const responseGuidance = matchResult.isInjection
      ? INJECTION_SAFETY_GUIDANCE
      : UNMATCHED_FALLBACK_GUIDANCE;

    return {
      success: true,
      statusCode: 200,
      matched: false,
      grounded: false,
      grounding: {
        databaseGrounded: false,
        officialSourceVerified: false,
        status: matchResult.isInjection ? 'unavailable' : 'unverified',
      },
      guidance: responseGuidance,
      roadmap: [],
      sources: [],
    };
  }

  const procedure = matchResult.procedure;
  const matchedTask = matchResult.task;

  // Retrieve steps for matched procedure using .lean()
  const steps = await ProcedureStep.find({ procedureId: procedure._id })
    .sort({ order: 1, stepNumber: 1 })
    .lean();

  const stepIds = steps.map((s) => s._id);

  // Parallel database retrieval using Promise.all() & .lean()
  const [allDocs, allDeps, relatedProcs] = await Promise.all([
    DocumentRequirement.find({ stepId: { $in: stepIds } }).lean(),
    Dependency.find({ stepId: { $in: stepIds } }).lean(),
    Array.isArray(procedure.relatedProcedureIds) && procedure.relatedProcedureIds.length > 0
      ? Procedure.find({ _id: { $in: procedure.relatedProcedureIds } }).select('_id title sector department description').lean()
      : Promise.resolve([]),
  ]);

  // Retrieve procedure-linked and step-linked GovernmentSource records
  const procSourceIdStr = procedure.officialSourceId ? procedure.officialSourceId.toString() : null;
  const allSourceIds = Array.from(
    new Set([
      ...(procSourceIdStr ? [procSourceIdStr] : []),
      ...steps.flatMap((s) => s.sourceIds || []).filter(Boolean).map((id) => id.toString()),
    ])
  );

  const linkedSourcesMap = new Map();

  if (allSourceIds.length > 0) {
    const linkedSources = await GovernmentSource.find({ _id: { $in: allSourceIds } }).lean();
    linkedSources.forEach((src) => linkedSourcesMap.set(src._id.toString(), src));
  }

  const procSourceObj = procSourceIdStr ? linkedSourcesMap.get(procSourceIdStr) : null;
  const procedureOfficialSourceUrl =
    procSourceObj && procSourceObj.sourceStatus === 'verified' && procSourceObj.verificationStatus === 'approved'
      ? procSourceObj.sourceUrl || procSourceObj.url
      : null;

  const roadmapSteps = [];
  let allStepsOfficialVerified = steps.length > 0;

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    const sIdStr = s._id.toString();

    const rawStepDocs = allDocs.filter((d) => d.stepId.toString() === sIdStr);
    const rawStepDeps = allDeps.filter((d) => d.stepId.toString() === sIdStr);

    const validDocs = rawStepDocs
      .map((d) => d.name || d.documentName || '')
      .filter((docName) => docName && !isPlaceholder(docName));

    const rawDept = s.department || '';
    const cleanDept = isPlaceholder(rawDept) ? null : rawDept;

    let stepSources = [];
    let stepSourceVerified = false;

    const rawStepSourceIds = (s.sourceIds || []).map((id) => id.toString());

    if (rawStepSourceIds.length > 0) {
      const stepLinkedSources = rawStepSourceIds
        .map((id) => linkedSourcesMap.get(id))
        .filter(Boolean);

      const approvedVerifiedSources = stepLinkedSources.filter(
        (src) => src.sourceStatus === 'verified' && src.verificationStatus === 'approved'
      );

      if (stepLinkedSources.length > 0 && approvedVerifiedSources.length === stepLinkedSources.length) {
        stepSourceVerified = true;
        stepSources = approvedVerifiedSources.map((src) => ({
          sourceId: src._id.toString(),
          title: src.extractedContent?.title || src.sourceName || src.service || 'Official Government Source',
          url: src.sourceUrl || src.url,
          officialDomain: src.officialDomain || src.domain,
          verificationStatus: 'verified',
          lastCheckedAt: src.lastVerifiedAt || src.lastCheckedAt || src.updatedAt,
        }));
      }
    }

    if (!stepSourceVerified) {
      allStepsOfficialVerified = false;
    }

    roadmapSteps.push({
      stepId: sIdStr,
      stepNumber: s.order || s.stepNumber || (i + 1),
      title: s.title,
      description: s.description || '',
      department: cleanDept,
      locationMode: s.locationMode || 'Municipal Office',
      documents: validDocs,
      documentsVerified: validDocs.length > 0,
      dependencies: rawStepDeps.map((dep) => dep.description || `Prerequisite step required before Step ${s.order || i + 1}`),
      provenance: {
        database: true,
        officialSourceVerified: stepSourceVerified,
      },
      sources: stepSources,
    });
  }

  // Provenance & Grounding evaluation
  const databaseGrounded = true;
  const procedureSourceVerified = procedure.sourceStatus === 'verified';
  const officialSourceVerified = procedureSourceVerified && allStepsOfficialVerified;

  let groundingStatus = 'database_only';
  if (procedure.sourceStatus === 'review_required' || procedure.sourceStatus === 'inactive') {
    groundingStatus = 'review_required';
  } else if (officialSourceVerified) {
    groundingStatus = 'verified';
  } else if (databaseGrounded) {
    groundingStatus = 'database_only';
  } else {
    groundingStatus = 'unverified';
  }

  const grounded = databaseGrounded && officialSourceVerified;

  const grounding = {
    databaseGrounded,
    officialSourceVerified,
    status: groundingStatus,
  };

  // Retrieve approved sources list
  const verifiedSources = await getVerifiedSources();
  const filteredSources = (verifiedSources || [])
    .filter((src) => src.sourceStatus === 'verified' && src.verificationStatus === 'approved')
    .map((src) => ({
      sourceId: src.sourceId,
      title: src.title,
      url: src.url,
      officialDomain: src.officialDomain,
      verificationStatus: 'verified',
      lastCheckedAt: src.lastCheckedAt,
    }));

  // Synthesize guidance explanation
  let guidanceText = `To complete "${procedure.title}" in ${procedure.city || 'Amravati'}, follow the ${roadmapSteps.length}-step municipal roadmap:\n\n` +
    roadmapSteps.map((s) => `- Step ${s.stepNumber}: ${s.title} — ${s.description}`).join('\n');

  // Attempt fast AI enhancement if API key present (with short timeout)
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || process.env.GOOGLE_API_KEY;
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemPrompt = `Summarize guidance for "${procedure.title}" based strictly on provided database steps. Concise bullet points only.`;
      const contextData = `STEPS:\n${roadmapSteps.map((s) => `Step ${s.stepNumber}: ${s.title}`).join('\n')}`;

      const aiPromise = ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n${contextData}` }] }],
        config: { temperature: 0.1 },
      });

      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('AI Synthesis Timeout')), 1200));
      const response = await Promise.race([aiPromise, timeoutPromise]);
      if (response && response.text) {
        guidanceText = response.text.trim();
      }
    } catch (llmErr) {
      // Fast fallback to deterministic guidance synthesis
    }
  }

  // Ensure procedure official source is prepended if verified and not present
  let responseSources = filteredSources;
  if (procSourceObj && procSourceObj.sourceStatus === 'verified' && procSourceObj.verificationStatus === 'approved') {
    const procFormattedSource = {
      sourceId: procSourceObj._id.toString(),
      title: procSourceObj.extractedContent?.title || procSourceObj.sourceName || procSourceObj.service || 'Official Government Source',
      url: procSourceObj.sourceUrl || procSourceObj.url,
      officialDomain: procSourceObj.officialDomain || procSourceObj.domain,
      verificationStatus: 'verified',
      lastCheckedAt: procSourceObj.lastVerifiedAt || procSourceObj.updatedAt,
    };

    const exists = responseSources.some((s) => s.url === procFormattedSource.url);
    if (!exists) {
      responseSources = [procFormattedSource, ...responseSources];
    }
  }

  return {
    success: true,
    statusCode: 200,
    matched: true,
    grounded,
    grounding,
    task: {
      taskId: (matchedTask._id || procedure._id).toString(),
      procedureId: procedure._id.toString(),
      title: matchedTask.title || procedure.title,
      description: procedure.description || 'Municipal procedure roadmap.',
      officialSourceUrl: procedureOfficialSourceUrl || undefined,
    },
    guidance: guidanceText,
    roadmap: roadmapSteps,
    sources: responseSources,
    relatedServices: relatedProcs.map((rp) => ({
      id: rp._id.toString(),
      title: rp.title,
      sector: rp.sector || 'Related Service',
      department: rp.department || 'Municipal Office',
      description: rp.description || '',
    })),
  };
};
