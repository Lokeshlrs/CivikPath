import { generateCivicAnswer } from '../services/civicAnswerService.js';
import { generateGuidedCivicService } from '../services/guidedAiService.js';

export const askCivicQuestion = async (req, res, next) => {
  const startTime = Date.now();
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        answer: 'Please provide a valid question in the request body',
        sources: [],
        grounded: false,
      });
    }

    const result = await generateCivicAnswer(question);
    const durationMs = Date.now() - startTime;

    console.log(`[AI Guidance Engine Audit] ${new Date().toISOString()} | Q_Length: ${question.length} | Sources_Count: ${result.sources?.length || 0} | Grounded: ${result.grounded} | Duration: ${durationMs}ms`);

    return res.status(result.statusCode || 200).json(result);
  } catch (error) {
    console.error('[AI Controller Error]', error.message);
    next(error);
  }
};

export const guideCivicService = async (req, res, next) => {
  const startTime = Date.now();
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        matched: false,
        grounded: false,
        guidance: 'Please provide a valid question in the request body',
        roadmap: [],
        sources: [],
      });
    }

    const result = await generateGuidedCivicService(question);
    const durationMs = Date.now() - startTime;

    console.log(`[AI Guided Service Audit] ${new Date().toISOString()} | Q_Length: ${question.length} | Matched: ${result.matched} | Grounded: ${result.grounded} | Duration: ${durationMs}ms`);

    return res.status(result.statusCode || 200).json(result);
  } catch (error) {
    console.error('[AI Guide Controller Error]', error.message);
    next(error);
  }
};
