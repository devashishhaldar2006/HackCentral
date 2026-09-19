import { z } from "zod";

export const ProjectEvaluationSchema = z.object({
  innovationScore: z.number().min(1).max(10),
  technicalComplexity: z.number().min(1).max(10),
  marketPotential: z.number().min(1).max(10),
  presentationReadiness: z.number().min(1).max(10),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  improvements: z.array(z.string()).default([]),
  overallFeedback: z.string().default(""),
});

export const PitchDeckSchema = z.object({
  problemStatement: z.string().default(""),
  solutionOverview: z.string().default(""),
  marketOpportunity: z.string().default(""),
  targetAudience: z.string().default(""),
  businessModel: z.string().default(""),
  technicalArchitecture: z.string().default(""),
  competitiveAdvantage: z.string().default(""),
  futureScope: z.string().default(""),
  elevatorPitch: z.string().default(""),
});
