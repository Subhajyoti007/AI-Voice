'use server';
/**
 * @fileOverview Calculates a confidence score indicating the alignment of the generated post with the client's views.
 *
 * - calculateAlignmentScore - A function that calculates the alignment score.
 * - CalculateAlignmentScoreInput - The input type for the calculateAlignmentScore function.
 * - CalculateAlignmentScoreOutput - The return type for the calculateAlignmentScore function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const CalculateAlignmentScoreInputSchema = z.object({
  post: z.string().describe('The generated LinkedIn post.'),
  perspectives: z.array(z.string()).describe('The client perspectives.'),
});
export type CalculateAlignmentScoreInput = z.infer<typeof CalculateAlignmentScoreInputSchema>;

const CalculateAlignmentScoreOutputSchema = z.object({
  score: z.number().describe('The alignment score between 0 and 1.'),
  explanation: z.string().describe('Explanation of how the score was derived.'),
});
export type CalculateAlignmentScoreOutput = z.infer<typeof CalculateAlignmentScoreOutputSchema>;

export async function calculateAlignmentScore(input: CalculateAlignmentScoreInput): Promise<CalculateAlignmentScoreOutput> {
  return calculateAlignmentScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateAlignmentScorePrompt',
  input: {
    schema: z.object({
      post: z.string().describe('The generated LinkedIn post.'),
      perspectives: z.array(z.string()).describe('The client perspectives.'),
    }),
  },
  output: {
    schema: z.object({
      score: z.number().describe('The alignment score between 0 and 1.'),
      explanation: z.string().describe('Explanation of how the score was derived.'),
    }),
  },
  prompt: `You are an expert in analyzing text for alignment with a given set of perspectives.

You will receive a LinkedIn post and a set of perspectives. Your task is to determine how well the post aligns with the provided perspectives.

Post: {{{post}}}

Perspectives:
{{#each perspectives}}
- {{{this}}}
{{/each}}

Based on your analysis, provide an alignment score between 0 and 1, where 0 indicates no alignment and 1 indicates perfect alignment. Also, provide a brief explanation of how you arrived at the score. Consider factors such as the presence of keywords related to the perspectives, the overall sentiment expressed in the post, and any contradictions or inconsistencies with the perspectives.

Ensure that your output is a JSON object containing the score and the explanation.
`,
});

const calculateAlignmentScoreFlow = ai.defineFlow<
  typeof CalculateAlignmentScoreInputSchema,
  typeof CalculateAlignmentScoreOutputSchema
>({
  name: 'calculateAlignmentScoreFlow',
  inputSchema: CalculateAlignmentScoreInputSchema,
  outputSchema: CalculateAlignmentScoreOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
