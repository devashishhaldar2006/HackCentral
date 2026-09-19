
import { validateProjectEvaluationData, validatePitchDeckData } from "../lib/validate.js";
import { projectEvaluationPrompt, pitchDeckPrompt } from "../lib/utils.js";
import ai from "../lib/geminiService.js";
import { ProjectEvaluationSchema, PitchDeckSchema } from "../lib/aiSchemas.js";

// In-memory cache for recent AI results to reduce billings & protect quotas
const aiCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const getCached = (key) => {
  const item = aiCache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    aiCache.delete(key);
    return null;
  }
  return item.data;
};

const setCache = (key, data) => {
  if (aiCache.size > 200) {
    const oldestKey = aiCache.keys().next().value;
    aiCache.delete(oldestKey);
  }
  aiCache.set(key, { data, timestamp: Date.now() });
};

export const evaluateProject = async (req, res) => {
  try {
    validateProjectEvaluationData(req);
    const { title, description, techStack } = req.body;

    const cacheKey = `eval:${title.trim()}:${techStack || ""}:${description.slice(0, 100)}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, result: cached, cached: true });
    }

    const prompt = projectEvaluationPrompt(title, description, techStack);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let rawText = response.text;
    if (!rawText) {
      return res.status(502).json({
        success: false,
        message: "AI returned an empty response. Please try again.",
      });
    }

    // Clean any markdown fences if present
    rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

    let parsedJson;
    try {
      parsedJson = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("AI JSON parse failure:", rawText);
      return res.status(502).json({
        success: false,
        message: "AI generated invalid JSON structure. Please retry.",
      });
    }

    const validated = ProjectEvaluationSchema.safeParse(parsedJson);
    if (!validated.success) {
      console.error("AI Schema mismatch:", validated.error);
      return res.status(502).json({
        success: false,
        message: "AI response did not meet required schema specification.",
        details: validated.error.errors,
      });
    }

    setCache(cacheKey, validated.data);

    return res.status(200).json({
      success: true,
      result: validated.data,
    });
  } catch (error) {
    console.error("evaluateProject error:", error);
    return res.status(error.isValidationError ? 400 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const generatePitchDeck = async (req, res) => {
  try {
    validatePitchDeckData(req);
    const { title, problem, solution, targetAudience, techStack } = req.body;

    const cacheKey = `pitch:${title.trim()}:${problem.slice(0, 80)}:${solution.slice(0, 80)}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, result: cached, cached: true });
    }

    const prompt = pitchDeckPrompt(title, problem, solution, targetAudience, techStack);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let rawText = response.text;
    if (!rawText) {
      return res.status(502).json({
        success: false,
        message: "AI returned an empty response. Please try again.",
      });
    }

    rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

    let parsedJson;
    try {
      parsedJson = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("Pitch deck JSON parse failure:", rawText);
      return res.status(502).json({
        success: false,
        message: "AI generated invalid pitch deck format. Please retry.",
      });
    }

    const validated = PitchDeckSchema.safeParse(parsedJson);
    if (!validated.success) {
      console.error("Pitch deck Schema mismatch:", validated.error);
      return res.status(502).json({
        success: false,
        message: "AI pitch deck did not meet required format.",
        details: validated.error.errors,
      });
    }

    setCache(cacheKey, validated.data);

    return res.status(200).json({
      success: true,
      result: validated.data,
    });
  } catch (error) {
    console.error("generatePitchDeck error:", error);
    return res.status(error.isValidationError ? 400 : 500).json({
      success: false,
      message: error.message,
    });
  }
};