
import { validateProjectEvaluationData, validatePitchDeckData } from "../lib/validate.js";
import { projectEvaluationPrompt, pitchDeckPrompt } from "../lib/utils.js";
import ai from "../lib/geminiService.js";

export const evaluateProject = async (req, res) => {
  try {
    validateProjectEvaluationData(req);
    const {
      title,
      description,
      techStack,
    } = req.body;

    const prompt = projectEvaluationPrompt(
      title,
      description,
      techStack,
    );

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text;

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(text);

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const generatePitchDeck = async (req, res) => {
  try {
    validatePitchDeckData(req);

    const {
      title,
      problem,
      solution,
      targetAudience,
      techStack,
    } = req.body;

    const prompt = pitchDeckPrompt(
      title,
      problem,
      solution,
      targetAudience,
      techStack,
    );
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text;

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(text);

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Generate Pitch Deck Error:", error);

    return res.status(
      error.isValidationError ? 400 : 500,
    ).json({
      success: false,
      message: error.message,
    });
  }
};