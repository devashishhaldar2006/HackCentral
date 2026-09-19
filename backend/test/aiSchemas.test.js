import { describe, it, expect } from "vitest";
import { ProjectEvaluationSchema, PitchDeckSchema } from "../src/lib/aiSchemas.js";

describe("AI Response Schemas", () => {
  it("successfully validates compliant ProjectEvaluationSchema object", () => {
    const validData = {
      innovationScore: 8,
      technicalComplexity: 9,
      marketPotential: 7,
      presentationReadiness: 8,
      strengths: ["Clean modular design", "Good problem-market fit"],
      weaknesses: ["Needs end-to-end testing"],
      improvements: ["Add rate limiting", "Improve cache strategy"],
      overallFeedback: "Solid architectural direction and clear execution.",
    };

    const parsed = ProjectEvaluationSchema.safeParse(validData);
    expect(parsed.success).toBe(true);
  });

  it("fails validation if scores are out of bounds", () => {
    const invalidData = {
      innovationScore: 12, // Exceeds max 10
      technicalComplexity: 0, // Below min 1
      marketPotential: 7,
      presentationReadiness: 8,
    };

    const parsed = ProjectEvaluationSchema.safeParse(invalidData);
    expect(parsed.success).toBe(false);
  });

  it("successfully validates compliant PitchDeckSchema object with defaults", () => {
    const pitchData = {
      problemStatement: "Fragmented tech hackathons and poor discovery.",
      solutionOverview: "Centralized discovery platform with AI assistance.",
    };

    const parsed = PitchDeckSchema.safeParse(pitchData);
    expect(parsed.success).toBe(true);
    expect(parsed.data.targetAudience).toBe("");
  });
});
